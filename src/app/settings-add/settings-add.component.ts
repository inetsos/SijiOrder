import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiResponse } from '../api-response';

import { UtilService } from '../util.service';
import { SettingService } from '../setting.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-settings-add',
  templateUrl: './settings-add.component.html',
  styleUrls: ['./settings-add.component.css']
})
export class SettingsAddComponent implements OnInit {

  errorResponse: ApiResponse;
  form: FormGroup;

  formErrors = {
    'type': '',
    'content': ''
  };

  formErrorMessages = {
    'type': {
      'required': '설정종류를 입력하세요.',
      'pattern': '2~20글자 입니다.',
    },
    'content': {
      'required': '설정내용을 입력하세요.',
      'pattern': '2~50글자 입니다.',
    }
  };

  buildForm(): void {
    this.form = this.formBuilder.group({
      type: ['', [Validators.required, Validators.pattern(/^.{2,20}$/)]],
      content: ['', [Validators.required, Validators.pattern(/^.{2,50}$/)]],
      username: [''],
    });

    this.form.valueChanges.subscribe(data => {
      this.utilService.updateFormErrors(this.form, this.formErrors, this.formErrorMessages);
    });

  }

  constructor(private router: Router, private formBuilder: FormBuilder, private utilService: UtilService,
    private settingService: SettingService, private authService: AuthService) {

    this.buildForm();

    this.form.setValue({
      type: null,
      content: null,
      username: authService.getCurrentUser().username
    });

  }

  ngOnInit() {
  }

  submit() {
    this.utilService.makeFormDirtyAndUpdateErrors(this.form, this.formErrors, this.formErrorMessages);
    if (this.form.valid) {
      this.settingService.create(this.form.value)
      .then(data => {
        this.router.navigate(['/settings']);
      })
      .catch(response => {
        this.errorResponse = response;
        this.utilService.handleFormSubmitError(this.errorResponse, this.form, this.formErrors);
      });
    }
  }
}
