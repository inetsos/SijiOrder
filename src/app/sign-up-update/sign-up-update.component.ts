import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { User } from '../user';
import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

import { Address } from '../jusos';

@Component({
  selector: 'app-sign-up-update',
  templateUrl: './sign-up-update.component.html',
  styleUrls: ['./sign-up-update.component.css']
})
export class SignUpUpdateComponent implements OnInit {

  user: User;
  errorResponse: ApiResponse;
  form: FormGroup;

  addresses: Array<Address> = new Array<Address>();

  keyword = '';
  result_view = false;

  formErrors = {
    'currentPassword': '',
    'username': '',
<<<<<<< HEAD
=======
    'storename': '',
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
    'phone': '',
    'email': '',
    'newPassword': '',
    'confirmPassword': '',
  };
  formErrorMessages = {
    'username': {
      'required': '회원아이디를 입력하세요.',
<<<<<<< HEAD
      'pattern': '8~16자의 영문 숫자 조합입니다.',
=======
      'pattern': '6~16자의 영문 숫자 조합입니다.',
    },
    'storename': {
      'required': '상호를 입력하세요.',
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
    },
    'currentPassword': {
      'required': '현재 비밀번호를 입력하세요.',
    },
    'phone': {
      'pattern': '전화번호 형식("-"포함)으로 입력하세요.',
    },
    'email': {
      'pattern': '메일주소가 아닙니다.',
    },
    'newPassword': {
      'pattern': '8자의 영문 숫자 특수문자 조합입니다.',
    },
    'confirmPassword': {
      'match': '비밀번호와 확인이 일치하지 않습니다.',
    },
  };

  buildForm(): void {
    this.form = this.formBuilder.group({
      currentPassword: ['', [Validators.required]],
<<<<<<< HEAD
      username: [this.user.username, [Validators.required, Validators.pattern(/^.{8,16}$/)]],
      name: [this.user.name],
      storeName: [this.user.storeName],
=======
      username: [this.user.username, [Validators.required, Validators.pattern(/^.{6,16}$/)]],
      name: [this.user.name],
      storeName: [this.user.storeName, [Validators.required]],
>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
      phone: [this.user.phone, [Validators.required, Validators.pattern(/^\d{3}-\d{3,4}-\d{4}$/)]],
      email: [this.user.email, [Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      roadAddr: [this.user.roadAddr],
      jibunAddr: [this.user.jibunAddr],
      detailAddr: [this.user.detailAddr],
      newPassword: ['', [Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?.&]{8,}$/)]],
      confirmPassword: [''],
    }, {
      validator: this.customValidation,
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });
  }

  customValidation(group: FormGroup) {

    const password = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');

    if (password.dirty && confirmPassword.dirty && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({'match': true});
    }

  }

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
    private utilService: UtilService, private userService: UserService, public authService: AuthService) {
    this.user = this.route.snapshot.data['user'];
    this.buildForm();
  }

  ngOnInit() {
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if (this.form.valid) {
      this.userService.update(this.user.username, this.form.value)
      .then(data => {
        this.router.navigate(['/']);  // , 'users', this.user.username]);
      })
      .catch(response => {
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }

  delete() {
    const answer = confirm('계정을 삭제하시겠습니까?');
    if (answer) {
      this.userService.destroy(this.user.username)
      .then(data => {
        this.authService.logout();
      })
      .catch(response => {
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
<<<<<<< HEAD
=======

>>>>>>> 3d03b9581c0a340111d9fb78398d3497725e8dab
}
