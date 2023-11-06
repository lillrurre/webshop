"""
    Configurations for the web shop app
"""

from django.apps import AppConfig


class ShopConfig(AppConfig):
    """
    App definition for the web shop
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shop'
