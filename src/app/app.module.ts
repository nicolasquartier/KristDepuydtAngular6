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

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SculptuurComponent,
    KeramiekComponent,
    ProjectenComponent,
    AboutComponent,
    ExpositiesComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LightboxModule,
    RouterModule.forRoot([
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
  providers: [FlickrServiceService, GlobalsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
