from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Invoice
from .serializers import InvoiceSerializer
from decimal import Decimal


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.select_related(
                         'booking', 'customer'
                       ).all()
    serializer_class = InvoiceSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['status', 'customer', 'payment_method']
    search_fields = [
        'customer__first_name',
        'customer__last_name',
        'booking__room__number'
    ]
    ordering_fields = ['issued_at', 'total_amount', 'status']

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        payment_method = request.data.get('payment_method', 'cash')
        invoice.amount_paid = invoice.total_amount
        invoice.payment_method = payment_method
        invoice.status = 'paid'
        invoice.paid_at = timezone.now()
        invoice.save()
        return Response(InvoiceSerializer(invoice).data)

    @action(detail=True, methods=['post'])
    def record_payment(self, request, pk=None):
        invoice = self.get_object()
        amount = request.data.get('amount', 0)
        payment_method = request.data.get('payment_method', 'cash')
        invoice.amount_paid += Decimal(float(amount))
        invoice.payment_method = payment_method
        invoice.update_status()
        if invoice.status == 'paid':
            invoice.paid_at = timezone.now()
        invoice.save()
        return Response(InvoiceSerializer(invoice).data)
