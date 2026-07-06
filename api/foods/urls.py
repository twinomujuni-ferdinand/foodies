from django.urls import path
from . import views


urlpatterns = [
    path('food/', view=views.food_list, name='food-list'),  
    path('create_order/', view=views.create_order, name='create-order'),
    path('register_user/', views.register_user, name='register-user'),
    path('login_user/', views.login_user, name='login-user'),
    path('latest_order_status/', views.latest_order_status, name='latest-order-status'),
]