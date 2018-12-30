import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

import { UtilService } from './util.service';
import { ApiResponse } from './api-response';
import { Menu } from './menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiBaseUrl = `${environment.apiBaseUrl}/menus`;

  constructor(private http: HttpClient, private utilService: UtilService) { }

  index(username: string): Promise<Menu[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${username}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Menu[];
              })
              .catch(this.utilService.handleApiError);
  }

  show(username: string, menuNo: number): Promise<Menu> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${username}/${menuNo}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Menu;
              })
              .catch(this.utilService.handleApiError);
  }

  create(username: string, menu: Menu): Promise<Menu> {
    // 여기서... 메뉴에 사용자 코드를 추가하자.
    menu.username = username;
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}`, menu)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Menu;
              })
              .catch(this.utilService.handleApiError);
  }

  update(username: string, menuNo: number, menu: Menu): Promise<Menu> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/${username}/${menuNo}`, menu)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Menu;
              })
              .catch(this.utilService.handleApiError);
  }

  destroy(username: string, menuNo: number): Promise<Menu> {
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/${username}/${menuNo}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Menu;
              })
              .catch(this.utilService.handleApiError);
  }
}
