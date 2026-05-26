from django.db import models
from django.core.exceptions import ValidationError
from apps.rooms.models import Room
from apps.customers.models import Customer
from django.db.models.signals import post_save
from django.dispatch import receiver


class Booking(models.Model):

    class Status(models.TextChoices):
        CONFIRMED = 'confirmed',   'Confirmed'
        CHECKED_IN = 'checked_in',  'Checked In'
        CHECKED_OUT = 'checked_out', 'Checked Out'
        CANCELLED = 'cancelled',   'Cancelled'

    # Core relationships
    room = models.ForeignKey(
                 Room,
                 on_delete=models.PROTECT,  # Can't delete a room with bookings
                 related_name='bookings'
               )
    customer = models.ForeignKey(
                 Customer,
                 on_delete=models.PROTECT,  # Can't delete a customer with bookings
                 related_name='bookings'
               )

    # Dates
    check_in = models.DateField()
    check_out = models.DateField()

    # Status
    status = models.CharField(
               max_length=20,
               choices=Status.choices,
               default=Status.CONFIRMED
             )

    # Financials — calculated automatically
    total_price = models.DecimalField(
                    max_digits=10,
                    decimal_places=2,
                    blank=True,
                    null=True
                  )

    # Extra info
    adults = models.IntegerField(default=1)
    children = models.IntegerField(default=0)
    notes = models.TextField(blank=True)

    # Meta
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.id} - {self.customer} in Room {self.room.number}"

    @property
    def duration(self):
        # Number of nights
        return (self.check_out - self.check_in).days

    def calculate_total(self):
        # Price per night × number of nights
        if self.room and self.check_in and self.check_out:
            return self.room.price * self.duration
        return 0

    def clean(self):
        # Validation 1 — check_out must be after check_in
        if self.check_in and self.check_out:
            if self.check_out <= self.check_in:
                raise ValidationError(
                    'Check-out date must be after check-in date.'
                )

        # Validation 2 — Double booking prevention
        if self.check_in and self.check_out and self.room:
            overlapping = Booking.objects.filter(
                room=self.room,
                status__in=['confirmed', 'checked_in'],
                check_in__lt=self.check_out,
                check_out__gt=self.check_in,
            ).exclude(pk=self.pk)  # Exclude current booking when editing

            if overlapping.exists():
                raise ValidationError(
                    f'Room {self.room.number} is already booked '
                    f'for the selected dates.'
                )

    def save(self, *args, **kwargs):
        # Always run validation before saving
        self.full_clean()
        # Auto calculate total price
        self.total_price = self.calculate_total()
        super().save(*args, **kwargs)
        # Update room status based on booking status
        self._update_room_status()

    def _update_room_status(self):
        if self.status == 'checked_in':
            self.room.status = 'occupied'
        elif self.status in ['checked_out', 'cancelled']:
            self.room.status = 'available'
        self.room.save()


@receiver(post_save, sender=Booking)
def create_invoice_on_booking(sender, instance, created, **kwargs):
    if created:
        from apps.billing.models import Invoice
        Invoice.objects.create(
            booking=instance,
            customer=instance.customer,
            room_charge=instance.total_price or 0,
        )
