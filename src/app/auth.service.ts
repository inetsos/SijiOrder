import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { UtilService } from './util.service';
import { ApiResponse } from './api-response';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiBaseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router, private utilService: UtilService) { }

  login(username: string, password: string, group: string): Promise<any> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/login`, {username: username, password: password, group: group})
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                localStorage.setItem('token', response.data);
              })
              .catch(this.utilService.handleApiError);
  }

  me(): Promise<User> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/me`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                return response.data as User;
              })
              .catch(response => {
                this.logout();
                return this.utilService.handleApiError(response);
              });
  }

  refresh(): Promise<any> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/refresh`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                localStorage.setItem('token', response.data);
                if (!this.getCurrentUser()) {
                  return this.me();
                }
              })
              .catch(response => {
                this.logout();
                return this.utilService.handleApiError(response);
              });
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('currentUser')) as User;
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      return false;
    }
  }

  isStore(): boolean {
    const user = this.getCurrentUser();
    if (user) {
      const group = user.group;
      if (group === '가맹점') {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

}
