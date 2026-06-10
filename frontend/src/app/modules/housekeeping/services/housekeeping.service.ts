import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CleaningTask, HygieneReport, SupplyLog } from '../../../shared/models/housekeeping.model';

@Injectable({ providedIn: 'root' })
export class HousekeepingService {
  private baseUrl = `${environment.apiUrl}/housekeeping`;

  constructor(private http: HttpClient) {}

  // ── Tasks ─────────────────────────────────────
  getTasks(filters?: {
    status?: string;
    priority?: string;
    search?: string;
  }): Observable<CleaningTask[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.priority) params = params.set('priority', filters.priority);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<CleaningTask[]>(`${this.baseUrl}/tasks/`, { params });
  }

  createTask(task: CleaningTask): Observable<CleaningTask> {
    return this.http.post<CleaningTask>(`${this.baseUrl}/tasks/`, task);
  }

  updateTask(id: number, task: CleaningTask): Observable<CleaningTask> {
    return this.http.put<CleaningTask>(`${this.baseUrl}/tasks/${id}/`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}/`);
  }

  startTask(id: number): Observable<CleaningTask> {
    return this.http.post<CleaningTask>(`${this.baseUrl}/tasks/${id}/start/`, {});
  }

  completeTask(id: number): Observable<CleaningTask> {
    return this.http.post<CleaningTask>(`${this.baseUrl}/tasks/${id}/complete/`, {});
  }

  inspectTask(id: number): Observable<CleaningTask> {
    return this.http.post<CleaningTask>(`${this.baseUrl}/tasks/${id}/inspect/`, {});
  }

  // ── Reports ───────────────────────────────────
  getReports(filters?: { room?: number; rating?: string }): Observable<HygieneReport[]> {
    let params = new HttpParams();
    if (filters?.room) params = params.set('room', String(filters.room));
    if (filters?.rating) params = params.set('rating', filters.rating);
    return this.http.get<HygieneReport[]>(`${this.baseUrl}/reports/`, { params });
  }

  createReport(report: HygieneReport): Observable<HygieneReport> {
    return this.http.post<HygieneReport>(`${this.baseUrl}/reports/`, report);
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reports/${id}/`);
  }

  // ── Supplies ──────────────────────────────────
  getSupplies(): Observable<SupplyLog[]> {
    return this.http.get<SupplyLog[]>(`${this.baseUrl}/supplies/`);
  }

  logSupply(supply: SupplyLog): Observable<SupplyLog> {
    return this.http.post<SupplyLog>(`${this.baseUrl}/supplies/`, supply);
  }

  deleteSupply(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/supplies/${id}/`);
  }
}
