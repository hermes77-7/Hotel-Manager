import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/dashboard/`);
  }

  getOccupancyReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/occupancy/`);
  }

  getBookingStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/bookings/`);
  }

  getRevenueReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/revenue/`);
  }
}
