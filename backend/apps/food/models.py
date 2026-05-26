from django.db import models
from apps.customers.models import Customer
from apps.rooms.models import Room


class MenuItem(models.Model):

    class Category(models.TextChoices):
        BREAKFAST = 'breakfast',  'Breakfast'
        LUNCH = 'lunch',      'Lunch'
        DINNER = 'dinner',     'Dinner'
        SNACK = 'snack',      'Snack'
        BEVERAGE = 'beverage',   'Beverage'
        DESSERT = 'dessert',    'Dessert'

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=Category.choices)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.category}) - ${self.price}"


class FoodOrder(models.Model):

    class Status(models.TextChoices):
        PENDING = 'pending',     'Pending'
        PREPARING = 'preparing',   'In Preparation'
        READY = 'ready',       'Ready'
        DELIVERED = 'delivered',   'Delivered'
        CANCELLED = 'cancelled',   'Cancelled'

    customer = models.ForeignKey(
                    Customer,
                    on_delete=models.PROTECT,
                    related_name='food_orders'
                  )
    room = models.ForeignKey(
                    Room,
                    on_delete=models.PROTECT,
                    related_name='food_orders'
                  )
    status = models.CharField(
                    max_length=20,
                    choices=Status.choices,
                    default=Status.PENDING
                  )
    notes = models.TextField(blank=True)
    total_price = models.DecimalField(
                    max_digits=10,
                    decimal_places=2,
                    default=0
                  )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - Room {self.room.number} ({self.status})"

    def calculate_total(self):
        return sum(
            item.quantity * item.unit_price
            for item in self.items.all()
        )


class OrderItem(models.Model):
    order = models.ForeignKey(
                   FoodOrder,
                   on_delete=models.CASCADE,
                   related_name='items'
                 )
    menu_item = models.ForeignKey(
                   MenuItem,
                   on_delete=models.PROTECT,
                   related_name='order_items'
                 )
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"

    def save(self, *args, **kwargs):
        # Snapshot the price at time of order
        if not self.unit_price:
            self.unit_price = self.menu_item.price
        super().save(*args, **kwargs)
        # Recalculate order total
        self.order.total_price = self.order.calculate_total()
        self.order.save(update_fields=['total_price'])
