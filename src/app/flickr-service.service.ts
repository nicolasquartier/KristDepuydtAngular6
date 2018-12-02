import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GlobalsService} from './globals.service';
import * as Rx from 'rxjs';
import {timer} from 'rxjs';
import {delayWhen, map, retryWhen, tap} from 'rxjs/operators';

interface Response {
  photosets: PhotoSets;
}

interface PhotoSets {
  page: number;
  pages: number;
  photoset: PhotoSet[];
  length: number;

}

interface PhotoSet {
  id: string;
  description: String;
  title: String;
}

interface String {
  _content: string;
}

interface PhotoSetByIds {
  photoset: PhotoSetById;
}

interface PhotoSetById {
  id: string;
  owner: string;
  ownername: string;
  page: number;
  pages: number;
  per_page: number;
  perpage: number;
  photo: Photo[];
  primary: string;
  title: string;
  total: string;
}

interface Photo {
  length: number;
  farm: number;
  id: string;
  isfamily: number;
  isfriend: number;
  ispramy: string;
  ispublic: number;
  secret: string;
  server: string;
  title: string;
}

interface HmacSignResult {
  result: string;
}

interface EncodedUrlResult {
  encodedUrl: string;
}

interface ProxyResult {
  result: string;
}


@Injectable({
  providedIn: 'root'
})
export class FlickrServiceService {
  photoSets = [];
  nonce = '';
  timestamp = '';
  encodedUrl: string;
  hmacSignResponse: string;
  mynewnonce = 0;
  errorRequesToken = false;
  requesToken: any;
  errorAccessToken = false;

  getNonceObservable = Rx.Observable.create((observer) => {
    this.mynewnonce = Math.random();
    observer.next(this.mynewnonce);
    observer.complete();
  });

  constructor(private http: HttpClient,
              private globals: GlobalsService) {
    console.log('this is the requestOauthSecret: ');
    this.globals.hmacSigningSecret = localStorage.getItem('hmacSigningSecret');
    console.log(this.globals.hmacSigningSecret);
  }

  getPhotoSets() {
    return this.http.get<Response>('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=' + this.globals.apiKey + '&user_id=' + this.globals.userId + '&format=json&nojsoncallback=1');
  }

