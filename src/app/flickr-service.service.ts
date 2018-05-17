import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GlobalsService} from './globals.service';


interface Response {
  photosets: PhotoSets;
}

interface PhotoSets {
  page: number;
  pages: number;
  photoset: PhotoSet[];

}

interface PhotoSet {
  id: string;
  description: String;
  title: String;
}

interface String {
  _content: string;
}


@Injectable({
  providedIn: 'root'
})
export class FlickrServiceService {

  constructor(private http: HttpClient, private globals: GlobalsService) {
    console.log('constructor flickrService');
  }

  getPhotoSets() {
    return this.http.get<Response>('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=' + this.globals.apiKey + '&user_id=' + this.globals.userId + '&format=json&nojsoncallback=1');
  }
}
