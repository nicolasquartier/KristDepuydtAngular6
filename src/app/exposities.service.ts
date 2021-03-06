import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IAlbum} from 'ngx-lightbox';
import {e} from '@angular/core/src/render3';

interface Exposities {
  exposities: Array<Expositie>;
  length: number;
}

interface Expositie {
  year: string;
  name: string;
  description: string;
  hasPhotos: boolean;
  insdate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExpositiesService {

  constructor(private http: HttpClient) { }

  getExposities() {
    return this.http.post<Exposities>('/api/getExpositiesFromDB.php', {});
  }

  editExpositie(id: number, title: string, location: string) {
    return this.http.post('/api/editExpositie.php', {id: id, title: title, location: location});
  }

  deleteExpositie(id: number) {
    return this.http.post<string>('/api/deleteExpositie.php', {id: id});
  }

  insertExposities(year: string, title: string, location: string) {
    return this.http.post<string>('/api/insertNewExpositie.php', {year: year, title: title, location: location});

  }
}
