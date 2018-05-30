import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {v} from '@angular/core/src/render3';

interface MyData {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInStatus = false;

  constructor(private http: HttpClient) { }

  setLoggedIn(value: boolean) {
    console.log('set logged in status to ' + value);
    this.loggedInStatus = value;
  }

  get isLoggedIn() {
    return this.loggedInStatus;
  }

  getUserDetails(username: any, password: any) {
    return this.http.post<MyData>('/api/auth.php', {username, password});
  }
}
