from rest_framework import serializers
from .models import Invoice
from apps.reservations.serializers import BookingSerializer
from apps.customers.serializers import CustomerSerializer


class InvoiceSerializer(serializers.ModelSerializer):
    booking_detail = BookingSerializer(source='booking',  read_only=True)
    customer_detail = CustomerSerializer(source='customer', read_only=True)
    status_display = serializers.CharField(
                        source='get_status_display',
                        read_only=True
                      )
    payment_method_display = serializers.CharField(
                               source='get_payment_method_display',
                               read_only=True
                             )
    total_amount = serializers.ReadOnlyField()
    balance_due = serializers.ReadOnlyField()

    class Meta:
        model = Invoice
        fields = [
            'id',
            'booking',
            'booking_detail',
            'customer',
            'customer_detail',
            'room_charge',
            'food_charge',
            'other_charge',
            'discount',
            'total_amount',
            'amount_paid',
            'balance_due',
            'status',
            'status_display',
            'payment_method',
            'payment_method_display',
            'notes',
            'issued_at',
            'paid_at',
            'updated_at',
        ]
        read_only_fields = ['issued_at', 'updated_at']
