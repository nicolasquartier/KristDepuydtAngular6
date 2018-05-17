import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  apiKey = '9ea2d6569a63be3a09b76b405b4a4631';
  userId = '153009594%40N02';
  pages = ['sculptuur', 'keramiek', 'projecten', 'over', 'exposities', 'contact'];

  constructor() {
  }
}
