import { Component, OnInit } from '@angular/core';
import {GlobalsService} from '../globals.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  activePage = '';
  isLoggedIn = false;

  constructor(private globals: GlobalsService,
              private auth: AuthService) { }

  ngOnInit() {
    this.activePage = this.globals.activePage;
    console.log('ap: ' + this.globals.activePage);
  }

  getLoggedInStatus() {
    if (this.auth.isLoggedIn) {
      return 'inline';
    } else {
      return 'none';
    }
  }
}
