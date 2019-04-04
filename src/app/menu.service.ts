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

  // 사용하지 않음
  getMenus(username: string): Promise<Menu[]> {
    return this.http.get(`${this.apiBaseUrl}/${username}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                // console.log(response);
                return response.data; // as Menu[];
              })
              .catch(this.utilService.handleApiError);
  }

  getGroups(username: string): Promise<string[]> {
    return this.http.get(`${this.apiBaseUrl}/groups/${username}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                // console.log(response);
                return response.data as string[];
              })
              .catch(this.utilService.handleApiError);
  }

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
<<<<<<< HEAD
    // 여기서... 메뉴에 회원아이디를 추가하자.
    menu.username = username;
=======
    // 여기서... 메뉴에 사용자 코드를 추가하자.
    // menu.username = username;
    console.log(menu);
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
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
