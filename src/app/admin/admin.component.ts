import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FlickrServiceService} from '../flickr-service.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  message = 'Loading...';
  oauth_token = '';
  oauth_verifier = '';

  constructor(private user: UserService,
              private route: ActivatedRoute,
              private flickrService: FlickrServiceService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.oauth_token = params['oauth_token'];
      this.oauth_verifier = params['oauth_verifier'];
    });

    this.flickrService.getOAuthAccessToken(this.oauth_token, this.oauth_verifier);

    this.user.getSomeData()
      .subscribe(data => {
        this.message = data.message;
      });
  }

}
