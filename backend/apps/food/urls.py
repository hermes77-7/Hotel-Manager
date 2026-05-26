from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MenuItemViewSet, FoodOrderViewSet

router = DefaultRouter()
router.register(r'menu',   MenuItemViewSet,  basename='menu-item')
router.register(r'orders', FoodOrderViewSet, basename='food-order')

urlpatterns = [
    path('', include(router.urls)),
]
