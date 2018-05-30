import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  loginUser(event) {
    event.preventDefault();
    const target = event.target
    const username = target.querySelector('#username').value;
    const password = target.querySelector('#password').value;

    console.log(username, password);
    this.authService.getUserDetails(username, password)
      .subscribe(data => {
        if (data.success) {
          console.log(data.success);
        }
      });
  }

}
