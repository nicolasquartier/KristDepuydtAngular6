import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {FlickrServiceService} from '../flickr-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private router: Router,
              private flickrService: FlickrServiceService) {
  }

  ngOnInit() {
  }

  loginUser(event) {
    event.preventDefault();
    const target = event.target;
    const username = target.querySelector('#username').value;
    const password = target.querySelector('#password').value;

    this.authService.getUserDetails(username, password)
      .subscribe(data => {
        if (data.success) {
          this.authService.setLoggedIn(true);

          const responseOauth = this.flickrService.getOAuthRequestToken();
          console.log('resp from flickr request token: ');
          console.log(this.flickrService.requesToken);
        }
      });
  }
}
