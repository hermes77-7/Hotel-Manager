import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MenuItem } from '../../../shared/models/menu-item.model';
import { FoodOrder } from '../../../shared/models/food-order.model';

@Injectable({ providedIn: 'root' })
export class FoodService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Menu ──────────────────────────────────────
  getMenuItems(filters?: {
    category?: string;
    is_available?: boolean;
    search?: string;
  }): Observable<MenuItem[]> {
    let params = new HttpParams();
    if (filters?.category) params = params.set('category', filters.category);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.is_available !== undefined)
      params = params.set('is_available', String(filters.is_available));
    return this.http.get<MenuItem[]>(`${this.baseUrl}/food/menu/`, { params });
  }

  createMenuItem(item: MenuItem): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.baseUrl}/food/menu/`, item);
  }

  updateMenuItem(id: number, item: MenuItem): Observable<MenuItem> {
    return this.http.put<MenuItem>(`${this.baseUrl}/food/menu/${id}/`, item);
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/food/menu/${id}/`);
  }

  // ── Orders ────────────────────────────────────
  getOrders(filters?: { status?: string; search?: string }): Observable<FoodOrder[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<FoodOrder[]>(`${this.baseUrl}/food/orders/`, { params });
  }

  createOrder(order: any): Observable<FoodOrder> {
    return this.http.post<FoodOrder>(`${this.baseUrl}/food/orders/`, order);
  }

  startPreparing(id: number): Observable<FoodOrder> {
    return this.http.post<FoodOrder>(`${this.baseUrl}/food/orders/${id}/start_preparing/`, {});
  }

  markReady(id: number): Observable<FoodOrder> {
    return this.http.post<FoodOrder>(`${this.baseUrl}/food/orders/${id}/mark_ready/`, {});
  }

  markDelivered(id: number): Observable<FoodOrder> {
    return this.http.post<FoodOrder>(`${this.baseUrl}/food/orders/${id}/mark_delivered/`, {});
  }

  cancelOrder(id: number): Observable<FoodOrder> {
    return this.http.post<FoodOrder>(`${this.baseUrl}/food/orders/${id}/cancel/`, {});
  }
}
