import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

import { UtilService } from './util.service';
import { ApiResponse } from './api-response';

@Injectable({
  providedIn: 'root'
})
export class FcmsService {

  private apiBaseUrl = `${environment.apiBaseUrl}/fcms`;

  constructor(private http: HttpClient, private utilService: UtilService) { }

  sendFCM(phoneno: string, data: string) {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/sendFCM/${phoneno}`, data)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as string;
              })
              .catch(this.utilService.handleApiError);
  }
}
