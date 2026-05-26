from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import MenuItem, FoodOrder
from .serializers import (
    MenuItemSerializer,
    FoodOrderSerializer,
    CreateFoodOrderSerializer
)


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'is_available']
    search_fields = ['name', 'description']


class FoodOrderViewSet(viewsets.ModelViewSet):
    queryset = FoodOrder.objects.select_related(
                         'customer', 'room'
                       ).prefetch_related('items__menu_item').all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'room', 'customer']
    search_fields = [
        'customer__first_name',
        'customer__last_name',
        'room__number'
    ]

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateFoodOrderSerializer
        return FoodOrderSerializer

    # ── Status transitions ─────────────────────────

    @action(detail=True, methods=['post'])
    def start_preparing(self, request, pk=None):
        return self._transition(pk, 'pending', 'preparing',
                                'Order is now being prepared.')

    @action(detail=True, methods=['post'])
    def mark_ready(self, request, pk=None):
        return self._transition(pk, 'preparing', 'ready',
                                'Order is ready for delivery.')

    @action(detail=True, methods=['post'])
    def mark_delivered(self, request, pk=None):
        return self._transition(pk, 'ready', 'delivered',
                                'Order has been delivered.')

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status in ['delivered', 'cancelled']:
            return Response(
                {'error': 'This order cannot be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = 'cancelled'
        order.save()
        return Response(FoodOrderSerializer(order).data)

    def _transition(self, pk, from_status, to_status, message):
        order = self.get_object()
        if order.status != from_status:
            return Response(
                {'error': f'Order must be {from_status} to perform this action.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = to_status
        order.save()
        return Response(FoodOrderSerializer(order).data)
