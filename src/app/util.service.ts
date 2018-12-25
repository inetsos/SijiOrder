import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ApiResponse } from './api-response';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public checkSuccess(response: any): Promise<any> {
    if (response.success) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  }

  public handleApiError(error: any): Promise<any> {
    if (!environment.production) {
      console.error('An error occurred', error);
    }
    return Promise.reject(error);
  }

  public updateFormErrors(form: FormGroup, formErrors: any, formErrorMessages: any) {
    if (!form) { return; }

    for ( const field in formErrors ) {
      if (formErrors.hasOwnProperty(field)) {
        formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = formErrorMessages[field];
          if (messages) {
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
      }
    }
  }

  public makeAllFormFieldsDirty(form: FormGroup) {
    if (!form) { return; }

    for (const field in form.controls) {
      if (form.controls.hasOwnProperty(field)) {
        const control = form.get(field);
        if (control) {
          control.markAsDirty();
        }
      }
    }
  }

  public makeFormDirtyAndUpdateErrors(form: FormGroup, formErrors: any, formErrorMessages: any) {
    this.makeAllFormFieldsDirty(form);
    this.updateFormErrors(form, formErrors, formErrorMessages);
  }

  public handleFormSubmitError(response: ApiResponse, form: FormGroup, formErrors: any): void {
    if (response.errors) {
      for (const  field in formErrors) {
        if (formErrors.hasOwnProperty(field)) {
          // const control = form.get(field);
          if (response.errors[field] && response.errors[field].message) {
            formErrors[field] += response.errors[field].message;
          }
        }
      }
      if (response.errors.unhandled) {
          response.message += response.errors.unhandled;
      }
    }
  }

  public get2digits (num) {
    return ('0' + num).slice(-2);
  }

  public getDate() {
    const mydate = new Date();
    return mydate.getFullYear() + '-' + this.get2digits(mydate.getMonth() + 1) + '-' + this.get2digits(mydate.getDate());
  }

  public getTime() {
    const mydate = new Date();
    return this.get2digits(mydate.getHours()) + ':' + this.get2digits(mydate.getMinutes() + 1) + ':' + this.get2digits(mydate.getSeconds());
  }

  public getDateTime() {
    const mydate = new Date();
    return mydate.getFullYear() + '-' + this.get2digits(mydate.getMonth() + 1) + '-' + this.get2digits(mydate.getDate()) + ' '
      + this.get2digits(mydate.getHours()) + ':' + this.get2digits(mydate.getMinutes() + 1) + ':' + this.get2digits(mydate.getSeconds());
  }

  public getDateTimeStr() {
    const mydate = new Date();
    return mydate.getFullYear() +  this.get2digits(mydate.getMonth() + 1) + this.get2digits(mydate.getDate())
              + this.get2digits(mydate.getHours()) + this.get2digits(mydate.getMinutes())  + this.get2digits(mydate.getSeconds());
  }

}
