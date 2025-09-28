from django.urls import path
from .views import (BookListAPIView,BookDetailAPIView,ReviewCreateAPIView,BookReviewListView,UserDetailAPIView,CreateCheckoutSession,OrderListView,OrderAPIView)


urlpatterns = [
    path('books/', BookListAPIView.as_view()), #checked
    path('book/<int:pk>/', BookDetailAPIView.as_view()), #checked
    path('book/<int:pk>/review/', ReviewCreateAPIView.as_view(), name='add-review'), #checked
    path('book/<int:pk>/reviews/', BookReviewListView.as_view(), name='book-reviews'), #checked
    path('me/', UserDetailAPIView.as_view()), #checked
    path('create-checkout-session/', CreateCheckoutSession), #checked
    path('orders/', OrderListView.as_view(), name='order-list'), #checked
    path('order/create/', OrderAPIView.as_view(), name='create-order'), #checked
    path('order/latest/', OrderAPIView.as_view(),name='latest-order')
]
