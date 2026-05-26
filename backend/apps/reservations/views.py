from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Booking
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related('room', 'customer').all()
    serializer_class = BookingSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    filterset_fields = ['status', 'room', 'customer']
    search_fields = [
        'customer__first_name',
        'customer__last_name',
        'room__number'
    ]
    ordering_fields = ['check_in', 'check_out', 'created_at', 'total_price']

    # ── Status transition actions ──────────────────

    @action(detail=True, methods=['post'])
    def check_in(self, request, pk=None):
        booking = self.get_object()
        if booking.status != 'confirmed':
            return Response(
                {'error': 'Only confirmed bookings can be checked in.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        booking.status = 'checked_in'
        booking.save()
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def check_out(self, request, pk=None):
        booking = self.get_object()
        if booking.status != 'checked_in':
            return Response(
                {'error': 'Only checked-in bookings can be checked out.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        booking.status = 'checked_out'
        booking.save()
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status in ['checked_out', 'cancelled']:
            return Response(
                {'error': 'This booking cannot be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        booking.status = 'cancelled'
        booking.save()
        return Response(BookingSerializer(booking).data)
