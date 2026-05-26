from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CleaningTaskViewSet, HygieneReportViewSet, SupplyLogViewSet

router = DefaultRouter()
router.register(r'tasks',   CleaningTaskViewSet,  basename='cleaning-task')
router.register(r'reports', HygieneReportViewSet, basename='hygiene-report')
router.register(r'supplies', SupplyLogViewSet,    basename='supply-log')

urlpatterns = [
    path('', include(router.urls)),
]
