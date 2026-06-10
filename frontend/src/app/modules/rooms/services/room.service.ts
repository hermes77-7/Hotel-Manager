import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Room } from '../../../shared/models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private apiUrl = `${environment.apiUrl}/api/rooms`;

  constructor(private http: HttpClient) {}

  // GET /api/rooms/ — with optional filters
  getRooms(filters?: { status?: string; room_type?: string; search?: string }): Observable<Room[]> {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.room_type) params = params.set('room_type', filters.room_type);
    if (filters?.search) params = params.set('search', filters.search);
    return this.http.get<Room[]>(`${this.apiUrl}/api/`, { params });
  }

  // GET /api/rooms/1/
  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/api/${id}/`);
  }

  // POST /api/rooms/
  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/api/`, room);
  }

  // PUT /api/rooms/1/
  updateRoom(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/api/${id}/`, room);
  }

  // DELETE /api/rooms/1/
  deleteRoom(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/${id}/`);
  }
}
