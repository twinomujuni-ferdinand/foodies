from rest_framework import serializers
from . models import Food
from . models import Order,OrderItem


class FoodSerializer(serializers.ModelSerializer):
    """
    Serializer for the Food model.
    """

    class Meta:
        model = Food
        fields = "__all__"

# serializers.py

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['customer_name', 'phone', 'total', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order
