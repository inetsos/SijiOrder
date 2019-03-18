import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { UtilService } from './util.service';
import { ApiResponse } from './api-response';
import { Setting } from './setting';


@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private apiBaseUrl = `${environment.apiBaseUrl}/settings`;

  constructor(private http: HttpClient, private utilService: UtilService,
    private authService: AuthService) { }

  index(username: string): Promise<Setting[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${username}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Setting[];
              })
              .catch(this.utilService.handleApiError);
  }

  getSetting(username: string, type: string): Promise<Setting[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${username}/${type}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Setting[];
              })
              .catch(this.utilService.handleApiError);
  }

  create(setting: Setting): Promise<Setting> {
    // 여기서... 메뉴에 회원아이디를 추가하자.
    // setting.username = this.authService.getCurrentUser().username;
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}`, setting)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Setting;
              })
              .catch(this.utilService.handleApiError);
  }

  update(id: string, setting: Setting): Promise<Setting> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/${id}`, setting)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Setting;
              })
              .catch(this.utilService.handleApiError);
  }

  destroy(id: string): Promise<Setting> {
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/${id}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Setting;
              })
              .catch(this.utilService.handleApiError);
  }

}
