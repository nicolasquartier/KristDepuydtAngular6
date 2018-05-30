import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {LightboxModule} from 'ngx-lightbox';
import {RouterModule} from '@angular/router';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { SculptuurComponent } from './sculptuur/sculptuur.component';
import {FlickrServiceService} from './flickr-service.service';
import {GlobalsService} from './globals.service';
import { KeramiekComponent } from './keramiek/keramiek.component';
import { ProjectenComponent } from './projecten/projecten.component';
import { AboutComponent } from './about/about.component';
import { ExpositiesComponent } from './exposities/exposities.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import {AuthGuard} from './auth.guard';
import {UserService} from './user.service';

@NgModule({
  declarations: [
    AppComponent,
    SculptuurComponent,
    KeramiekComponent,
    ProjectenComponent,
    AboutComponent,
    ExpositiesComponent,
    ContactComponent,
    MenuComponent,
    LoginComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LightboxModule,
    RouterModule.forRoot([
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'projecten',
        component: ProjectenComponent
      },
      {
        path: 'exposities',
        component: ExpositiesComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'keramiek',
        component: KeramiekComponent
      },
      {
        path: 'sculptuur',
        component: SculptuurComponent
      },
      {
        path: '',
        component: SculptuurComponent
      }
    ])
  ],
  providers: [FlickrServiceService, GlobalsService, AuthGuard, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
