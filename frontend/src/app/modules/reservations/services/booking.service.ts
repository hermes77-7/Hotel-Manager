import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Booking } from '../../../shared/models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = `${environment.apiUrl}/api/reservations`;

  constructor(private http: HttpClient) {}

  getBookings(filters?: { status?: string; search?: string }): Observable<Booking[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<Booking[]>(`${this.apiUrl}/api/`, { params });
  }

  getBooking(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/api/${id}/`);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/api/`, booking);
  }

  updateBooking(id: number, booking: Booking): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}/api/`, booking);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/${id}/`);
  }

  // Status transitions
  checkIn(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/api/${id}/check_in/`, {});
  }

  checkOut(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/api/${id}/check_out/`, {});
  }

  cancel(id: number): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/api/${id}/cancel/`, {});
  }
}
