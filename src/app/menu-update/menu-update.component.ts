import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { UtilService } from '../util.service';
import { MenuService } from '../menu.service';
import { AuthService } from '../auth.service';

import { Menu } from '../menu';
import { ApiResponse } from '../api-response';
import { User } from '../user';

@Component({
  selector: 'app-menu-update',
  templateUrl: './menu-update.component.html',
  styleUrls: ['./menu-update.component.css']
})
export class MenuUpdateComponent implements OnInit {

  user: User;
  menu: Menu;
  errorResponse: ApiResponse;
  public myForm: FormGroup;

  constructor(private _fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private menuService: MenuService, public authService: AuthService) {

   }

  ngOnInit() {
    this.menu = this.route.snapshot.data['menu'];
    this.user = this.authService.getCurrentUser();

    this.myForm = this._fb.group({
      menuNo: [this.menu.menuNo, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      classify: [this.menu.classify, [Validators.required, Validators.pattern(/^.{2,20}$/)]],
      name: [this.menu.name, [Validators.required, Validators.pattern(/^.{2,20}$/)]],
      price: [this.menu.price, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      description: [this.menu.description],
      premia: this._fb.array([])
    });

    for (let i = 0; i < this.menu.premia.length; i++) {
      const control = <FormArray>this.myForm.controls['premia'];
      control.push(this._fb.group({
        size: [this.menu.premia[i].size],
        premium_price: [this.menu.premia[i].premium_price]
      }));
    }
  }

  initPremium() {
    // initialize our address
    return this._fb.group({
        size: '',
        premium_price: ''
    });
  }

  addPremium() {
    // add address to the list
    const control = <FormArray>this.myForm.controls['premia'];
    control.push(this.initPremium());
  }

  removePremium(i: number) {
    // remove address from the list
    const control = <FormArray>this.myForm.controls['premia'];
    control.removeAt(i);
  }

  submit(menu: Menu) {

    this.menuService.update(this.user.username, this.menu.menuNo, menu)
    .then(data => {
      this.router.navigate(['/', 'menus']);
    })
    .catch(response => {
      this.errorResponse = response;
    });
  }

  delete() {
    const answer = confirm('메뉴를 삭제하시겠습니까?');
    if (answer) {
      this.menuService.destroy(this.user.username, this.menu.menuNo)
      .then(data => {
        this.router.navigate(['/', 'menus']);
      })
      .catch(response => {
        this.errorResponse = response;
      });
    }
  }

}
