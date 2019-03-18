import { Component, OnInit, ɵConsole } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../menu.service';
import { UserService } from '../user.service';
import { SettingService } from '../setting.service';
import { Menu } from '../menu';
import { Order, OrderMenu } from '../order';
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
  ordering = {} as Order;
  amounts: number[];
  settings: Setting[];
  classifies: string[];
    // promiseMenus: Promise<Menu[]>;
  classify = '전체';

  nonmember = false;
  mobileOrder = '';
  phoneno = '';
  password = '';

  today = new Date();
  todayOrders: Order[];
  isshow = false;

  constructor(private route: ActivatedRoute, private menuService: MenuService, private userService: UserService,
    private settingService: SettingService, private authService: AuthService, private router: Router,
    private ordersService: OrdersService) {

    this.navigationSubscription = this.router.events.subscribe((e: any) => {

      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.route.params.subscribe(params => {
          // 가맹점 아이디이다.
          this.username = params['username'].split('?')[0]; // 'jongbujip?classify=전체' 형태가 있다.

          // 가맹점의 정보는 얻는다.
          this.userService.getStore(this.username).then(user => this.user = user);
          // console.log(this.user.storeName);
         const storename = this.username;

          if (this.authService.isLoggedIn()) {

            const username = this.authService.getCurrentUser().username;  // 회원이다.
            // this.orderingEx = this.ordersService.getOrdering(storename, username).;
            this.ordersService.getOrdering(storename, username)
            .then((ordering) => {
              this.ordering = ordering;
              if (!this.ordering.ordermenu) {
                this.ordering.ordermenu = [];
              }
            })
            .catch((response) => {
              this.ordering = {} as Order;
              this.ordering.ordermenu = [];
            });
          } else {
            // 비회원 주문
            this.phoneno = sessionStorage.getItem('phoneno');
            this.password = sessionStorage.getItem('password');

            // this.orderingEx = this.ordersService.getOrdering(storename, username).;
            this.ordersService.getNonmemberOrdering(storename, this.phoneno)
            .then((ordering) => {
              this.ordering = ordering;
              if (!this.ordering.ordermenu) {
                this.ordering.ordermenu = [];
              }
            })
            .catch((response) => {
              this.ordering = {} as Order;
              this.ordering.ordermenu = [];
            });
          }
        });
      }
    });
  }

  ngOnInit() {
    this.settingService.getSetting(this.username, '모바일주문').then((settings) => {
      this.mobileOrder = settings[0].content;
    });

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
      });

      if (this.authService.isLoggedIn()) {

        const username = this.authService.getCurrentUser().username;  // 회원이다.
        // this.orderingEx = this.ordersService.getOrdering(storename, username).;
        this.ordersService.getOrdering(this.username, username)
        .then((ordering) => {
          this.ordering = ordering;
          if (!this.ordering.ordermenu) {
            this.ordering.ordermenu = [];
          }
        })
        .catch((response) => {
          this.ordering = {} as Order;
          this.ordering.ordermenu = [];
        });
      } else {
        // 비회원 주문
        this.phoneno = sessionStorage.getItem('phoneno');
        this.password = sessionStorage.getItem('password');
        if (!this.phoneno) {
          this.phoneno = '';
          this.ordering = {} as Order;
          this.ordering.ordermenu = [];
          return;
        }

        // this.orderingEx = this.ordersService.getOrdering(storename, username).;
        this.ordersService.getNonmemberOrdering(this.username, this.phoneno)
        .then((ordering) => {
          this.ordering = ordering;
          if (!this.ordering.ordermenu) {
            this.ordering.ordermenu = [];
          }
        })
        .catch((response) => {
          this.ordering = {} as Order;
          this.ordering.ordermenu = [];
        });
      }
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  isValidPhoneno(phoneno: string) {
    const phoneRegExp = /^\d{3}\d{3,4}\d{4}$/;
    const digits = phoneno.replace(/\D/g, '');
    return phoneRegExp.test(digits);
  }

  // 메뉴를 선택하면 먼저 로그인 상태를 확인하고
  // 로그인이 아니라면 로그인을 하도록 유도하고
  // 로그인 후에 마지막 주문 정보를 얻어서 상태를 확인한다.
  // 상태가 주문 완료되었다면 새로운 주문서를 만들어야 한다.
  // 주문번호는 마지막 주문번호 + 1

  orderMenu(menu: Menu, size: string) {

    this.isshow = false;

    // 로그인여부를 확인한다.
    if (this.authService.isLoggedIn() === false && this.nonmember === false ) {
      const answer = confirm('로그인 하시겠습니까?\n비회원 주문을 하시려면 "취소" 하신 후 비회원주문을 체크하세요.');
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

      if ( this.isValidPhoneno(this.phoneno) === false) {
        alert('전화번호에 숫자만 정확하게 입력하세요.');
        return;
      }

      sessionStorage.setItem('phoneno', this.phoneno);
      sessionStorage.setItem('password', this.password);

      let menu_name = menu.name;
      let menu_price = menu.price;
      if ( size !== '') {
        menu_name = menu_name + ' ' + size;
        for ( let i = 0 ; i < menu.premia.length; i++) {
          if (menu.premia[i].size === size) {
            menu_price = menu.premia[i].premium_price;
          }
        }
      }

      // 같은 메뉴를 계속 선택한 경우 메뉴의 수량을 증가시킨다.
      if (this.ordering.ordermenu.length > 0) {
        for (let i = 0; i < this.ordering.ordermenu.length ; i++ ) {
          if (this.ordering.ordermenu[i].name === menu_name) {
            this.ordering.ordermenu[i].number++;
            this.ordering.ordermenu[i].sum = this.ordering.ordermenu[i].number * this.ordering.ordermenu[i].price;
            this.ordersService.updateOrder(this.ordering._id, this.ordering)
              .then((saveordering) => {
                this.ordering = saveordering;
                if ( !this.ordering.ordermenu ) {
                  this.ordering.ordermenu = [];
                }
                this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify, nonmember: this.phoneno } });
              })
              .catch(response => null);
            return;
          }
        }
      }

      this.phoneno = this.phoneno.replace(/[^0-9]/g, ''); // 숫자만 추출

      const ordermenu: OrderMenu = {
        orderNo: 1,
        menuNo: menu.menuNo,
        classify: menu.classify,
        name: menu_name,
        price: menu_price,
        number: 1,
        sum: menu_price
      };

      if (this.ordering.ordermenu.length > 0) {
        // 주문중이다.
        this.ordering.ordermenu.push(ordermenu);
        this.ordersService.updateOrder(this.ordering._id, this.ordering)
        .then((saveordering) => {
          this.ordering = saveordering;
          if ( !this.ordering.ordermenu ) {
            this.ordering.ordermenu = [];
          }
          // alert('주문서에 저장하였습니다.');
          this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify, nonmember: this.phoneno } });
          // return;
        })
        .catch((response) => {
          alert('추가 주문 저장 오류: ' + response.message);
        });
      } else {
        // 주문중이 아니다. 주문서를 만들어야 한다. (비회원 주문)
        const order: Order = {
          storename: this.user.username,  // 가맹점
          shopname: this.user.storeName,
          username: '', // 회원
          phoneno: this.phoneno,
          password: this.password,
          type: 1,
          tableNo: 0,
          orderNo: 1,
          status: '선택',
          ordermenu: []
        };
        order.ordermenu.push(ordermenu);

        this.ordersService.saveOrder(order)
          .then((saveordering) => {
            this.ordering = saveordering;
            if ( !this.ordering.ordermenu ) {
              this.ordering.ordermenu = [];
            }
            // 정상적으로 주문이 저장되었다면 페이지를 다시 읽는다.
            this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify, nonmember: this.phoneno } });
            return;
          })
          .catch((response) => {
            // 주문 저장을 실패하면 현재 페이지에 남는다.
            alert('주문 저장 오류: ' + response.message);
          });
      }

    } else {
      // 회원 주문
      let menu_name = menu.name;
      let menu_price = menu.price;
      if ( size !== '') {
        menu_name = menu_name + ' ' + size;
        for ( let i = 0 ; i < menu.premia.length; i++) {
          if (menu.premia[i].size === size) {
            menu_price = menu.premia[i].premium_price;
          }
        }
      }
      // 선택한 메뉴가 이미 선택된 메뉴라면 수량과 금액만 변경하고 저장한다.
      if (this.ordering.ordermenu.length > 0) {
        for (let i = 0; i < this.ordering.ordermenu.length ; i++ ) {
          if (this.ordering.ordermenu[i].name === menu_name) {
            this.ordering.ordermenu[i].number++;
            this.ordering.ordermenu[i].sum = this.ordering.ordermenu[i].number * this.ordering.ordermenu[i].price;
            this.ordersService.updateOrder(this.ordering._id, this.ordering)
              .then((saveordering) => {
                this.ordering = saveordering;
                if ( !this.ordering.ordermenu ) {
                  this.ordering.ordermenu = [];
                }
                this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
              })
              .catch(response => null);
            return;
          }
        }
      }

      const ordermenu: OrderMenu = {
        orderNo: 1,
        menuNo: menu.menuNo,
        classify: menu.classify,
        name: menu_name,
        price: menu_price,
        number: 1,
        sum: menu_price
      };

      if (this.ordering.ordermenu.length > 0) {
        // 주문중인 주문서를 가져왔다.
        this.ordering.ordermenu.push(ordermenu);
        this.ordersService.updateOrder(this.ordering._id, this.ordering)
        .then((saveordering) => {
          this.ordering = saveordering;
          if ( !this.ordering.ordermenu ) {
            this.ordering.ordermenu = [];
          }
          // alert('주문서에 저장하였습니다.');
          this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
          // return;
        })
        .catch((response) => {
          alert('추가 주문 저장 오류: ' + response.message);
        });

      } else {
        // 주문중이 아니다. 주문서를 만들어야 한다.
        const order: Order = {
          storename: this.user.username,  // 가맹점
          shopname: this.user.storeName,
          username: this.authService.getCurrentUser().username,  // 회원이다.
          phoneno: '',
          password: '',
          type: 0,
          tableNo: 0,
          orderNo: 1,
          status: '선택',
          ordermenu: []
        };
        order.ordermenu.push(ordermenu);

        this.ordersService.saveOrder(order)
          .then((saveordering) => {
            this.ordering = saveordering;
            if ( !this.ordering.ordermenu ) {
              this.ordering.ordermenu = [];
            }
            // 정상적으로 주문이 저장되었다면 페이지를 다시 읽는다.
            this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
            return;
          })
          .catch((response) => {
            // 주문 저장을 실패하면 현재 페이지에 남는다.
            alert('주문 저장 오류: ' + response.message);
          });
      }
    }
  }

  addNumber(index: number) {
    this.isshow = false;
    // 주문 수량을 증가시킨다.
    // ordermenu.number++;
    // ordermenu.sum = ordermenu.price * ordermenu.number;
    // 주문메뉴 저장 데이터를 갱신한다.
    this.ordering.ordermenu[index].number++;
    this.ordering.ordermenu[index].sum = this.ordering.ordermenu[index].price * this.ordering.ordermenu[index].number;

    this.ordersService.updateOrder(this.ordering._id, this.ordering)
      .then((saveordering) => {
        this.ordering = saveordering;
        if ( !this.ordering.ordermenu ) {
          this.ordering.ordermenu = [];
        }
        this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
      })
      .catch(response => null);
  }

  subsNumber(index: number) {
    this.isshow = false;
    if ( this.ordering.ordermenu[index].number === 0) {
      return;
    }

    if ( this.ordering.ordermenu[index].number - 1 === 0) {
      const answer = confirm('주문메뉴 수량이 "0"이면 삭제합니다. 계속할까요?');
      if (answer) {
        // 수량이 '0'이면 삭제한다.
        this.ordering.ordermenu.splice(index, 1);
        this.ordersService.updateOrder(this.ordering._id, this.ordering)
          .then((saveordering) => {
            this.ordering = saveordering;
            if ( !this.ordering.ordermenu ) {
              this.ordering.ordermenu = [];
            }
            // alert('주문서에 저장하였습니다.');
            this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
            // return;
          })
          .catch((response) => {
            alert('추가 주문 저장 오류: ' + response.message);
          });
        }
    } else {
      // 주문메뉴 수량 감소 후 저장 데이터를 갱신한다.
      this.ordering.ordermenu[index].number--;
      this.ordering.ordermenu[index].sum = this.ordering.ordermenu[index].price * this.ordering.ordermenu[index].number;

      this.ordersService.updateOrder(this.ordering._id, this.ordering)
        .then((saveordering) => {
          this.ordering = saveordering;
          if ( !this.ordering.ordermenu ) {
            this.ordering.ordermenu = [];
          }
          this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
        })
        .catch(response => null);
    }
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

  submitOrder(order: Order) {
    this.isshow = false;
    if (!order.ordermenu || order.ordermenu.length === 0) {
      alert('주문메뉴를 선택하여 주세요.');
      return;
    }
    if ( order.tableNo === 0) {
      const answer = confirm('테이블 번호를 지정하지 않으면 예약처리합니다.\n테이블 번호를 지정하여 주세요.\n계속할까요?');
      if (!answer) {
        return;
      }
    }
    // 주문을 저장하자.
    order.status = '주문';
    this.ordersService.updateOrder(order._id, order)
    .then((saveordering) => {
      this.ordering = saveordering;
      if ( !this.ordering.ordermenu ) {
        this.ordering.ordermenu = [];
      }
      alert('주문하였습니다.');
      this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
      // return;
    })
    .catch((response) => {
      alert('주문을 하지 못했습니다. : ' + response.message);
    });
  }

  cancelOrder(order: Order) {
    this.isshow = false;
    const answer = confirm('주문을 취소하시겠습니까?');
    if (!answer) {
      return;
    }

    order.status = '고객취소';
    this.ordersService.updateOrder(order._id, order)
    .then((saveordering) => {
      this.ordering = saveordering;
      if ( !this.ordering.ordermenu ) {
        this.ordering.ordermenu = [];
      }
      alert('주문을 취소하였습니다.');
      this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
      // return;
    })
    .catch((response) => {
      alert('주문을 취소 하지 못했습니다. : ' + response.message);
    });
  }

  setTable(order: Order) {
    this.isshow = false;
    // 테이블 번호가 바뀐 상태이므로 수정 호출
    this.ordersService.updateOrder(order._id, order)
    .then((saveordering) => {
      this.ordering = saveordering;
        if ( !this.ordering.ordermenu ) {
          this.ordering.ordermenu = [];
        }
      this.router.navigate(['/stores', this.username], { queryParams: { classify: this.classify } });
    })
    .catch((response) => {
      alert('테이블 번호를 변경하지 못하였습니다. : ' + response.message);
    });
  }

  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }

  showOrder() {

    if ( this.isshow === false ) {
      this.isshow = true;

      // 오늘의 주문을 로드하자.
      const today = this.today.getFullYear() + '-' + this._to2digit(this.today.getMonth() + 1) + '-' + this._to2digit(this.today.getDate());

      if (this.authService.isLoggedIn()) {
        // 회원이다.
        const username = this.authService.getCurrentUser().username;
        this.ordersService.getMyTodayOrders(username, today)
        .then((orders) => {
          this.todayOrders = orders;
        })
        .catch((err) => null);
      } else {
        // 비회원이다.
        this.ordersService.getNonmemberTodayOrders(this.user.username, this.phoneno, today)
        .then((orders) => {
          // console.log(orders);
          this.todayOrders = orders;
        })
        .catch((err) => null);
      }
    } else {
      this.isshow = false;
    }
  }

  getImageName(image: string) {
    return `\assets\image\{image}.png`;
  }
}
