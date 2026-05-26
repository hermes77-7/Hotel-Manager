from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Room
from .serializers import RoomSerializer


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    # Enable filtering, searching and ordering
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # Filter by exact values e.g. ?status=available&room_type=double
    filterset_fields = ['status', 'room_type', 'floor']

    # Search by text e.g. ?search=101
    search_fields = ['number', 'description']

    # Order results e.g. ?ordering=price or ?ordering=-price
    ordering_fields = ['price', 'floor', 'number']
