import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { MenuService } from './menu.service';
import { Menu } from './menu';
import { AuthService } from './auth.service';

@Injectable()
export class MenusResolve implements Resolve<Menu[]> {

  constructor( private menuService: MenuService, private authService: AuthService ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const username = this.authService.getCurrentUser().username;
    return this.menuService.index(username).catch(response => null);
  }
}
