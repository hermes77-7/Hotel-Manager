from django.urls import path
from .views import (
    DashboardStatsView,
    OccupancyReportView,
    BookingStatsView,
    RevenueReportView,
)

urlpatterns = [
    path('dashboard/',  DashboardStatsView.as_view(),  name='dashboard-stats'),
    path('occupancy/',  OccupancyReportView.as_view(),  name='occupancy-report'),
    path('bookings/',   BookingStatsView.as_view(),     name='booking-stats'),
    path('revenue/',    RevenueReportView.as_view(),    name='revenue-report'),
]