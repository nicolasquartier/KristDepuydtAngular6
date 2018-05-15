import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalsService} from './globals.service';

@Injectable({
  providedIn: 'root'
})
export class FlickrServiceService {

  constructor(private http: HttpClient, private globals: GlobalsService) {
    console.log('constructor flickrService');
  }

  getPhotoSets() {
    return this.http.get('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=' + this.globals.apiKey + '&user_id=' + this.globals.userId + '&format=json&nojsoncallback=1')
      .subscribe(value => {
          console.log('value:');
          console.log(value);
          return value;
        },
        error1 => {
          console.log('error:');
          console.log(error1);
          return error1;
        }, () => {
          console.log('complete');
        });
  }
}
