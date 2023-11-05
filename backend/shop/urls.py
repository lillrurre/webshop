from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.user_login, name='user_login'),
    path('logout/', views.user_logout, name='user_login'),
    path('register/', views.user_register, name='user_register'),
    path('user/update/', views.user_update_password, name='user_update_password'),
    path('database/migrate/', views.seed_database, name='seed_database'),
    path('item/create', views.insert_item, name='insert_item'),
    path('item/purchase', views.purchase_item, name='purchase_item'),
    path('item/update-state/', views.sell_or_remove_item, name='sell_remove_item'),
    path('items/', views.get_all_items, name='get_all_items'),
    path('items/own/', views.get_own_items, name='get_own_items'),
    path('items/<str:title>/', views.get_items_by_title, name='get_items_by_title'),
]
