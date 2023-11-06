from django.contrib.auth import login, authenticate, update_session_auth_hash, logout
from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic import TemplateView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Item
from .serializers import ItemSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def login_user(request):
    # Get the username and password from the request data
    username = request.data.get('username')
    password = request.data.get('password')

    # Check if both username and password are provided
    if not username or not password:
        return Response({'error': 'Both username and password are required.'}, status=400)

    # Authenticate the user
    user = authenticate(request, username=username, password=password)

    # If authentication is successful, log the user in
    if user is not None:
        login(request, user)
        return Response({'message': 'Login successful'}, status=200)
    else:
        return Response({'error': 'Invalid username or password'}, status=401)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    # Log the user out
    logout(request)
    return Response({'message': 'Logged out successfully.'}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    # Get user registration data from the request
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    # Check if all required fields are provided
    if not username or not password or not email:
        return Response({'error': 'Username, password, and email are required fields.'}, status=400)

    # Check if the username is already taken
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username is already taken.'}, status=400)

    # Create a new user
    user = User.objects.create_user(username=username, password=password, email=email)

    if user:
        return Response({'message': 'Registration successful'}, status=201)
    else:
        return Response({'error': 'Registration failed'}, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_password(request):
    # Get the current user
    user = request.user

    # Get the new and old passwords from the request
    old_password = request.data.get('oldPassword')
    new_password = request.data.get('newPassword')

    # Check if the old and new passwords are provided
    if not old_password or not new_password:
        return Response({'error': 'Both old_password and new_password are required.'}, status=400)

    # Check if the old password matches the user's current password
    if not user.check_password(old_password):
        return Response({'error': 'Incorrect old password.'}, status=400)

    # Update the user's password and save the user
    user.set_password(new_password)
    user.save()

    # Update the user's session to keep them logged in
    update_session_auth_hash(request, user)

    return Response({'message': 'Password updated successfully.'}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def populate_database(request):
    # Delete all existing users and items
    items_data = [
        {"title": "Shoes", "description": "High quality shoes. Size 42. Color white.", "price": 75.99},
        {"title": "Shoes", "description": "Running shoes. Size 39. Color orange.", "price": 119.99},
        {"title": "Shoes", "description": "Skiing shoes. Size 42. Color green.", "price": 189.50},
        {"title": "Shoes", "description": "Sneakers. Size 39. Color white.", "price": 60.00},
        {"title": "Shoes", "description": "Trail-run shoes. Size 42. Color red.", "price": 129.00},
        {"title": "Shoes", "description": "High-heels. Size 38. Color black.", "price": 199.99},

        {"title": "Jeans", "description": "Black jeans. Size XXL. Wide fit.", "price": 80.99},
        {"title": "Jeans", "description": "Blue jeans. Size XL. Stretchy", "price": 63.99},
        {"title": "Jeans", "description": "Red jeans. Size L. Color blue.", "price": 45.99},
        {"title": "Jeans", "description": "Green jeans. Size M. Slim-fit", "price": 70.00},
        {"title": "Jeans", "description": "Black jeans. Size S. Durable material", "price": 45.00},
        {"title": "Jeans", "description": "Blue jeans. Size XS. Cheap and durable", "price": 30.00},

        {"title": "Socks", "description": "Warm socks for the winter. Size 40-45. Color blue.", "price": 3.99},
        {"title": "Socks", "description": "Sporty socks for running. Size L. Color black.", "price": 13.99},
        {"title": "Socks", "description": "Wool socks. Size 35-38. 5 pairs. Color white.", "price": 7.50},
        {"title": "Socks", "description": "Basic socks. One size. Color black.", "price": 1.00},
        {"title": "Socks", "description": "Low socks for the summer. Size 39-42. Color white.", "price": 2.50},
        {"title": "Socks", "description": "Sporty socks for running. Size L. Color black.", "price": 13.99},

        {"title": "Jacket", "description": "Winter jacket. Size XL. Color black.", "price": 345.00},
        {"title": "Jacket", "description": "Summer jacket. Size S. Color white.", "price": 245.00},
        {"title": "Jacket", "description": "Running jacket. Size M. Color black.", "price": 127.00},
        {"title": "Jacket", "description": "Rain jacket. Size L. Color gray.", "price": 499.99},
        {"title": "Jacket", "description": "Skiing jacket. Size XS. Color red.", "price": 300.50},
        {"title": "Jacket", "description": "Winter jacket. Size XXL. Color green.", "price": 125.50},

        {"title": "Jacket", "description": "Winter jacket. Size XL. Color black.", "price": 345.00},
        {"title": "Jacket", "description": "Summer jacket. Size S. Color white.", "price": 245.00},
        {"title": "Jacket", "description": "Running jacket. Size M. Color black.", "price": 127.00},
        {"title": "Jacket", "description": "Rain jacket. Size L. Color gray.", "price": 499.99},
        {"title": "Jacket", "description": "Skiing jacket. Size XS. Color red.", "price": 300.50},
        {"title": "Jacket", "description": "Winter jacket. Size XXL. Color green.", "price": 125.50},
    ]

    # Delete all existing users and items
    User.objects.all().delete()
    Item.objects.all().delete()

    # Create 6 users
    for i in range(1, 7):
        username = f'testuser{i}'
        password = f'pass{i}'
        email = f'testuser{i}@shop.aa'
        user = User.objects.create_user(username=username, password=password, email=email)
        user.save()

    # Create 3 sellers with 10 items each
    for i in range(1, 4):
        seller = User.objects.get(username=f'testuser{i}')

        # Insert 10 unique items for the seller
        for _ in range(10):
            if not items_data:
                break

            item_data = items_data.pop(0)
            title = item_data["title"]

            Item.objects.create(
                user=seller,
                title=title,
                description=item_data["description"],
                price=item_data["price"]
            )

    return Response({'message': 'Database populated successfully.'}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def insert_item(request):
    # Get data from the request
    data = {
        'user': request.user.id,
        'title': request.data.get('title'),
        'description': request.data.get('description'),
        'price': float(request.data.get('price'))
    }

    # Create a new item
    serializer = ItemSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    else:
        return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_item(request):
    # Get the item ID to be purchased from the request
    item_id = request.data.get('item_id')

    # Check if the item exists
    item = Item.objects.filter(id=item_id).first()

    if not item:
        return Response({'error': 'Item not found.'}, status=404)

    # Check if the item is available for purchase
    if item.state != 'ON_SALE':
        return Response({'error': 'Item is not available for purchase.'}, status=400)

    # Mark the item as sold
    item.state = 'SOLD'
    item.save()

    return Response({'message': 'Item purchased successfully.'}, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_item(request):
    # Get the item ID from the request data
    item_id = request.data.get('id')

    # Retrieve the item from the database
    oldItem = Item.objects.filter(id=item_id, user=request.user).first()

    if not oldItem:
        return Response({'error': 'Item not found or does not belong to the authenticated user.'}, status=404)

    # Check if the item is already marked as 'SOLD'
    if oldItem.state == 'SOLD':
        return Response({'error': 'Item is already marked as SOLD and cannot be modified.'}, status=400)

    price = float(request.data.get('price'))
    state = request.data.get('state')

    if price < 0:
        return Response({'error': 'Item price must be positive'}, status=400)

    oldItem.state = state
    oldItem.price = price

    oldItem.save()
    serializer = ItemSerializer(oldItem, many=False)
    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_items(request):
    # Retrieve all items from the database
    items = Item.objects.all()

    # Serialize the items data
    serializer = ItemSerializer(items, many=True)

    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_own_items(request):
    # Retrieve items owned by the authenticated user
    items = Item.objects.filter(user=request.user)

    # Serialize the items data
    serializer = ItemSerializer(items, many=True)

    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_items_by_title(request, title):
    # Retrieve items with titles that match the provided title (fuzzy find)
    items = Item.objects.filter(Q(title__icontains=title))

    # Serialize the items data
    serializer = ItemSerializer(items, many=True)

    return Response(serializer.data, status=200)
