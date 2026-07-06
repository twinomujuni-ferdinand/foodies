from django.contrib import admin
from .models import Food, Order, OrderItem

# Register your models here.
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'phone', 'location', 'total', 'payment_method', 'status', 'created_at')
    search_fields = ('customer_name', 'phone', 'payment_method', 'status', 'location')
    readonly_fields = ('id', 'created_at')
    list_editable = ('status',)

    def formfield_for_choice_field(self, db_field, request, **kwargs):
        if db_field.name == "status":
            kwargs["choices"] = [
                ("Pending", "Pending"),
                ("Received", "Received"),
            ]
        return super().formfield_for_choice_field(db_field, request, **kwargs)

    def receipt(self, obj):
        return f"Receipt for Order {obj.id}: {obj.customer_name}, {obj.phone}, {getattr(obj, 'location', '')}, {obj.total}, {obj.payment_method}, {obj.status}"

class FoodAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price')
    list_filter = ('category',)
    search_fields = ('name', 'category')

admin.site.register(Food, FoodAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)

    
