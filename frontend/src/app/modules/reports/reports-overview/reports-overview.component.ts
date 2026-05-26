import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ReportsService } from '../services/reports.service';

@Component({
  selector: 'app-reports-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatTabsModule],
  templateUrl: './reports-overview.component.html',
  styleUrl: './reports-overview.component.scss',
})
export class ReportsOverviewComponent implements OnInit {
  occupancyData: any = null;
  bookingStats: any = null;
  revenueData: any = null;
  isLoading = true;

  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    this.reportsService.getOccupancyReport().subscribe((data) => {
      this.occupancyData = data;
    });

    this.reportsService.getBookingStats().subscribe((data) => {
      this.bookingStats = data;
    });

    this.reportsService.getRevenueReport().subscribe((data) => {
      this.revenueData = data;
      this.isLoading = false;
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      confirmed: '#42A5F5',
      checked_in: '#66BB6A',
      checked_out: '#9E9E9E',
      cancelled: '#EF5350',
    };
    return colors[status] ?? 'var(--text-muted)';
  }

  getRatingColor(rating: string): string {
    const colors: Record<string, string> = {
      excellent: 'var(--accent)',
      good: '#42A5F5',
      fair: '#FFA726',
      poor: '#EF5350',
    };
    return colors[rating] ?? 'var(--text-muted)';
  }

  getBarWidth(value: number, max: number): number {
    return max > 0 ? (value / max) * 100 : 0;
  }

  getMaxBookings(): number {
    if (!this.occupancyData) return 1;
    return Math.max(...this.occupancyData.monthly_data.map((m: any) => m.bookings), 1);
  }

  getMaxRevenue(): number {
    if (!this.occupancyData) return 1;
    return Math.max(...this.occupancyData.monthly_data.map((m: any) => m.revenue), 1);
  }

  getTotalBookings(): number {
    if (!this.bookingStats) return 0;
    return this.bookingStats.by_status.reduce((sum: number, s: any) => sum + s.count, 0);
  }

  getPaymentTotal(): number {
    if (!this.revenueData) return 0;
    return this.revenueData.by_payment_method.reduce((sum: number, p: any) => sum + p.total, 0);
  }
}
