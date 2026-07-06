from django.shortcuts import render
from . serialiser import Food,FoodSerializer
from django.shortcuts import *
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . models import Food ,OrderItem
from .serialiser import OrderSerializer
from .models import Order
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.conf import settings

# Create your views here.

@api_view(['GET'])
def food_list(request):
    """
    List all foods, optionally filter by category (?category=Breakfast).
    """
    category = request.GET.get('category')
    foods = Food.objects.all()
    if category:
        foods = foods.filter(category=category)
    serializer = FoodSerializer(foods, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_order(request):
    user = None
    # Try to get user from request (e.g. username in data or authenticated user)
    username = request.data.get('username')
    if username:
        try:
            from django.contrib.auth.models import User
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        # Extract location from request data
        location = request.data.get('location', '')
        order = serializer.save(user=user)
        response_serializer = OrderSerializer(order)
        # Build a detailed receipt string (include location)
        receipt_text = f"Order Receipt\nOrder ID: {order.id}\nName: {order.customer_name}\nPhone: {order.phone}\nLocation: {location}\nTotal: {order.total} UGX\nPayment: {order.payment_method}\nStatus: {order.status}\nDate: {order.created_at}\nItems:\n"
        for item in order.items.all():
            receipt_text += f"- {item.name} x {item.quantity} = {item.price * item.quantity} UGX\n"

        # Save receipt as a text file in media/receipts/
        import os
        os.makedirs(os.path.join(settings.MEDIA_ROOT, "receipts"), exist_ok=True)
        receipt_filename = f"receipt_{order.id}.txt"
        receipt_path = os.path.join(settings.MEDIA_ROOT, "receipts", receipt_filename)
        with open(receipt_path, "w", encoding="utf-8") as f:
            f.write(receipt_text)
        receipt_url = request.build_absolute_uri(settings.MEDIA_URL + f"receipts/{receipt_filename}")

        return Response({
            'message': 'Order received and saved',
            'data': response_serializer.data,
            'receipt_url': receipt_url,
            'receipt': receipt_text
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view to get latest order status for a user (by phone)
@api_view(['GET'])
def latest_order_status(request):
    phone = request.GET.get('phone')
    if not phone:
        return Response({'error': 'Phone number required'}, status=status.HTTP_400_BAD_REQUEST)
    order = Order.objects.filter(phone=phone).order_by('-created_at').first()
    if not order:
        return Response({'error': 'No order found for this phone'}, status=status.HTTP_404_NOT_FOUND)
    return Response({
        'order_id': order.id,
        'status': order.status,
        'payment_method': order.payment_method
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    if not username or not password or not email:
        return Response({'error': 'All fields required'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        return Response({'message': 'Login successful', 'username': user.username}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


