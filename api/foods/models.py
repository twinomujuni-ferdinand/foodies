from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.


class Food(models.Model):
    CATEGORY_CHOICES = [
        ("Breakfast", "Breakfast"),
        ("Big Meals", "Big Meals"),
        ("Drinks", "Drinks"),
        ("Desserts", "Desserts"),
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='foods/', blank=True, null=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="Big Meals")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Foods"


class Order(models.Model):
    customer_name = models.CharField(max_length=100, default='Unknown')
    phone = models.CharField(max_length=15, default='0000000000')  # Placeholder phone
    location = models.CharField(max_length=255, blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(default=timezone.now)
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Received", "Received"),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    payment_method = models.CharField(max_length=30, default='Cash')  # New field for payment option
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"Order {self.id} by {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    name = models.CharField(max_length=100, default='Unnamed Item')
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.name} × {self.quantity}"
