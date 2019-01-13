import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

import { UtilService } from './util.service';
import { ApiResponse } from './api-response';
import { OrderEx } from './orderEx';
import { Order } from './order';
import { OrderMenu } from './ordermenu';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiBaseUrl = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient, private utilService: UtilService) { }

  getOrders(storename: string): Promise<OrderEx[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/${storename}`)
    .toPromise()
    .then(this.utilService.checkSuccess)
    .then(response => {
      return response.data as OrderEx[];
    })
    .catch(this.utilService.handleApiError);
  }

  getTodayOrders(storename: string, today: string): Promise<OrderEx[]> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/today/${storename}/${today}`)
    .toPromise()
    .then(this.utilService.checkSuccess)
    .then(response => {
      return response.data as OrderEx[];
    })
    .catch(this.utilService.handleApiError);
  }

  getMyOrders(username: string): Promise<OrderEx[]> {
    // return this.http.get<ApiResponse>(`${this.apiBaseUrl}/myorder/${username}/${today}`)
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/myorder/${username}`)
    .toPromise()
    .then(this.utilService.checkSuccess)
    .then(response => {
      return response.data as OrderEx[];
    })
    .catch(this.utilService.handleApiError);
  }

  // 현재 주문중인 주문서를 가져온다.
  getOrdering(storename: string, username: string): Promise<OrderEx> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/ordering/${storename}/${username}`)
    .toPromise()
    .then(this.utilService.checkSuccess)
    .then(response => {
      // console.log(response);
      return response.data as OrderEx;
    })
    .catch(this.utilService.handleApiError);
  }

  getLastOrder(storename: string, username: string): Promise<Order> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/last/${storename}/${username}`)
    .toPromise()
    .then(this.utilService.checkSuccess)
    .then(response => {
      return response.data as Order;
    })
    .catch(this.utilService.handleApiError);
  }

  // 주문을 저장한다.
  // 1. 주문 메뉴를 먼저 저장하여 _id를 받는다.
  // 2. 주문 정보에 주문 메뉴 _id를 추가한 후 저장한다.
  saveOrderMenu(ordermenu: OrderMenu): Promise<OrderMenu> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/ordermenu`, ordermenu)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as OrderMenu;
              })
              .catch(this.utilService.handleApiError);
  }

  saveOrder(order: Order): Promise<Order> {
    return this.http.post<ApiResponse>(`${this.apiBaseUrl}/order`, order)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Order;
              })
              .catch(this.utilService.handleApiError);
  }

  updateOrder(id: string, order: Order): Promise<Order> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/order/${id}`, order)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as Order;
              })
              .catch(this.utilService.handleApiError);
  }

  updateOrderMenu(id: string, ordermenu: OrderMenu): Promise<OrderMenu> {
    return this.http.put<ApiResponse>(`${this.apiBaseUrl}/ordermenu/${id}`, ordermenu)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as OrderMenu;
              })
              .catch(this.utilService.handleApiError);
  }

  deleteOrderMenu(id: string): Promise<OrderMenu> {
    return this.http.delete<ApiResponse>(`${this.apiBaseUrl}/ordermenu/${id}`)
              .toPromise()
              .then(this.utilService.checkSuccess)
              .then(response => {
                return response.data as OrderMenu;
              })
              .catch(this.utilService.handleApiError);
  }
}
