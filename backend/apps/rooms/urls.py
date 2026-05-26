from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoomViewSet

# Router automatically creates all URLs for the ViewSet
router = DefaultRouter()
router.register(r'', RoomViewSet, basename='room')

urlpatterns = [
    path('', include(router.urls)),
]
