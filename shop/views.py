"""
    All WebShop API handlers are defined in views.py
"""
from django.contrib.auth import login, authenticate, update_session_auth_hash, logout
from django.contrib.auth.models import User
from django.db.models import Q
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import Item
from .serializers import ItemSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def login_user(request):
    """
    login creates a new CSRF token and session id for a registered user
    :param request: contains the username and password for the user that signs in
    :return: OK with the user ID or an error
    """
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
        return Response(user.id, status=200)

    return Response({'error': 'Invalid username or password'}, status=401)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """
    logout invalidates the users session token
    :param request: the request must include a CSRF token.
    :return: OK or error
    """
    # Log the user out
    logout(request)
    return Response({'message': 'Logged out successfully.'}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    register user creates a new web shop user
    :param request: contains the username, email and password for the user
    :return: OK or error
    """
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

    return Response({'error': 'Registration failed'}, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_password(request):
    """
    update password updates the password for a user
    :param request: the request should contain the old and a new password
    :return: OK or error
    """
    # Get the current user
    user = request.user

    # Get the new and old passwords from the request
    old_password = request.data.get('oldPassword')
    new_password = request.data.get('newPassword')

    # Check if the old and new passwords are provided
    if not old_password or not new_password:
        return Response({'error': 'Both old and new password are required.'}, status=400)

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
    """
    populate database empties and adds new items to the database
    :return: OK, or error if the operation fails.
    """
    # Delete all existing users and items
    items_data = [
        {"title": "Shoes", "description":
            "High quality shoes. Size 42. Color white.", "price": 75.99},
        {"title": "Shoes", "description":
            "Running shoes. Size 39. Color orange.", "price": 119.99},
        {"title": "Shoes", "description":
            "Skiing shoes. Size 42. Color green.", "price": 189.50},
        {"title": "Shoes", "description":
            "Sneakers. Size 39. Color white.", "price": 60.00},
        {"title": "Shoes", "description":
            "Trail-run shoes. Size 42. Color red.", "price": 129.00},
        {"title": "Shoes", "description":
            "High-heels. Size 38. Color black.", "price": 199.99},
        {"title": "Jeans", "description":
            "Black jeans. Size XXL. Wide fit.", "price": 80.99},
        {"title": "Jeans", "description":
            "Blue jeans. Size XL. Stretchy", "price": 63.99},
        {"title": "Jeans", "description":
            "Red jeans. Size L. Color blue.", "price": 45.99},
        {"title": "Jeans", "description":
            "Green jeans. Size M. Slim-fit", "price": 70.00},
        {"title": "Jeans", "description":
            "Black jeans. Size S. Durable material", "price": 45.00},
        {"title": "Jeans", "description":
            "Blue jeans. Size XS. Cheap and durable", "price": 30.00},
        {"title": "Socks", "description":
            "Warm socks for the winter. Size 40-45. Color blue.", "price": 3.99},
        {"title": "Socks", "description":
            "Sporty socks for running. Size L. Color black.", "price": 13.99},
        {"title": "Socks", "description":
            "Wool socks. Size 35-38. 5 pairs. Color white.", "price": 7.50},
        {"title": "Socks", "description":
            "Basic socks. One size. Color black.", "price": 1.00},
        {"title": "Socks", "description":
            "Low socks for the summer. Size 39-42. Color white.", "price": 2.50},
        {"title": "Socks", "description":
            "Sporty socks for running. Size L. Color black.", "price": 13.99},
        {"title": "Jacket", "description":
            "Winter jacket. Size XL. Color black.", "price": 345.00},
        {"title": "Jacket", "description":
            "Summer jacket. Size XXL. Color pink.", "price": 127.77},
        {"title": "Jacket", "description":
            "Running jacket. Size M. Color black.", "price": 127.00},
        {"title": "Jacket", "description":
            "Rain jacket. Size L. Color gray.", "price": 499.99},
        {"title": "Jacket", "description":
            "Skiing jacket. Size XS. Color red.", "price": 300.50},
        {"title": "Jacket", "description":
            "Winter jacket. Size XXL. Color green.", "price": 125.50},
        {"title": "Jacket", "description":
            "Winter jacket. Size XL. Color black.", "price": 345.00},
        {"title": "Jacket", "description":
            "Summer jacket. Size S. Color white.", "price": 245.00},
        {"title": "Jacket", "description":
            "Running jacket. Size M. Color black.", "price": 127.00},
        {"title": "Jacket", "description":
            "Rain jacket. Size L. Color gray.", "price": 499.99},
        {"title": "Jacket", "description":
            "Skiing jacket. Size XS. Color red.", "price": 300.50},
        {"title": "Jacket", "description":
            "Winter jacket. Size XXL. Color green.", "price": 125.50},
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
    """
    insert item creates a new item and puts it on sale
    :param request: contains the item information
    :return: todo, nothing
    """
    # Get data from the request
    data = {
        'user': request.user,
        'title': request.data.get('title'),
        'description': request.data.get('description'),
        'price': float(request.data.get('price'))
    }

    Item.objects.create(**data)

    return Response({}, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_items(request):
    """
    purchase_items is used by web shop users to purchase items.
    :param request: contains an array of items to purchase
    :return: a list of updated items
    """
    # Get the list of item IDs to be purchased from the request
    item_ids = request.data

    if not item_ids:
        return Response({'error': 'No items to purchase provided.'}, status=400)

    user_id = request.user.id
    updated_items = []

    for item_data in item_ids:
        item_id = item_data.get('id')
        # Check if the item exists
        item = Item.objects.filter(id=item_id).first()

        if not item:
            return Response({'error': 'does not exist', 'id': f'{item_id}'}, status=404)

        # Check if the item is available for purchase
        if item.state != 'ON_SALE':
            return Response({'error': 'is already sold', 'id': f'{item_id}'}, status=400)

        # Check that the item does not belong to the user
        if item.user.id == user_id:
            return Response({'error': 'is your own item', 'id': f'{item_id}'}, status=400)

        # Check that the item price matches (allow a small errors
        diff = abs(float(item.price) - float(item_data.get('price')))
        if diff > 0.001:
            return Response({'error': 'has the wrong price', 'id': f'{item_id}'}, status=400)

        # Update the owner of the item
        item.user = request.user
        item.save()

        # Mark the item as sold
        item.state = 'SOLD'
        item.save()

        updated_items.append(ItemSerializer(item).data)

    return Response(updated_items, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_item(request):
    """
    update_item s used by a user that owns an item to update the price
    or set on sale/remove from sale
    :param request: contains the information of the updated item
    :return: the updated version of the old item
    """
    # Get the item ID from the request data
    item_id = request.data.get('id')

    # Retrieve the item from the database
    old_item = Item.objects.filter(id=item_id, user=request.user).first()

    if not old_item:
        return Response(
            {'error': 'Item not found or does not belong to the authenticated user.'}, status=404
        )

    price = float(request.data.get('price'))
    state = request.data.get('state')

    if price < 0:
        return Response({'error': 'Item price must be positive'}, status=400)

    old_item.state = state
    old_item.price = price

    old_item.save()
    serializer = ItemSerializer(old_item, many=False)
    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_items(request):
    """
    get_items is used at the landing page of the web shop
    :return: all objects in the database
    """
    # Retrieve all items from the database
    items = Item.objects.all()

    # Serialize the items data
    serializer = ItemSerializer(items, many=True)

    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_own_items(request):
    """
    get_own_items get the item for the logged-in user
    :param request: the request contains the user information
    :return: all the object the user owns
    """
    # Retrieve items owned by the authenticated user
    items = Item.objects.filter(user=request.user)

    # Serialize the items data
    serializer = ItemSerializer(items, many=True)

    return Response(serializer.data, status=200)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_items_by_title(request, title):
    """
    get_items_by_title uses fuzzy finding to search for objects in the shop
    :param request:
    :param title: URL parameter to search with.
    :return: all found objects are returned.
    """
    # Retrieve items with titles that match the provided title (fuzzy find)
    items = Item.objects.filter(Q(title__icontains=title))

    # Serialize the items data
    serializer = ItemSerializer(items, many=True)

    return Response(serializer.data, status=200)
