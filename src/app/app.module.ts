import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LightboxModule} from 'ngx-lightbox';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { SculptuurComponent } from './sculptuur/sculptuur.component';
import {FlickrServiceService} from './flickr-service.service';
import {GlobalsService} from './globals.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SculptuurComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LightboxModule
  ],
  providers: [FlickrServiceService, GlobalsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
