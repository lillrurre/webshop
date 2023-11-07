"""
    Models for the WebShop
"""

from django.db import models
from django.contrib.auth.models import User


class Item(models.Model):
    """
    The Item model represents an object that can be sold in the web shop
    """
    objects = None
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    dateAdded = models.DateTimeField(auto_now_add=True)
    state = models.CharField(max_length=10, choices=[
        ('ON_SALE', 'ON_SALE'),
        ('SOLD', 'SOLD'),
    ], default='ON_SALE')
