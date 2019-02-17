import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Menu } from '../menu';
import { AuthService } from '../auth.service';
import { User } from '../user';

@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-add.component.html',
  styleUrls: ['./menu-add.component.css']
})
export class MenuAddComponent implements OnInit {

  user: User;
  public myForm: FormGroup;

  constructor(private _fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.myForm = this._fb.group({
      menuNo: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      classify: ['', [Validators.required, Validators.pattern(/^.{2,20}$/)]],
      name: ['', [Validators.required, Validators.pattern(/^.{2,20}$/)]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      description: [''],
      premia: this._fb.array([
        this.initPremium()
      ])
    });
  }

  initPremium() {
    // initialize our address
    return this._fb.group({
        size: '',
        price: ''
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

  save(model: Menu) {
    // call API to save customer
    console.log(model);
  }

}
