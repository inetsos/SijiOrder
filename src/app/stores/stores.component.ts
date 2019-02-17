import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../menu.service';
import { UserService } from '../user.service';
import { SettingService } from '../setting.service';
import { Menu } from '../menu';
import { OrderMenu } from '../ordermenu';
import { OrderEx } from '../orderEx';
import { Order } from '../order';
import { Setting } from '../setting';
import { User } from '../user';
import { AuthService } from '../auth.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {

  navigationSubscription;

  username = '';
  user: User; // 가맹점이다.
  menus: Menu[];
  orderingEx = {} as OrderEx;
  ordering = {} as Order;
  amounts: number[];
  settings: Setting[];
  classifies: string[];
    // promiseMenus: Promise<Menu[]>;
  classify = '전체';

  nonmember = false;
  phoneno = '';
  password = '';

  constructor(private route: ActivatedRoute, private menuService: MenuService, private userService: UserService,
    private settingService: SettingService, private authService: AuthService, private router: Router,
    private ordersService: OrdersService) {

    this.navigationSubscription = this.router.events.subscribe((e: any) => {

      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.route.params.subscribe(params => {
          // 가맹점 사용자이름이다.
          this.username = params['username'].split('?')[0]; // 'jongbujip?classify=전체' 형태가 있다.

          // 가맹점의 정보는 얻는다.
          this.userService.getStore(this.username).then(user => this.user = user);
          // console.log(this.user.storeName);
          const storename = this.username;

          if (this.authService.isLoggedIn()) {

            const username = this.authService.getCurrentUser().username;  // 회원이다.
            // this.orderingEx = this.ordersService.getOrdering(storename, username).;
            this.ordersService.getOrdering(storename, username)
            .then((orderingEx) => {
              this.orderingEx = {} as OrderEx;
              this.orderingEx = orderingEx;

              this.ordering = {} as Order;

              this.ordering._id = orderingEx._id;
              this.ordering.storename = orderingEx.storename;
              this.ordering.shopname = orderingEx.shopname;
              this.ordering.username = orderingEx.username;
              this.ordering.tableNo = orderingEx.tableNo;
              this.ordering.orderNo = orderingEx.orderNo;
              this.ordering.status = orderingEx.status;
              this.ordering.createdAt = orderingEx.createdAt;
              this.ordering.orderedAt = orderingEx.orderedAt;
              this.ordering.confirmedAt = orderingEx.confirmedAt;
              // console.log('2.', this.ordering);
              this.ordering.ordermenu = [];
              for (let i = 0 ; i < orderingEx.ordermenu.length; i++) {
                this.ordering.ordermenu[i] = orderingEx.ordermenu[i]._id;
              }

              // console.log('3.', this.ordering);
            })
            .catch((response) => {
              this.orderingEx = null;
              this.ordering = null;
            });
          } else {
            // 비회원 주문
            this.phoneno = sessionStorage.getItem('phoneno');
            this.password = sessionStorage.getItem('password');

            const username = '';
            // this.orderingEx = this.ordersService.getOrdering(storename, username).;
            this.ordersService.getNonmemberOrdering(storename, this.phoneno)
            .then((orderingEx) => {
              this.orderingEx = {} as OrderEx;
              this.orderingEx = orderingEx;

              this.ordering = {} as Order;

              this.ordering._id = orderingEx._id;
              this.ordering.storename = orderingEx.storename;
              this.ordering.shopname = orderingEx.shopname;
              this.ordering.username = orderingEx.username;
              this.ordering.tableNo = orderingEx.tableNo;
              this.ordering.orderNo = orderingEx.orderNo;
              this.ordering.status = orderingEx.status;
              this.ordering.createdAt = orderingEx.createdAt;
              this.ordering.orderedAt = orderingEx.orderedAt;
              this.ordering.confirmedAt = orderingEx.confirmedAt;
              // console.log('2.', this.ordering);
              this.ordering.ordermenu = [];
              for (let i = 0 ; i < orderingEx.ordermenu.length; i++) {
                this.ordering.ordermenu[i] = orderingEx.ordermenu[i]._id;
              }

              // console.log('3.', this.ordering);
            })
            .catch((response) => {
              this.orderingEx = null;
              this.ordering = null;
            });

          }
        });
      }
    });
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.classify) {
          this.classify = params.classify;
        } else {
          this.classify = '';
        }

        this.menuService.index(this.username).then((menus) => {
          this.menus = menus;
        });
        this.settingService.getSetting(this.username, '메뉴분류순서').then((settings) => {
          // this.settings = settings;
          const tmp = settings[0].content.replace(/ /gi, '');
          this.classifies = tmp.split(',');

          if (this.classify === '') {
            this.classify = this.classifies[0];
          }
        });

        // this.promiseMenus = this.menuService.getMenus(this.username);
      });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  // 메뉴를 선택하면 먼저 로그인 상태를 확인하고
  // 로그인이 아니라면 로그인을 하도록 유도하고
  // 로그인 후에 마지막 주문 정보를 얻어서 상태를 확인한다.
  // 상태가 주문 완료되었다면 새로운 주문서를 만들어야 한다.
  // 주문번호는 마지막 주문번호 + 1

  orderMenu(menu: Menu) {

    // 로그인여부를 확인한다.
    if (this.authService.isLoggedIn() === false && this.nonmember === false ) {
      const answer = confirm('로그인 하시겠습니까?\n"취소"를 선택하시면 비회원주문을 체크하세요.');
      if (answer) {
        this.router.navigate(['login'], {
          queryParams: { redirectTo: '/stores/' + this.username + '?classify=' + this.classify }
        });
        return false;
      }
      return;
    }

    if (this.nonmember === true) {
      // 비회원 주문
      // 고객이 메뉴의 '주문'버튼을 눌렀다.
      // 1. 전화번호와 비밀번호의 입력을 확인한다.
      // 2. 신규 주문서를 만들어 저장한다.
      // 3. 계속 주문을 받는다.
      if (this.phoneno === '' || this.password === '') {
        alert('전화번호와 비밀번호을 입력하세요.');
        return;
      }

      // 같은 메뉴를 계속 선택한 경우 메뉴의 수량을 증가시킨다.
      if (this.orderingEx) {
        for (let i = 0; i < this.orderingEx.ordermenu.length ; i++ ) {
          if (this.orderingEx.ordermenu[i].menuNo === menu.menuNo) {
            this.orderingEx.ordermenu[i].number++;
            this.orderingEx.ordermenu[i].sum = this.orderingEx.ordermenu[i].number * this.orderingEx.ordermenu[i].price;
            this.ordersService.updateOrderMenu(this.orderingEx.ordermenu[i]._id,
              this.orderingEx.ordermenu[i]).catch(response => null);
            return;
          }
        }
      }

      this.phoneno = this.phoneno.replace(/[^0-9]/g, ''); // 숫자만 추출

      const storename = this.username;  // 가맹점이다.
      const username = '';
      const ordermenu: OrderMenu = {
        storename: storename,   // 가맹점
        username: username,         // 회원
        orderNo: 1,
        menuNo: menu.menuNo,
        classify: menu.classify,
        name: menu.name,
        price: menu.price,
        number: 1,
        sum: menu.price
      };

      if (this.ordering) {
        // 주문중인 주문서를 가져왔다.
        // 주문 메뉴를 저장하고, id를 얻어 주문서에 추가한 후 주문서를 수정한다.
        // 먼저 주문 메뉴를 저장하고
        this.ordersService.saveOrderMenu(ordermenu)
        .then((orderitem) => {
          // if (!this.ordering.ordermenu) {
          //   this.ordering.ordermenu = [];
          // }
          this.ordering.ordermenu.push(orderitem._id);
          this.ordersService.updateOrder(this.ordering._id, this.ordering)
          .then((saveordering) => {
            // alert('주문서에 저장하였습니다.');
            this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify, nonmember: this.phoneno } });
            // return;
          })
          .catch((response) => {
            alert('추가 주문 저장 오류: ' + response.message);
          });
        });
      } else {
        // 주문중이 아니다. 주문서를 만들어야 한다.
        // 주문메뉴없이 주문번호 0으로 주문서를 먼저 만든 후 주문서를 다시 가져온다.
        // 먼저 주문 메뉴를 저장하고
        this.ordersService.saveOrderMenu(ordermenu)
        .then((orderitem) => {
          // 저장한 주문 메뉴 정보를 받으면 주문정보를 저장한다.
          const order: Order = {
            storename: orderitem.storename,  // 가맹점
            shopname: this.user.storeName,
            username: '', // 회원
            phoneno: this.phoneno,
            password: this.password,
            type: 1,
            tableNo: 0,
            orderNo: orderitem.orderNo,
            status: '선택',
            ordermenu: [orderitem._id]
          };
          this.ordersService.saveOrder(order)
          .then((savedorder) => {
            sessionStorage.setItem('phoneno', this.phoneno);
            sessionStorage.setItem('password', this.password);
            // 정상적으로 주문이 저장되었다면 페이지를 다시 읽는다.
            this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify, nonmember: this.phoneno } });
            return;
          })
          .catch((response) => {
            // 주문 저장을 실패하면 현재 페이지에 남는다.
            alert('주문 저장 오류: ' + response.message);
          });
        })
        .catch((response) => {
          // 주문메뉴 저장을 실패하였다. 우짜지?
          // console.log(response);
          alert('주문메뉴 저장 오류: ' + response.message);
        });
      }

    } else {
      // 회원 주문
      // 선택한 메뉴가 이미 선택된 메뉴라면 수량과 금액만 변경하고 저장한다.
      if (this.orderingEx) {
        for (let i = 0; i < this.orderingEx.ordermenu.length ; i++ ) {
          if (this.orderingEx.ordermenu[i].menuNo === menu.menuNo) {
            this.orderingEx.ordermenu[i].number++;
            this.orderingEx.ordermenu[i].sum = this.orderingEx.ordermenu[i].number * this.orderingEx.ordermenu[i].price;
            this.ordersService.updateOrderMenu(this.orderingEx.ordermenu[i]._id,
              this.orderingEx.ordermenu[i]).catch(response => null);
            return;
          }
        }
      }

      // console.log('1.', menu);
      // 주문중인 주문서가 있는가?
      const storename = this.username;  // 가맹점이다.
      // 비회원 주문의 경우 전화번호를 입력하여야 한다.
      const username = this.authService.getCurrentUser().username;
      const ordermenu: OrderMenu = {
        storename: storename,   // 가맹점
        username: username,         // 회원
        orderNo: 1,
        menuNo: menu.menuNo,
        classify: menu.classify,
        name: menu.name,
        price: menu.price,
        number: 1,
        sum: menu.price
      };

      if (this.ordering) {
        // 주문중인 주문서를 가져왔다.
        // 주문 메뉴를 저장하고, id를 얻어 주문서에 추가한 후 주문서를 수정한다.
        // 먼저 주문 메뉴를 저장하고
        this.ordersService.saveOrderMenu(ordermenu)
        .then((orderitem) => {
          this.ordering.ordermenu.push(orderitem._id);
          this.ordersService.updateOrder(this.ordering._id, this.ordering)
          .then((saveordering) => {
            // alert('주문서에 저장하였습니다.');
            this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
            // return;
          })
          .catch((response) => {
            alert('추가 주문 저장 오류: ' + response.message);
          });
        });
      } else {
        // 주문중이 아니다. 주문서를 만들어야 한다.
        // 주문메뉴없이 주문번호 0으로 주문서를 먼저 만든 후 주문서를 다시 가져온다.
        // 먼저 주문 메뉴를 저장하고
        this.ordersService.saveOrderMenu(ordermenu)
        .then((orderitem) => {
          // 저장한 주문 메뉴 정보를 받으면 주문정보를 저장한다.
          const order: Order = {
            storename: orderitem.storename,  // 가맹점
            shopname: this.user.storeName,
            username: orderitem.username, // 회원
            phoneno: '',
            password: '',
            type: 0,
            tableNo: 0,
            orderNo: orderitem.orderNo,
            status: '선택',
            ordermenu: [orderitem._id]
          };
          this.ordersService.saveOrder(order)
          .then((savedorder) => {
            // 정상적으로 주문이 저장되었다면 페이지를 다시 읽는다.
            this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
            return;
          })
          .catch((response) => {
            // 주문 저장을 실패하면 현재 페이지에 남는다.
            alert('주문 저장 오류: ' + response.message);
          });
        })
        .catch((response) => {
          // 주문메뉴 저장을 실패하였다. 우짜지?
          // console.log(response);
          alert('주문메뉴 저장 오류: ' + response.message);
        });
      }
    }
  }

  addNumber(index: number) {
    // 주문 수량을 증가시킨다.
    // ordermenu.number++;
    // ordermenu.sum = ordermenu.price * ordermenu.number;
    // 주문메뉴 저장 데이터를 갱신한다.
    this.orderingEx.ordermenu[index].number++;
    this.orderingEx.ordermenu[index].sum = this.orderingEx.ordermenu[index].price * this.orderingEx.ordermenu[index].number;

    this.ordersService.updateOrderMenu(this.orderingEx.ordermenu[index]._id,
      this.orderingEx.ordermenu[index]).catch(response => null);
  }

  subsNumber(index: number) {

    if ( this.orderingEx.ordermenu[index].number === 0) {
      return;
    }

    if ( this.orderingEx.ordermenu[index].number - 1 === 0) {
      const answer = confirm('주문메뉴 수량이 "0"이면 삭제합니다. 계속할까요?');
      if (answer) {
        // 수량이 '0'이면 삭제한다.
        this.ordersService.deleteOrderMenu(this.orderingEx.ordermenu[index]._id)
        .then((deletemenu) => {
          // order에서 ordermenu정보를 수정해야 한다.
          const idx = this.ordering.ordermenu.indexOf(deletemenu._id);
          if (idx > -1) {
            this.ordering.ordermenu.splice(idx, 1);
          }
          this.ordersService.updateOrder(this.ordering._id, this.ordering)
          .then((saveordering) => {
            // alert('주문서에 저장하였습니다.');
            this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
            // return;
          })
          .catch((response) => {
            alert('추가 주문 저장 오류: ' + response.message);
          });
        })
        .catch(response => null);
      }
    } else {
      // 주문메뉴 수량 감소 후 저장 데이터를 갱신한다.
      this.orderingEx.ordermenu[index].number--;
      this.orderingEx.ordermenu[index].sum = this.orderingEx.ordermenu[index].price * this.orderingEx.ordermenu[index].number;

      this.ordersService.updateOrderMenu(this.orderingEx.ordermenu[index]._id,
      this.orderingEx.ordermenu[index]).catch(response => null);
    }
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

  submitOrder(order: Order) {

    order.status = '주문';
    this.ordersService.updateOrder(order._id, order)
    .then((saveordering) => {
      alert('주문하였습니다.');
      this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
      // return;
    })
    .catch((response) => {
      alert('주문을 하지 못했습니다. : ' + response.message);
    });
  }

  cancelOrder(order: Order) {
    const answer = confirm('주문을 취소하시겠습니까?');
    if (!answer) {
      return;
    }

    order.status = '고객취소';
    this.ordersService.updateOrder(order._id, order)
    .then((saveordering) => {
      alert('주문을 취소하였습니다.');
      this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
      // return;
    })
    .catch((response) => {
      alert('주문을 취소 하지 못했습니다. : ' + response.message);
    });
  }
}
