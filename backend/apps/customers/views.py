from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Customer
from .serializers import CustomerSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    # Filter by exact values e.g. ?country=France&gender=male
    filterset_fields = ['gender', 'country', 'city']

    # Search across multiple fields e.g. ?search=john
    search_fields = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'id_number'
    ]

    # Order results e.g. ?ordering=last_name
    ordering_fields = ['last_name', 'first_name', 'created_at', 'email']
