import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  apiKey = '6337acd481870286e3d1087590ae665f';
  userId = '153009594%40N02';
  pages = ['sculptuur', 'keramiek', 'projecten', 'over', 'exposities', 'contact'];
  activePage = '';
  requestTokenBaseUrl = 'https%3A%2F%2Fwww.flickr.com%2Fservices%2Foauth%2Frequest_token';
  accessTokenBaseUrl = 'https%3A%2F%2Fwww.flickr.com%2Fservices%2Foauth%2Faccess_token';
  hmacSigningSecret = '';
  oauthToken = '';
}
