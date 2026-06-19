import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3333';

  readonly currentUser = signal<any>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );

  signup(data: { name: string; email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/signup`, data).pipe(
      tap((res) => this.saveSession(res.data))
    );
  }

  signin(data: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/auth/signin`, data).pipe(
      tap((res) => this.saveSession(res.data))
    );
  }

  signout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  private saveSession(data: any) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.currentUser.set(data.user);
  }
}