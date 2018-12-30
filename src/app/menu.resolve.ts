import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MenuService } from './menu.service';
import { AuthService } from './auth.service';
import { Menu } from './menu';

@Injectable()
export class MenuResolve implements Resolve<Menu> {

  constructor(
    private menuService: MenuService,
    private authService: AuthService,
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const username = this.authService.getCurrentUser().username;
    return this.menuService.show(username, route.params['menuNo']);
  }
}
