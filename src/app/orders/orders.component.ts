import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS} from '../date.adapter';

import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { OrdersService } from '../orders.service';
import { OrderEx } from '../orderEx';
import { Order } from '../order';
import { User } from '../user';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class OrdersComponent implements OnInit {

  navigationSubscription;
  today = new Date();

  orders = [] as OrderEx[];
  orderOnly = false;
  user: User;

  constructor(private router: Router, private authService: AuthService, private ordersService: OrdersService) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {

      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        // 가맹점으로 로그인하였다.
        this.user = this.authService.getCurrentUser();
        this.todayOrders();
      }
    });
  }

  ngOnInit() {
  }

  todayOrders() {
    // 오늘의 주문을 로드하자.
    const storename = this.user.username;
    const today = this.today.getFullYear() + '-' + this._to2digit(this.today.getMonth() + 1) + '-' + this._to2digit(this.today.getDate());

    this.ordersService.getTodayOrders(storename, today)
    .then((orders) => this.orders = orders )
    .catch((err) => null);
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }

  getTotal(order: OrderEx) {

    if (!order.ordermenu) {
      return 0;
    }

    let total = 0;
    for ( let i = 0; i < order.ordermenu.length ; i++) {
      total += order.ordermenu[i].sum;
    }
    return total;
  }

  getOrder(orderEx: OrderEx) {

    const order = {} as Order;

    order._id = orderEx._id;
    order.storename = orderEx.storename;
    order.shopname = orderEx.shopname;
    order.username = orderEx.username;
    order.tableNo = orderEx.tableNo;
    order.orderNo = orderEx.orderNo;
    order.status = orderEx.status;
    order.createdAt = orderEx.createdAt;
    order.orderedAt = orderEx.orderedAt;
    order.confirmedAt = orderEx.confirmedAt;
    // console.log('2.', this.ordering);
    order.ordermenu = [];
    for (let i = 0 ; i < orderEx.ordermenu.length; i++) {
      order.ordermenu[i] = orderEx.ordermenu[i]._id;
    }

    return order;
  }

  confirmOrder(orderEx: OrderEx, status: string) {

    const order = this.getOrder(orderEx);

    order.status = status;
    this.ordersService.updateOrder(order._id, order)
    .then((saveordering) => {
      // alert('주문하였습니다.');
      this.router.navigate(['/orders']);
      // // return;
    })
    .catch((response) => {
      alert('상태를 변경하지 못하였습니다. : ' + response.message);
    });
  }

}
