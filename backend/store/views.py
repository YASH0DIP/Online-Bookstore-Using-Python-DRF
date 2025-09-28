import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .serializers import BookSerializer, ReviewSerializer, OrderSerializer, UserSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem, Book, Review
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

#fetching all reviews
class BookReviewListView(APIView):
    def get(self, request, pk):
        reviews = Review.objects.filter(book_id=pk)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

#fetch all books
class BookListAPIView(APIView):
    def get(self, request):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

#fetch specific book details, and update if needed
class BookDetailAPIView(APIView):
    def get(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        return Response(BookSerializer(book).data)
    
    def patch(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        serializer = BookSerializer(book,data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_205_RESET_CONTENT)

#posting a review
class ReviewCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        book = get_object_or_404(Book,pk=pk)
        serializer = ReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, book=book)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

#getting orders of a specific user
class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

#for getting user details and update detail(mobile)
class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

#for storing order
class OrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        order = Order.objects.filter(user=request.user).latest("created_at")
        serializer = OrderSerializer(order)
        return Response(serializer.data,status=200)

    def post(self, request):
        user = request.user
        cart_items = request.data.get('cartItems', [])
        address = request.data.get('address', '')
        total_price = request.data.get('totalPrice')

        #print(cart_items)

        if not cart_items or not total_price:
            return Response({'error': 'Cart or total missing'}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=user,
            total_price=total_price,
            address=address
        )
        
        #print(order.id)

        for item in cart_items:
            book_id = item.get('id')
            quantity = item.get('quantity', 1)
            try:
                book = Book.objects.get(id=book_id)
                OrderItem.objects.create(order=order, book=book, quantity=quantity)
                book.stock = book.stock - quantity
                book.save()
            except Book.DoesNotExist:
                return Response("Book does not exist")
        return Response('Order added', status=status.HTTP_201_CREATED)


#for stripe payments
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def CreateCheckoutSession(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            items = data if isinstance(data, list) else data.get("items", [])

            line_items = [
                {
                    "price_data": {
                        "currency": "inr",
                        "product_data": {
                            "name": item["name"],
                        },
                        "unit_amount": int(item["price"] * 100),
                    },
                    "quantity": item["quantity"],
                }
                for item in items
            ]

            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url='http://localhost:3000/success',
                cancel_url='http://localhost:3000/cancel',
            )

            return JsonResponse({'id': session.id})
        except Exception as e:
            return JsonResponse({'error': str(e)})
    return JsonResponse({'error': 'Invalid request method'}, status=400)