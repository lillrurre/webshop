"""
    URLs for the WebShop API
"""

from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('register/', views.register_user, name='register'),
    path('user/update/', views.update_password, name='update_password'),
    path('database/populate/', views.populate_database, name='populate_database'),
    path('item/create/', views.insert_item, name='insert_item'),
    path('item/purchase/', views.purchase_item, name='purchase_item'),
    path('item/update/', views.update_item, name='update_item'),
    path('items/', views.get_items, name='get_all_items'),
    path('items/own/', views.get_own_items, name='get_own_items'),
    path('items/<str:title>/', views.get_items_by_title, name='get_items_by_title'),
]
