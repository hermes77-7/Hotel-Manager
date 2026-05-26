import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Invoice } from '../../../shared/models/invoice.model';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private apiUrl = `${environment.apiUrl}/billing`;

  constructor(private http: HttpClient) {}

  getInvoices(filters?: { status?: string; search?: string }): Observable<Invoice[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<Invoice[]>(`${this.apiUrl}/`, { params });
  }

  getInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}/`);
  }

  updateInvoice(id: number, invoice: Partial<Invoice>): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.apiUrl}/${id}/`, invoice);
  }

  markPaid(id: number, paymentMethod: string): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/${id}/mark_paid/`, {
      payment_method: paymentMethod,
    });
  }

  recordPayment(id: number, amount: number, paymentMethod: string): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/${id}/record_payment/`, {
      amount,
      payment_method: paymentMethod,
    });
  }
}
