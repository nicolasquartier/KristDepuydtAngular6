import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {
  apiKey = '78cfdf349b9016acd631feba7e66a701';//nicolasquartier@msn.com
  userId = '153009594%40N02';
  // apiKey = '6337acd481870286e3d1087590ae665f';//rudiquartier@live.be@
  // userId = '153009594%40N02';
  pages = ['sculptuur', 'keramiek', 'projecten', 'over', 'exposities', 'contact'];
  activePage = '';
  requestTokenBaseUrl = 'https%3A%2F%2Fwww.flickr.com%2Fservices%2Foauth%2Frequest_token';
  accessTokenBaseUrl = 'https%3A%2F%2Fwww.flickr.com%2Fservices%2Foauth%2Faccess_token';
  basicRestRequestUrl = 'https%3A%2F%2Fapi.flickr.com%2Fservices%2Frest';
  CREATE_PHOTOSET_METHOD = 'flickr.photosets.create';
  EDIT_PHOTOSET_METHOD = 'flickr.photosets.editMeta';
  ADD_PHOTO_TO_PHOTOSET_METHOD = 'flickr.photosets.addPhoto';
  uploadRestUrl = 'https%3A%2F%2Fapi.flickr.com%2Fservices%2Fupload';
  hmacSigningSecret = '';
  oauthToken = '';
}
