import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { MenuService } from '../menu.service';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-menu-new',
  templateUrl: './menu-new.component.html',
  styleUrls: ['./menu-new.component.css']
})
export class MenuNewComponent implements OnInit {

  user: User;
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
      menuNo: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      name: ['', [Validators.required, Validators.pattern(/^.{2,20}$/)]],
      classify: ['', [Validators.required, Validators.pattern(/^.{2,20}$/)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      description: [''],
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });

  }

  constructor(private router: Router, private formBuilder: FormBuilder, private utilService: UtilService,
    private menuService: MenuService, private authService: AuthService) {
      this.buildForm();
   }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if (this.form.valid) {
      const username = this.authService.getCurrentUser().username;
      this.menuService.create(username, this.form.value)
      .then(data => {
        this.router.navigate(['/menus']);
      })
      .catch(response => {
        // alert(response);
        this.errorResponse = response;
        alert(this.errorResponse.message);
        // this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }
}
