import { Component, OnInit } from '@angular/core';
import {GlobalsService} from '../globals.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  activePage = '';

  constructor(private globals: GlobalsService) { }

  ngOnInit() {
    this.activePage = this.globals.activePage;
    console.log('ap: ' + this.globals.activePage);
  }
}
