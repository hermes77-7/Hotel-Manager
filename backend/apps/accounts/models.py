from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin',
        HOUSEKEEPING = 'housekeeping',
        RECEPTIONIST = 'receptionist',
        KITCHEN = 'kitchen'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.RECEPTIONIST)

    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"
