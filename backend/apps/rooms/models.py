from django.db import models


class Room(models.Model):

    # Room type choices
    class RoomType(models.TextChoices):
        SINGLE = 'single',  'Single'
        DOUBLE = 'double',  'Double'
        TWIN = 'twin',    'Twin'
        SUITE = 'suite',   'Suite'
        DELUXE = 'deluxe',  'Deluxe'

    # Room status choices
    class RoomStatus(models.TextChoices):
        AVAILABLE = 'available',   'Available'
        OCCUPIED = 'occupied',    'Occupied'
        MAINTENANCE = 'maintenance', 'Maintenance'
        CLEANING = 'cleaning',    'Cleaning'

    number = models.CharField(max_length=10, unique=True)   # e.g. "101", "202A"
    room_type = models.CharField(max_length=20, choices=RoomType.choices)
    floor = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(
                    max_length=20,
                    choices=RoomStatus.choices,
                    default=RoomStatus.AVAILABLE
                  )
    description = models.TextField(blank=True)
    capacity = models.IntegerField(default=1)  # Max number of guests
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['floor', 'number']  # Default sort by floor then number

    def __str__(self):
        return f"Room {self.number} - {self.room_type} ({self.status})"
