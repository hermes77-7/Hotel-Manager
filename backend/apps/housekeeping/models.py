from django.db import models
from apps.rooms.models import Room
from apps.accounts.models import User


class CleaningTask(models.Model):

    class Status(models.TextChoices):
        PENDING = 'pending',     'Pending'
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED = 'completed',   'Completed'
        INSPECTED = 'inspected',   'Inspected'

    class Priority(models.TextChoices):
        LOW = 'low',    'Low'
        MEDIUM = 'medium', 'Medium'
        HIGH = 'high',   'High'

    class TaskType(models.TextChoices):
        REGULAR_CLEANING = 'regular_cleaning',  'Regular Cleaning'
        DEEP_CLEANING = 'deep_cleaning',     'Deep Cleaning'
        TURNOVER = 'turnover',          'Turnover'
        INSPECTION = 'inspection',        'Inspection'
        MAINTENANCE = 'maintenance',       'Maintenance'

    room = models.ForeignKey(
                   Room,
                   on_delete=models.CASCADE,
                   related_name='cleaning_tasks'
                 )
    assigned_to = models.ForeignKey(
                    User,
                    on_delete=models.SET_NULL,
                    null=True, blank=True,
                    related_name='cleaning_tasks'
                  )
    task_type = models.CharField(
                   max_length=30,
                   choices=TaskType.choices,
                   default=TaskType.REGULAR_CLEANING
                 )
    status = models.CharField(
                   max_length=20,
                   choices=Status.choices,
                   default=Status.PENDING
                 )
    priority = models.CharField(
                   max_length=10,
                   choices=Priority.choices,
                   default=Priority.MEDIUM
                 )
    notes = models.TextField(blank=True)
    scheduled_for = models.DateField(null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.task_type} - Room {self.room.number} ({self.status})"


class HygieneReport(models.Model):

    class Rating(models.TextChoices):
        EXCELLENT = 'excellent', 'Excellent'
        GOOD = 'good',      'Good'
        FAIR = 'fair',      'Fair'
        POOR = 'poor',      'Poor'

    room = models.ForeignKey(
                     Room,
                     on_delete=models.CASCADE,
                     related_name='hygiene_reports'
                   )
    inspected_by = models.ForeignKey(
                     User,
                     on_delete=models.SET_NULL,
                     null=True, blank=True,
                     related_name='hygiene_reports'
                   )
    rating = models.CharField(
                     max_length=20,
                     choices=Rating.choices
                   )
    notes = models.TextField(blank=True)
    issues_found = models.TextField(blank=True)
    passed = models.BooleanField(default=True)
    inspected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-inspected_at']

    def __str__(self):
        return f"Inspection - Room {self.room.number} ({self.rating})"


class SupplyLog(models.Model):
    item_name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    unit = models.CharField(max_length=20, default='units')
    used_by = models.ForeignKey(
                   User,
                   on_delete=models.SET_NULL,
                   null=True, blank=True,
                   related_name='supply_logs'
                 )
    room = models.ForeignKey(
                   Room,
                   on_delete=models.SET_NULL,
                   null=True, blank=True,
                   related_name='supply_logs'
                 )
    notes = models.TextField(blank=True)
    logged_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-logged_at']

    def __str__(self):
        return f"{self.quantity} {self.unit} of {self.item_name}"
