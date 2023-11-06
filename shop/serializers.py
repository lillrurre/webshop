"""Serializers for web shop models"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Item


class UserSerializer(serializers.ModelSerializer):
    """ Serializer for the User model. the password is omitted."""
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class ItemSerializer(serializers.ModelSerializer):
    """ Serializer for the Item model"""
    class Meta:
        model = Item
        fields = '__all__'
