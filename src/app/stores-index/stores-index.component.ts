import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

import { User } from '../user';

@Component({
  selector: 'app-stores-index',
  templateUrl: './stores-index.component.html',
  styleUrls: ['./stores-index.component.css']
})
export class StoresIndexComponent implements OnInit {

  users: User[];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getStores().then((users) => this.users = users);
  }

}
