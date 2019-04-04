import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS} from '../date.adapter';

import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { OrdersService } from '../orders.service';
import { Order } from '../order';
import { User } from '../user';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.component.html',
  styleUrls: ['./myorders.component.css'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class MyordersComponent implements OnInit {

  navigationSubscription;
  // today = new Date();

  orders = [] as Order[];
  user: User;

  constructor(private router: Router, private authService: AuthService, private ordersService: OrdersService) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {

      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        // 가맹점으로 로그인하였다.
        this.user = this.authService.getCurrentUser();

        this.ordersService.getMyOrders(this.user.username)
        .then((orders) => this.orders = orders )
        .catch((err) => null);
      }
    });
   }

  ngOnInit() {
  }

  todayOrders() {
    // 오늘의 주문을 로드하자.
    // const today = this.today.getFullYear() + '-' + this._to2digit(this.today.getMonth() + 1)
    //  + '-' + this._to2digit(this.today.getDate());

    this.ordersService.getMyOrders(this.user.username)
    .then((orders) => this.orders = orders )
    .catch((err) => null);
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }

  getTotal(order: Order) {

    if (!order.ordermenu) {
      return 0;
    }

    let total = 0;
    for ( let i = 0; i < order.ordermenu.length ; i++) {
      total += order.ordermenu[i].sum;
    }
    return total;
  }

}