  getPhotos(photosetId: any) {
    return this.http.get<PhotoSetByIds>('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + this.globals.apiKey + '&photoset_id=' + photosetId + '&user_id=' + this.globals.userId + '&format=json&nojsoncallback=1');
  }

  getBaseStringForRequestToken() {
    this.getNonceObservable.subscribe();
    this.timestamp = new Date().getTime().toString();
    return 'oauth_callback=http%3A%2F%2Flocalhost%3A4200%2Fadmin' +
      '&oauth_consumer_key=' + this.globals.apiKey +
      '&oauth_nonce=' + this.mynewnonce +
      '&oauth_signature_method=HMAC-SHA1' +
      '&oauth_timestamp=' + this.timestamp +
      '&oauth_version=1.0';
  }

  getBaseStringForAccessToken(oauthToken: string, oauthVerifier: string) {
    this.getNonceObservable.subscribe();
    this.timestamp = new Date().getTime().toString();
    return 'oauth_consumer_key=' + this.globals.apiKey +
      '&oauth_nonce=' + this.mynewnonce +
      '&oauth_signature_method=HMAC-SHA1' +
      '&oauth_timestamp=' + this.timestamp +
      '&oauth_token=' + oauthToken +
      '&oauth_verifier=' + oauthVerifier +
      '&oauth_version=1.0';
  }

  getEncodedUrl(url: string) {
    return this.http.post<EncodedUrlResult>('/api/urlencode.php', {url})
      .pipe(map(response => {
        if (response.encodedUrl === undefined || response.encodedUrl === null) {
          throw response;
        }
        return response;
      }), retryWhen(errors => {
        return errors.pipe(delayWhen(() => timer(100)));
      }));
  }

  getHmacSign(encodedRequestTokenUrl: string, secret?: string) {
    console.log('secret used to hmac-sign request:');
    console.log(secret);
    return this.http.post<HmacSignResult>('/api/hmacsign.php', {encodedRequestTokenUrl, secret})
      .pipe(map(response => {
          if (response.result === undefined || response.result === null) {
            throw response;
          }
          return response;
        }),
        retryWhen(errors => {
          return errors.pipe(delayWhen(() => timer(100)));
        }));
  }

  getProxyResult(url: string, options: { headers?: HttpHeaders }) {
    return this.http.post<ProxyResult>('/api/proxy.php', {url}, options);
  }

  getOAuthRequestToken() {
    this.errorRequesToken = false;
    const baseUrl = this.getBaseStringForRequestToken();
    return this.getEncodedUrl(baseUrl)
      .pipe(map(value => {
          if (this.errorRequesToken === true) {
            throw value;
          }
          return value;
        }),
        retryWhen(errors => {
          return errors.pipe(
            tap(errorVal => {
              console.log('error:   ');
              console.log(errorVal);
            }),
            delayWhen(() => timer(5000))
          );
        })
      )
      .pipe(map(requestToken => {
        return requestToken;
      }))
      .subscribe(tmpEncodedUrl => {
        this.encodedUrl = 'GET&' + this.globals.requestTokenBaseUrl + '&' + tmpEncodedUrl.encodedUrl;
        return this.getHmacSign(this.encodedUrl)
          .subscribe(hmacSignResponse => {
            this.hmacSignResponse = hmacSignResponse.result;
            let url = 'https://www.flickr.com/services/oauth/request_token' +
              '?oauth_nonce=' + this.mynewnonce +
              '&oauth_timestamp=' + this.timestamp +
              '&oauth_consumer_key=' + this.globals.apiKey +
              '&oauth_signature_method=HMAC-SHA1' +
              '&oauth_version=1.0' +
              '&oauth_signature=' + this.hmacSignResponse +
              '&oauth_callback=http%3A%2F%2Flocalhost%3A4200%2Fadmin';

            let options = {
              headers: new HttpHeaders({
                'Accept': 'application/json',
              })
              // ,observe: 'response'
            };

            this.getProxyResult(url, options)
              .subscribe(requesToken => {
                this.errorRequesToken = false;
                console.log('requesToken.result');
                console.log(requesToken.result);

                this.requesToken = requesToken.result;
                const oauth_token = this.requesToken.substring(requesToken.result.indexOf('oauth_token='), requesToken.result.indexOf('&oauth_token_secret='));
                const oauth_secret = this.requesToken.substring(requesToken.result.indexOf('oauth_token_secret='), requesToken.result.length);

                console.log('oauth_token');
                console.log(oauth_token);
                console.log('oauth_secret');
                this.globals.hmacSigningSecret = oauth_secret.substring(oauth_secret.indexOf('=') + 1, oauth_secret.length);
                localStorage.setItem('hmacSigningSecret', this.globals.hmacSigningSecret);
                console.log(this.globals.hmacSigningSecret);

                const authorizatuinUrl = 'https://www.flickr.com/services/oauth/authorize?' + oauth_token;

                console.log('authorizatuinUrl');
                console.log(authorizatuinUrl);

                // window.open(authorizatuinUrl, '_self');

              }, error1 => {
                this.errorRequesToken = true;
                console.log('error1');
                console.log(error1);
                // retry
                this.getOAuthRequestToken();
              });
          });
      });
  }

  getOAuthAccessToken(oauthToken: string, oauthVerifier: string) {
    this.errorAccessToken = false;
    const baseUrl = this.getBaseStringForAccessToken(oauthToken, oauthVerifier);
    return this.getEncodedUrl(baseUrl)
      .pipe(map(value => {
          if (this.errorRequesToken === true) {
            throw value;
          }
          return value;
        }),
        retryWhen(errors => {
          return errors.pipe(
            tap(errorVal => {
              console.log('error:   ');
              console.log(errorVal);
            }),
            delayWhen(() => timer(5000))
          );
        })
      )
      .pipe(map(accessToken => {
        return accessToken;
      }))
      .subscribe(tmpEncodedUrl => {
        this.encodedUrl = 'GET&' + this.globals.accessTokenBaseUrl + '&' + tmpEncodedUrl.encodedUrl;

        console.log('accesstoken encodedUrl');
        console.log(this.encodedUrl);

        return this.getHmacSign(this.encodedUrl, this.globals.hmacSigningSecret)
          .subscribe(hmacSignResponse => {
            this.hmacSignResponse = hmacSignResponse.result;
            const url = 'https://www.flickr.com/services/oauth/access_token' +
              '?oauth_nonce=' + this.mynewnonce +
              '&oauth_timestamp=' + this.timestamp +
              '&oauth_verifier=' + oauthVerifier +
              '&oauth_consumer_key=' + this.globals.apiKey +
              '&oauth_signature_method=HMAC-SHA1' +
              '&oauth_version=1.0' +
              '&oauth_token=' + oauthToken +
              '&oauth_signature=' + this.hmacSignResponse;

            console.log('accesstoken get url');
            console.log(url);

            const options = {
              headers: new HttpHeaders({
                'Accept': 'application/json',
              })
            };

            this.getProxyResult(url, options)
              .subscribe(accessToken => {
                this.errorAccessToken = false;
                console.log('accessToken.result');
                console.log(accessToken.result);

              }, errorAccessToken => {
                this.errorAccessToken = true;
                console.log('error fetching accessToken');
                console.log(errorAccessToken);
                // retry
                // this.getOAuthAccessToken(oauthToken, oauthVerifier);
              });
          });
      });
  }
}
