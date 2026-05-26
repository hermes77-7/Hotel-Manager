from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import CleaningTask, HygieneReport, SupplyLog
from .serializers import (
    CleaningTaskSerializer,
    HygieneReportSerializer,
    SupplyLogSerializer
)


class CleaningTaskViewSet(viewsets.ModelViewSet):
    queryset = CleaningTask.objects.select_related(
                         'room', 'assigned_to'
                       ).all()
    serializer_class = CleaningTaskSerializer
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_fields = ['status', 'priority', 'task_type', 'room', 'assigned_to']
    search_fields= ['room__number', 'notes']
    ordering_fields = ['created_at', 'scheduled_for', 'priority']

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        task = self.get_object()
        if task.status != 'pending':
            return Response(
                {'error': 'Only pending tasks can be started.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        task.status = 'in_progress'
        task.started_at = timezone.now()
        task.save()
        return Response(CleaningTaskSerializer(task).data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        task = self.get_object()
        if task.status != 'in_progress':
            return Response(
                {'error': 'Only in-progress tasks can be completed.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        task.status = 'completed'
        task.completed_at = timezone.now()
        task.save()
        # Update room cleaning status
        task.room.status = 'available'
        task.room.save()
        return Response(CleaningTaskSerializer(task).data)

    @action(detail=True, methods=['post'])
    def inspect(self, request, pk=None):
        task = self.get_object()
        if task.status != 'completed':
            return Response(
                {'error': 'Only completed tasks can be inspected.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        task.status = 'inspected'
        task.save()
        return Response(CleaningTaskSerializer(task).data)


class HygieneReportViewSet(viewsets.ModelViewSet):
    queryset = HygieneReport.objects.select_related(
                         'room', 'inspected_by'
                       ).all()
    serializer_class = HygieneReportSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['room', 'rating', 'passed']
    search_fields = ['room__number', 'notes', 'issues_found']


class SupplyLogViewSet(viewsets.ModelViewSet):
    queryset = SupplyLog.objects.select_related(
                         'room', 'used_by'
                       ).all()
    serializer_class = SupplyLogSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['room', 'used_by']
    search_fields = ['item_name', 'notes']
