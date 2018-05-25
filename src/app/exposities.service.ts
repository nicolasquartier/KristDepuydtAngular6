import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IAlbum} from 'ngx-lightbox';

interface Exposities {
  exposities: Array<Expositie>;
  length: number;
}

interface Expositie {
  year: string;
  name: string;
  description: string;
  hasPhotos: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExpositiesService {

  constructor(private http: HttpClient) { }

  getExposities() {
    return this.http.get<Exposities>('../assets/data/exposities.json');
  }
}
