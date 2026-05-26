from rest_framework import serializers
from .models import CleaningTask, HygieneReport, SupplyLog
from apps.rooms.serializers import RoomSerializer


class CleaningTaskSerializer(serializers.ModelSerializer):
    room_detail = RoomSerializer(source='room', read_only=True)
    assigned_to_name = serializers.SerializerMethodField()
    status_display = serializers.CharField(
                             source='get_status_display',
                             read_only=True
                           )
    priority_display = serializers.CharField(
                             source='get_priority_display',
                             read_only=True
                           )
    task_type_display = serializers.CharField(
                             source='get_task_type_display',
                             read_only=True
                           )

    class Meta:
        model = CleaningTask
        fields = [
            'id', 'room', 'room_detail',
            'assigned_to', 'assigned_to_name',
            'task_type', 'task_type_display',
            'status', 'status_display',
            'priority', 'priority_display',
            'notes', 'scheduled_for',
            'started_at', 'completed_at',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_assigned_to_name(self, obj):
        if obj.assigned_to:
            return obj.assigned_to.get_full_name() or obj.assigned_to.username
        return None


class HygieneReportSerializer(serializers.ModelSerializer):
    room_detail = RoomSerializer(source='room', read_only=True)
    inspected_by_name = serializers.SerializerMethodField()
    rating_display = serializers.CharField(
                          source='get_rating_display',
                          read_only=True
                        )

    class Meta:
        model = HygieneReport
        fields = [
            'id', 'room', 'room_detail',
            'inspected_by', 'inspected_by_name',
            'rating', 'rating_display',
            'notes', 'issues_found',
            'passed', 'inspected_at',
        ]
        read_only_fields = ['inspected_at']

    def get_inspected_by_name(self, obj):
        if obj.inspected_by:
            return obj.inspected_by.get_full_name() or obj.inspected_by.username
        return None


class SupplyLogSerializer(serializers.ModelSerializer):
    used_by_name = serializers.SerializerMethodField()
    room_number  = serializers.CharField(
                     source='room.number',
                     read_only=True
                   )

    class Meta:
        model = SupplyLog
        fields = [
            'id', 'item_name', 'quantity', 'unit',
            'used_by', 'used_by_name',
            'room', 'room_number',
            'notes', 'logged_at',
        ]
        read_only_fields = ['logged_at']

    def get_used_by_name(self, obj):
        if obj.used_by:
            return obj.used_by.get_full_name() or obj.used_by.username
        return None
