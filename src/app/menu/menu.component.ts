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
  showAdmin = '';

  constructor(private globals: GlobalsService,
              private auth: AuthService) { }

  ngOnInit() {
    this.activePage = this.globals.activePage;
    this.showAdmin = this.auth.isLoggedIn ? 'inline' : 'none';
    console.log('showadmin: ' + this.showAdmin);
  }

  getLoggedInStatus() {
    this.showAdmin = this.auth.isLoggedIn ? 'inline' : 'none';
    if (this.auth.isLoggedIn) {
      return 'inline';
    } else {
      return 'none';
    }
  }
}
