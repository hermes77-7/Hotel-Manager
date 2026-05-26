from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    # Add human-readable versions of the choice fields
    room_type_display = serializers.CharField(
                            source='get_room_type_display',
                            read_only=True
                         )
    status_display = serializers.CharField(
                            source='get_status_display',
                            read_only=True
                         )

    class Meta:
        model = Room
        fields = [
            'id',
            'number',
            'room_type',
            'room_type_display',  # e.g. "Double" instead of "double"
            'floor',
            'price',
            'status',
            'status_display',     # e.g. "Available" instead of "available"
            'description',
            'capacity',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']
