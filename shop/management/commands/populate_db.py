from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

from shop.models import Item
import random


class Command(BaseCommand):
    help = 'Populate the database with users and items'

    def handle(self, *args, **kwargs):

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
            {"title": "Socks", "description": "Sporty socks for running. Size L. Color black.","price": 13.99},

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

        self.stdout.write(self.style.SUCCESS('Emptying the database...'))

        # Delete all existing users and items
        User.objects.all().delete()
        Item.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Database emptied.'))

        self.stdout.write(self.style.SUCCESS('Populating the database...'))

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

        self.stdout.write(self.style.SUCCESS('Database populated.'))

        self.stdout.write(self.style.SUCCESS('Database populated.'))
