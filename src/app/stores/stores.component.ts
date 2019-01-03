import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { MenuService } from '../menu.service';
import { UserService } from '../user.service';
import { SettingService } from '../setting.service';
import { Menu } from '../menu';
import { Setting } from '../setting';
import { User } from '../user';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {

  username = '';
  user: User;
  menus: Menu[];
  settings: Setting[];
  classifies: string[];
    // promiseMenus: Promise<Menu[]>;
  classify = '전체';

  constructor(private route: ActivatedRoute, private menuService: MenuService, private userService: UserService,
    private settingService: SettingService) {
    this.route.params.subscribe(params => {
      this.username = params['username'];
      this.userService.show(this.username).then(user => this.user = user);
      // console.log(this.user.storeName);
    });
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.classify) {
          this.classify = params.classify;
        } else {
          this.classify = '전체';
        }

        this.menuService.index(this.username).then(menus => this.menus = menus);
        this.settingService.getSetting(this.username, '메뉴분류순서').then((settings) => {
          // this.settings = settings;
          const tmp = settings[0].content.replace(/ /gi, '');
          this.classifies = tmp.split(',');
        });

        // this.promiseMenus = this.menuService.getMenus(this.username);
      });

      // this.menuService.getMenus(this.username)
      //   .then(menus => {
      //     console.log(menus);
      //     this.menus = menus;
      //   })
      //   .catch(response => null);
      // this.groups;
  }

}
