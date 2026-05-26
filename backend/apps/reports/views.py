from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Sum, Count, Avg, Q
from datetime import timedelta
from apps.rooms.models import Room
from apps.customers.models import Customer
from apps.reservations.models import Booking
from apps.billing.models import Invoice
from apps.food.models import FoodOrder
from apps.housekeeping.models import CleaningTask


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()

        # Rooms
        total_rooms     = Room.objects.count()
        available_rooms = Room.objects.filter(status='available').count()
        occupied_rooms  = Room.objects.filter(status='occupied').count()

        # Bookings
        active_bookings = Booking.objects.filter(
            status__in=['confirmed', 'checked_in']
        ).count()
        todays_checkins = Booking.objects.filter(
            check_in=today, status='confirmed'
        ).count()
        todays_checkouts = Booking.objects.filter(
            check_out=today, status='checked_in'
        ).count()

        # Customers
        total_customers = Customer.objects.count()

        # Revenue
        total_revenue = Invoice.objects.filter(
            status='paid'
        ).aggregate(total=Sum('amount_paid'))['total'] or 0

        monthly_revenue = Invoice.objects.filter(
            status='paid',
            paid_at__month=today.month,
            paid_at__year=today.year,
        ).aggregate(total=Sum('amount_paid'))['total'] or 0

        outstanding = Invoice.objects.filter(
            status__in=['unpaid', 'partial']
        ).aggregate(total=Sum('total_amount'))['total'] or 0

        # Food
        pending_orders = FoodOrder.objects.filter(
            status__in=['pending', 'preparing']
        ).count()

        # Housekeeping
        pending_tasks = CleaningTask.objects.filter(
            status__in=['pending', 'in_progress']
        ).count()

        return Response({
            'rooms': {
                'total':     total_rooms,
                'available': available_rooms,
                'occupied':  occupied_rooms,
                'occupancy_rate': round(
                    (occupied_rooms / total_rooms * 100) if total_rooms else 0, 1
                ),
            },
            'bookings': {
                'active':           active_bookings,
                'todays_checkins':  todays_checkins,
                'todays_checkouts': todays_checkouts,
            },
            'customers': {
                'total': total_customers,
            },
            'revenue': {
                'total':       float(total_revenue),
                'this_month':  float(monthly_revenue),
                'outstanding': float(outstanding),
            },
            'food': {
                'pending_orders': pending_orders,
            },
            'housekeeping': {
                'pending_tasks': pending_tasks,
            },
        })


class OccupancyReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today     = timezone.now().date()
        # Last 12 months
        months    = []
        for i in range(11, -1, -1):
            date  = today.replace(day=1) - timedelta(days=i * 30)
            month = date.replace(day=1)
            bookings_that_month = Booking.objects.filter(
                check_in__year=month.year,
                check_in__month=month.month,
                status__in=['confirmed', 'checked_in', 'checked_out']
            ).count()
            revenue_that_month = Invoice.objects.filter(
                paid_at__year=month.year,
                paid_at__month=month.month,
                status='paid'
            ).aggregate(total=Sum('amount_paid'))['total'] or 0

            months.append({
                'month':    month.strftime('%b %Y'),
                'bookings': bookings_that_month,
                'revenue':  float(revenue_that_month),
            })

        return Response({'monthly_data': months})


class BookingStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Bookings by status
        by_status = Booking.objects.values('status').annotate(
            count=Count('id')
        )

        # Bookings by room type
        by_room_type = Booking.objects.values(
            'room__room_type'
        ).annotate(count=Count('id')).order_by('-count')

        # Average stay duration
        bookings      = Booking.objects.exclude(
            status='cancelled'
        )
        avg_duration  = bookings.aggregate(
            avg=Avg('total_price')
        )['avg'] or 0

        # Top 5 most booked rooms
        top_rooms = Booking.objects.values(
            'room__number', 'room__room_type'
        ).annotate(
            count=Count('id')
        ).order_by('-count')[:5]

        return Response({
            'by_status':    list(by_status),
            'by_room_type': list(by_room_type),
            'avg_revenue':  float(avg_duration),
            'top_rooms':    list(top_rooms),
        })


class RevenueReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Revenue breakdown
        room_revenue = Invoice.objects.filter(
            status='paid'
        ).aggregate(total=Sum('room_charge'))['total'] or 0

        food_revenue = Invoice.objects.filter(
            status='paid'
        ).aggregate(total=Sum('food_charge'))['total'] or 0

        other_revenue = Invoice.objects.filter(
            status='paid'
        ).aggregate(total=Sum('other_charge'))['total'] or 0

        total_discounts = Invoice.objects.filter(
            status='paid'
        ).aggregate(total=Sum('discount'))['total'] or 0

        # Payment method breakdown
        by_payment = Invoice.objects.filter(
            status='paid'
        ).values('payment_method').annotate(
            count=Count('id'),
            total=Sum('amount_paid')
        )

        return Response({
            'breakdown': {
                'room_revenue':  float(room_revenue),
                'food_revenue':  float(food_revenue),
                'other_revenue': float(other_revenue),
                'discounts':     float(total_discounts),
            },
            'by_payment_method': list(by_payment),
        })
