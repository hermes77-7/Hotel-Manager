from rest_framework import serializers
from .models import MenuItem, FoodOrder, OrderItem


class MenuItemSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(
                         source='get_category_display',
                         read_only=True
                       )

    class Meta:
        model = MenuItem
        fields = [
            'id', 'name', 'category', 'category_display',
            'description', 'price', 'is_available',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(
                        source='menu_item.name',
                        read_only=True
                      )
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            'id', 'menu_item', 'menu_item_name',
            'quantity', 'unit_price', 'subtotal'
        ]

    def get_subtotal(self, obj):
        return obj.quantity * obj.unit_price


class FoodOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_display = serializers.CharField(
                        source='get_status_display',
                        read_only=True
                      )
    customer_name = serializers.CharField(
                        source='customer.full_name',
                        read_only=True
                      )
    room_number = serializers.CharField(
                        source='room.number',
                        read_only=True
                      )

    class Meta:
        model = FoodOrder
        fields = [
            'id', 'customer', 'customer_name',
            'room', 'room_number',
            'status', 'status_display',
            'items', 'total_price',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['total_price', 'created_at', 'updated_at']


class CreateOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['menu_item', 'quantity']


class CreateFoodOrderSerializer(serializers.ModelSerializer):
    items = CreateOrderItemSerializer(many=True)

    class Meta:
        model = FoodOrder
        fields = ['customer', 'room', 'notes', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = FoodOrder.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(
                order=order,
                menu_item=item_data['menu_item'],
                quantity=item_data['quantity'],
                unit_price=item_data['menu_item'].price
            )
        order.total_price = order.calculate_total()
        order.save()
        return order
