from django.db import models
from apps.reservations.models import Booking
from apps.customers.models import Customer


class Invoice(models.Model):

    class Status(models.TextChoices):
        UNPAID = 'unpaid',   'Unpaid'
        PAID = 'paid',     'Paid'
        PARTIAL = 'partial',  'Partially Paid'
        CANCELLED = 'cancelled', 'Cancelled'

    class PaymentMethod(models.TextChoices):
        CASH = 'cash',         'Cash'
        CREDIT_CARD = 'credit_card',  'Credit Card'
        DEBIT_CARD = 'debit_card',   'Debit Card'
        BANK_TRANSFER = 'bank_transfer', 'Bank Transfer'
        OTHER = 'other',        'Other'

    # Relationships
    booking = models.OneToOneField(
                 Booking,
                 on_delete=models.PROTECT,
                 related_name='invoice'
               )
    customer = models.ForeignKey(
                 Customer,
                 on_delete=models.PROTECT,
                 related_name='invoices'
               )

    # Amounts
    room_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    food_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    other_charge = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Status
    status = models.CharField(
                       max_length=20,
                       choices=Status.choices,
                       default=Status.UNPAID
                     )
    payment_method = models.CharField(
                       max_length=20,
                       choices=PaymentMethod.choices,
                       blank=True
                     )

    notes = models.TextField(blank=True)
    issued_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-issued_at']

    def __str__(self):
        return f"Invoice #{self.id} - {self.customer} ({self.status})"

    @property
    def total_amount(self):
        return (
            self.room_charge +
            self.food_charge +
            self.other_charge -
            self.discount
        )

    @property
    def balance_due(self):
        return self.total_amount - self.amount_paid

    def update_status(self):
        if self.amount_paid <= 0:
            self.status = 'unpaid'
        elif self.amount_paid >= self.total_amount:
            self.status = 'paid'
        else:
            self.status = 'partial'