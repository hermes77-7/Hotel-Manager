import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/`);
  }

  getOccupancyReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/occupancy/`);
  }

  getBookingStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/`);
  }

  getRevenueReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/revenue/`);
  }
}
