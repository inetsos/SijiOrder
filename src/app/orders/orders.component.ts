import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS} from '../date.adapter';

import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { SettingService } from '../setting.service';
import { Setting } from '../setting';
import { OrdersService } from '../orders.service';
import { OrderEx } from '../orderEx';
import { Order } from '../order';
import { User } from '../user';
import { FcmsService } from '../fcms.service';

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
  orderAccept = false;
  orderReady = false;
  user: User;
  settings: Setting[];

  constructor(private router: Router, private authService: AuthService, private fcmsService: FcmsService,
    private ordersService: OrdersService, private settingService: SettingService) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {

      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        // 가맹점으로 로그인하였다.
        this.user = this.authService.getCurrentUser();
        this.settingService.index(this.user.username).then((settings) => this.settings = settings);
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

    // 문자 전송 체크에 따라 문자 전송을 한다.
    const order = this.getOrder(orderEx);

    order.status = status;
    this.ordersService.updateOrder(order._id, order)
    .then((saveordering) => {
      // alert('주문하였습니다.');
      if (saveordering.status === '접수') {
        // 접수문자를 전송하자.
        if (this.orderAccept === true) {
          let msg = '';
          for (let i = 0; i < this.settings.length; i++) {
            if ( this.settings[i].type === '접수문자') {
              msg = this.settings[i].content;
            }
          }
          if ( msg !== '') {
            this.sendFCM('접수', saveordering.phoneno, msg);
          }
        }
      } else if (saveordering.status === '차림') {
        // 차림 문자를 전송한다.
        if (this.orderReady === true) {
          let msg = '';
          for (let i = 0; i < this.settings.length; i++) {
            if ( this.settings[i].type === '차림문자') {
              msg = this.settings[i].content;
            }
          }
          if ( msg !== '') {
            this.sendFCM('준비', saveordering.phoneno, msg);
          }
        }
      }
      this.router.navigate(['/orders']);
      // // return;
    })
    .catch((response) => {
      alert('상태를 변경하지 못하였습니다. : ' + response.message);
    });
  }

  sendFCM(type: string, phoneno: string, msg: string) {
    // FCM push를 전송하자.
    // 1. 발신번호를 얻는다.
    let sendPhone = '';
    for (let i = 0; i < this.settings.length; i++) {
      if (this.settings[i].type === 'SMS발신폰번호') {
        sendPhone = this.settings[i].content;
      }
    }

    if ( sendPhone !== '') {
      const message = {
        to: sendPhone,
        data: {
            phoneno: phoneno,
            msg: msg
        },
        notification: {
            title: type + ' 문자전송',
            body: phoneno + '으로 ' + type + '문자 전송을 하였습니다.'
        }
      };

      this.fcmsService.sendFCM(sendPhone, JSON.stringify(message));
    }
  }

  setTable(orderEx: OrderEx, status: string) {

    const order = this.getOrder(orderEx);

    // 테이블 번호가 바뀐 상태이므로 수정 호출
    this.ordersService.updateOrder(order._id, order)
    .then((saveordering) => {
      this.router.navigate(['/orders']);
    })
    .catch((response) => {
      alert('테이블 번호를 변경하지 못하였습니다. : ' + response.message);
    });
  }
}
