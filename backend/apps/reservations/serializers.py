from rest_framework import serializers
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Booking
from apps.rooms.serializers import RoomSerializer
from apps.customers.serializers import CustomerSerializer


class BookingSerializer(serializers.ModelSerializer):
    # Nested read-only details — shows full room and customer info
    room_detail = RoomSerializer(source='room',     read_only=True)
    customer_detail = CustomerSerializer(source='customer', read_only=True)

    # Human readable status
    status_display = serializers.CharField(
                        source='get_status_display',
                        read_only=True
                      )

    # Computed fields
    duration = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = Booking
        fields = [
            'id',
            'room',           # ID for writing
            'room_detail',    # Full object for reading
            'customer',       # ID for writing
            'customer_detail',  # Full object for reading
            'check_in',
            'check_out',
            'duration',
            'status',
            'status_display',
            'total_price',
            'adults',
            'children',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'total_price']

    def validate(self, data):
        # Run Django model validation through the serializer
        instance = Booking(**data)
        if self.instance:
            # Copy existing values when doing partial updates
            for attr, value in data.items():
                setattr(self.instance, attr, value)
            instance = self.instance
        try:
            instance.clean()
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.message)
        return data
