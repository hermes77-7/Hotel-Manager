import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phone: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login/`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.access);
          localStorage.setItem('refresh_token', response.refresh);
          this.fetchCurrentUser();
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');  // ← clear cached user too
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  fetchCurrentUser(): void {
    this.http.get<User>(`${this.apiUrl}/auth/me/`)
      .pipe(
        tap(user => {
          // Cache the user in localStorage so it survives server restarts
          localStorage.setItem('current_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError(() => {
          // Django is offline — load user from cache instead
          this.loadUserFromCache();
          return of(null);
        })
      )
      .subscribe();
  }

  private loadUserFromStorage(): void {
    if (this.isLoggedIn()) {
      // First load from cache instantly so header shows immediately
      this.loadUserFromCache();
      // Then try to refresh from Django in the background
      this.fetchCurrentUser();
    }
  }

  private loadUserFromCache(): void {
    const cached = localStorage.getItem('current_user');
    if (cached) {
      this.currentUserSubject.next(JSON.parse(cached));
    }
  }
}