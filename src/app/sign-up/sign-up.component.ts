import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { UserService } from '../user.service';

import { Address } from '../jusos';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  errorResponse: ApiResponse;
  form: FormGroup;

  addresses: Array<Address> = new Array<Address>();

  keyword = '';
  result_view = false;

  formErrors = {
    'username': '',
    'name': '',
<<<<<<< HEAD
=======
    'storename': '',
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
    'phone': '',
    'email': '',
    'password': '',
    'confirmPassword': '',
  };
  formErrorMessages = {
    'username': {
      'required': '회원아이디를 입력하세요.',
<<<<<<< HEAD
      'pattern': '8~16자의 영문 숫자입니다.',
=======
      'pattern': '6~16자의 영문 숫자입니다.',
    },
    'storename': {
      'required': '상호를 입력하세요.',
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
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
<<<<<<< HEAD
      group: ['회원'],
      username: ['', [Validators.required, Validators.pattern(/^.{8,16}$/)]],
      name: [''],
      storeName: [''],
=======
      group: ['가맹점'],
      username: ['', [Validators.required, Validators.pattern(/^.{6,16}$/)]],
      name: [''],
      storeName: ['', [Validators.required]],
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
      phone: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{3,4}-\d{4}$/)]],
      email: ['', [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      roadAddr: [''],
      jibunAddr: [''],
      detailAddr: [''],
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
<<<<<<< HEAD
    // this.userService.getAddress('사월동 500').
    //   then((juso) => {
    //     console.log(juso);
    //   });
=======
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
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

  queryAddr() {
    if (this.keyword === '') {
      return;
    }
    this.addresses = [];
    this.userService.getAddress(this.keyword)
      .then((juso) => {
        console.log(juso.results.juso.length, Number(juso.results.common.totalCount));
        // 100개까지만 돌려준다. totalCount까지 돌려주는 것이 아니다.
          for ( let i = 0 ; i < juso.results.juso.length /*Number(juso.results.common.totalCount)*/ ; i++) {
            const addr = {} as Address;
            addr.roadAddr = juso.results.juso[i].roadAddr;
            addr.jibunAddr = juso.results.juso[i].jibunAddr;

            this.addresses.push(addr);
          }

          if (this.addresses.length > 0 ) {
            this.result_view = true;
          }

        console.log(this.addresses);

    });
  }

  setAddr(addr: Address) {
    this.form.get('roadAddr').setValue(addr.roadAddr);
    this.form.get('jibunAddr').setValue(addr.jibunAddr);

    this.addresses = [];
    this.result_view = false;
  }
}
