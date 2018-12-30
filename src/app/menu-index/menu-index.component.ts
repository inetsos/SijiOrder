import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Menu } from '../menu';

@Component({
  selector: 'app-menu-index',
  templateUrl: './menu-index.component.html',
  styleUrls: ['./menu-index.component.css']
})
export class MenuIndexComponent implements OnInit {

  menus: Menu[];

  constructor(private route: ActivatedRoute) {
    this.menus = this.route.snapshot.data['menus'];
   }

  ngOnInit() {
  }

}
