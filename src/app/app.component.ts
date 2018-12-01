import {Component, HostListener} from '@angular/core';
import {Router} from '@angular/router';

export enum KEY_CODE {
  CTRL = 17,
  ALT = 18,
  L = 76,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  ctrlPressed = false;
  altPressed = false;
  lPressed = false;

  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
      this.router.navigate(['sculptuur']); // or redirect to default route
    };
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.CTRL) {
      this.ctrlPressed = true;
    }
    if (event.keyCode === KEY_CODE.ALT) {
      this.altPressed = true;
    }
    if (event.keyCode === KEY_CODE.L) {
      this.lPressed = true;
    }
    if (this.ctrlPressed === true &&
      this.altPressed === true &&
      this.lPressed === true) {
      this.router.navigate(['login']);
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode === KEY_CODE.CTRL) {
      this.ctrlPressed = false;
    }
    if (event.keyCode === KEY_CODE.ALT) {
      this.altPressed = false;
    }
    if (event.keyCode === KEY_CODE.L) {
      this.lPressed = false;
    }
  }
}
