import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {

  errorResponse: ApiResponse;
  form: FormGroup;

  formErrors = {
    'username': '',
    'name': '',
    'phone': '',
    'email': '',
    'password': '',
    'confirmPassword': '',
  };
  formErrorMessages = {
    'username': {
      'required': '사용자 이름을 입력하세요.',
      'pattern': '8~16자의 영문 숫자입니다.',
    },
    'phone': {
      'required': '휴대폰번호를 입력하세요.',
      'pattern': '전화번호 형식("-" 포함)에 맞춰 입력하세요.',
    },
    'email': {
      'pattern': '메일주소가 아닙니다.',
    },
    'password': {
      'required': '비밀번호를 입력하세요.',
      'pattern': '8자의 영문 숫자 특수문자 조합입니다.',
    },
    'confirmPassword': {
      'required': '비밀번호을 한번 더 입력하세요.',
      'match': '입력 비밀번호가 확인과 일치하지 않습니다.',
    },
  };

  buildForm(): void {
    this.form = this.formBuilder.group({
      group: ['사용자'],
      username: ['', [Validators.required, Validators.pattern(/^.{8,16}$/)]],
      name: [''],
      storeName: [''],
      phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3,4}-\d{4}$/)]],
      email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: this.customValidation,
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });
  }

  customValidation(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    if (password.dirty && confirmPassword.dirty && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({'match': true});
    }
  }

  constructor(private router: Router, private formBuilder: FormBuilder, private utilService: UtilService,
    private userService: UserService ) {
      this.buildForm();
     }

  ngOnInit() {
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if (this.form.valid) {
      this.userService.create(this.form.value)
      .then(data => {
        this.router.navigate(['/']);
      })
      .catch(response => {
        console.log(response);
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

}
