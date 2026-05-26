from django.contrib import admin
from .models import MenuItem, FoodOrder, OrderItem

admin.site.register(MenuItem)
admin.site.register(FoodOrder)
admin.site.register(OrderItem)
