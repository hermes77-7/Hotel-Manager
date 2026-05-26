import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../core/auth/auth.service';
import { ReportsService } from '../../reports/services/reports.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats: any = null;
  isLoading = true;

  statCards: any[] = [];

  constructor(
    private authService: AuthService,
    private reportsService: ReportsService,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((u) => (this.currentUser = u));
    this.loadStats();
  }

  loadStats(): void {
    this.reportsService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        this.buildStatCards(data);
      },
      error: () => (this.isLoading = false),
    });
  }

  buildStatCards(data: any): void {
    this.statCards = [
      {
        label: 'Total Rooms',
        value: data.rooms.total,
        sub: `${data.rooms.occupancy_rate}% occupied`,
        icon: 'bed',
        iconBg: 'rgba(201,168,106,0.1)',
        iconColor: 'var(--accent)',
        route: '/rooms',
      },
      {
        label: 'Available Rooms',
        value: data.rooms.available,
        sub: `${data.rooms.occupied} occupied`,
        icon: 'check_circle',
        iconBg: 'rgba(46,125,50,0.1)',
        iconColor: '#4CAF50',
        route: '/rooms',
      },
      {
        label: 'Active Bookings',
        value: data.bookings.active,
        sub: `${data.bookings.todays_checkins} check-ins today`,
        icon: 'calendar_month',
        iconBg: 'rgba(21,101,192,0.1)',
        iconColor: '#42A5F5',
        route: '/reservations',
      },
      {
        label: 'Total Customers',
        value: data.customers.total,
        sub: 'Registered guests',
        icon: 'people',
        iconBg: 'rgba(106,27,154,0.1)',
        iconColor: '#AB47BC',
        route: '/customers',
      },
      {
        label: 'Monthly Revenue',
        value: `$${data.revenue.this_month.toFixed(0)}`,
        sub: `$${data.revenue.outstanding.toFixed(0)} outstanding`,
        icon: 'payments',
        iconBg: 'rgba(201,168,106,0.1)',
        iconColor: 'var(--accent)',
        route: '/billing',
      },
      {
        label: 'Pending Orders',
        value: data.food.pending_orders,
        sub: 'Food & beverage',
        icon: 'restaurant',
        iconBg: 'rgba(198,40,40,0.1)',
        iconColor: '#EF5350',
        route: '/food',
      },
      {
        label: 'Cleaning Tasks',
        value: data.housekeeping.pending_tasks,
        sub: 'Pending & in progress',
        icon: 'cleaning_services',
        iconBg: 'rgba(0,105,92,0.1)',
        iconColor: '#26A69A',
        route: '/housekeeping',
      },
      {
        label: 'Total Revenue',
        value: `$${data.revenue.total.toFixed(0)}`,
        sub: 'All time',
        icon: 'bar_chart',
        iconBg: 'rgba(46,125,50,0.1)',
        iconColor: '#4CAF50',
        route: '/reports',
      },
    ];
  }
}
