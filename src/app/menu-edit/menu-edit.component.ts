import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Menu } from '../menu';
import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { MenuService } from '../menu.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css']
})
export class MenuEditComponent implements OnInit {

  menu: Menu;
  errorResponse: ApiResponse;
  form: FormGroup;

  formErrors = {
    'menuNo': '',
    'classify': '',
    'name': '',
    'price': ''
  };

  formErrorMessages = {
    'menuNo': {
      'required': '메뉴번호를 입력하세요.',
      'pattern': '숫자만 입력하세요.',
    },
    'classify': {
      'required': '메뉴분류 입력하세요.',
      'pattern': '2~20글자 입니다.',
    },
    'name': {
      'required': '메뉴이름을 입력하세요.',
      'pattern': '2~20글자 입니다.',
    },
    'price': {
      'required': '가격을 입력하세요.',
      'pattern': '숫자만 입력하세요.',
    },
  };

  buildForm(): void {
    this.form = this.formBuilder.group({
      menuNo: [this.menu.menuNo, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      classify: [this.menu.classify, [Validators.required, Validators.pattern(/^.{2,20}$/)]],
      name: [this.menu.name, [Validators.required, Validators.pattern(/^.{2,20}$/)]],
      price: [this.menu.price, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      description: [this.menu.description],
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });
  }

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
    private utilService: UtilService, private menuService: MenuService, public authService: AuthService) {
      this.menu = this.route.snapshot.data['menu'];
      this.buildForm();
  }

  ngOnInit() {
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if (this.form.valid) {
      const username = this.authService.getCurrentUser().username;
      this.menuService.update(username, this.menu.menuNo, this.form.value)
      .then(data => {
        this.router.navigate(['/', 'menus']);
      })
      .catch(response => {
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

  delete() {
    const answer = confirm('메뉴를 삭제하시겠습니까?');
    if (answer) {
      const username = this.authService.getCurrentUser().username;
      this.menuService.destroy(username, this.menu.menuNo)
      .then(data => {
        this.router.navigate(['/', 'menus']);
      })
      .catch(response => {
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

}
