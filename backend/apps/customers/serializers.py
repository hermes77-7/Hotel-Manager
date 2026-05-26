from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    gender_display = serializers.CharField(
                         source='get_gender_display',
                         read_only=True
                       )
    id_type_display = serializers.CharField(
                         source='get_id_type_display',
                         read_only=True
                       )

    class Meta:
        model = Customer
        fields = [
            'id',
            'first_name',
            'last_name',
            'full_name',
            'email',
            'phone',
            'gender',
            'gender_display',
            'date_of_birth',
            'id_type',
            'id_type_display',
            'id_number',
            'address',
            'city',
            'country',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
