import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Menu } from '../menu';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-menu-index',
  templateUrl: './menu-index.component.html',
  styleUrls: ['./menu-index.component.css']
})
export class MenuIndexComponent implements OnInit {

  menus: Menu[];
  user: User;

  constructor(private route: ActivatedRoute, private authService: AuthService,
    private menuService: MenuService, private router: Router) {
    this.menus = this.route.snapshot.data['menus'];
   }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  changeImageStatus(menu: Menu) {
    // console.log(menu);
    this.menuService.update(this.user.username, menu.menuNo, menu)
      .then(data => {
        // console.log(data);
        this.router.navigate(['/', 'menus']);
      })
      .catch(response => {
        console.log(response);
        // this.errorResponse = response;
      });
    }
}
