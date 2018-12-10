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
  accessToken: any;
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
    this.globals.oauthToken = localStorage.getItem('oauth_token');
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

  getObjectResultViaProxy(url: string, options: { headers?: HttpHeaders }) {
    return this.http.post<ProxyResult>('/api/proxy_object_result.php', {url}, options);
  }

  getResultViaProxy(url: string, options: { headers?: HttpHeaders }) {
    return this.http.post<ProxyResult>('/api/proxy_result.php', {url}, options);
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

            this.getObjectResultViaProxy(url, options)
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

                const authorizatuinUrl = 'https://www.flickr.com/services/oauth/authorize?' + oauth_token + '&perms=write';

                console.log('authorizatuinUrl');
                console.log(authorizatuinUrl);

                window.open(authorizatuinUrl, '_self');

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

            this.getObjectResultViaProxy(url, options)
              .subscribe(accessToken => {
                this.errorAccessToken = false;
                console.log('accessToken.result');
                console.log(accessToken.result);
                this.accessToken = accessToken.result;

                // fullname=Rudi%20Quartier&oauth_token=72157691952958304-1b231636a5d33b06&oauth_token_secret=f1814d8cf34911a7&user_nsid=146453494%40N06&username=rudiquartier
                const oauth_token = this.accessToken.substring(accessToken.result.indexOf('oauth_token='), accessToken.result.indexOf('&oauth_token_secret='));
                const oauth_token_secret = this.accessToken.substring(accessToken.result.indexOf('oauth_token_secret='), accessToken.result.indexOf('&user_nsid'));
                this.globals.hmacSigningSecret = oauth_token_secret.substring(oauth_token_secret.indexOf('=') + 1, oauth_token_secret.length);
                this.globals.oauthToken = oauth_token.substring(oauth_token.indexOf('=') + 1, oauth_token.length);
                localStorage.setItem('hmacSigningSecret', this.globals.hmacSigningSecret);
                localStorage.setItem('oauth_token', this.globals.oauthToken);

                console.log('oauth_token:');
                console.log(this.globals.oauthToken);
                console.log('oauth_token_secret: ');
                console.log(this.globals.hmacSigningSecret);

                this.getTestLogin();

              }, errorAccessToken => {
                this.errorAccessToken = true;
                console.log('error fetching accessToken');
                console.log(errorAccessToken);
                // retry
                this.getOAuthAccessToken(oauthToken, oauthVerifier);
              });
          });
      });
  }

  private getTestLogin() {

    //https://api.flickr.com/services/rest
    // ?nojsoncallback=1 &oauth_nonce=84354935
    // &format=json
    // &oauth_consumer_key=653e7a6ecc1d528c516cc8f92cf98611
    // &oauth_timestamp=1305583871
    // &oauth_signature_method=HMAC-SHA1
    // &oauth_version=1.0
    // &oauth_token=72157626318069415-087bfc7b5816092c
    // &oauth_signature=dh3pEH0Xk1qILr82HyhOsxRv1XA%3D
    // &method=flickr.test.login

    console.log('test login');

    this.getNonceObservable.subscribe();
    this.timestamp = new Date().getTime().toString();
    const baseUrlForTestLogin =
      'format=json' +
      '&method=flickr.test.login' +
      '&nojsoncallback=1' +
      '&oauth_consumer_key=' + this.globals.apiKey +
      '&oauth_nonce=' + this.mynewnonce +
      '&oauth_signature_method=HMAC-SHA1' +
      '&oauth_timestamp=' + this.timestamp +
      '&oauth_token=' + this.globals.oauthToken +
      '&oauth_version=1.0';

    this.getEncodedUrl(baseUrlForTestLogin)
      .subscribe(tmpTestLoginEncodedUrl => {
        this.encodedUrl = 'GET&' + this.globals.basicRestRequestUrl + '&' + tmpTestLoginEncodedUrl.encodedUrl;

        console.log('request testLogin encodedUrl');
        console.log(this.encodedUrl);

        return this.getHmacSign(this.encodedUrl, this.globals.hmacSigningSecret)
          .subscribe(hmacSignResponse => {
            this.hmacSignResponse = hmacSignResponse.result;
            const url = 'https://api.flickr.com/services/rest' +
              '?nojsoncallback=1' +
              '&oauth_nonce=' + this.mynewnonce +
              '&format=json' +
              '&oauth_consumer_key=' + this.globals.apiKey +
              '&oauth_timestamp=' + this.timestamp +
              '&oauth_signature_method=HMAC-SHA1' +
              '&oauth_version=1.0' +
              '&oauth_token=' + this.globals.oauthToken +
              '&oauth_signature=' + this.hmacSignResponse +
              '&method=flickr.test.login';

            console.log('request testLogin url');
            console.log(url);

            const options = {
              headers: new HttpHeaders({
                'Accept': 'application/json+charset=UTF-8',
              })
            };

            this.getResultViaProxy(url, options)
              .subscribe(resultTestLogin => {
                console.log('resultTestLogin');
                console.log(resultTestLogin);

              }, errorTestLogin => {
                console.log('errorTestLogin');
                console.log(errorTestLogin);
                // retry
                this.getTestLogin();
              });

          });
      });
  }

  createPhotoSet() {
    this.getNonceObservable.subscribe();
    this.timestamp = new Date().getTime().toString();
    const baseUrl =
      'description=TestDescription' +
      '&format=json' +
      '&method=flickr.photosets.create' +
      '&nojsoncallback=1' +
      '&oauth_consumer_key=' + this.globals.apiKey +
      '&oauth_nonce=' + this.mynewnonce +
      '&oauth_signature_method=HMAC-SHA1' +
      '&oauth_timestamp=' + this.timestamp +
      '&oauth_token=' + this.globals.oauthToken +
      '&oauth_version=1.0' +
      '&primary_photo_id=44371913182' +
      '&title=Test';

    this.getEncodedUrl(baseUrl)
      .subscribe(tmpEncodedUrl => {
        this.encodedUrl = 'GET&' + this.globals.basicRestRequestUrl + '&' + tmpEncodedUrl.encodedUrl;

        console.log('request create photoset encodedUrl');
        console.log(this.encodedUrl);

        return this.getHmacSign(this.encodedUrl, this.globals.hmacSigningSecret)
          .subscribe(hmacSignResponse => {
            this.hmacSignResponse = hmacSignResponse.result;
            const url = 'https://api.flickr.com/services/rest' +
              '?method=flickr.photosets.create' +
              '&title=Test' +
              '&description=TestDescription' +
              '&primary_photo_id=44371913182' +
              '&format=json' +
              '&nojsoncallback=1' +
              '&oauth_token=' + this.globals.oauthToken +
              '&oauth_nonce=' + this.mynewnonce +
              '&oauth_consumer_key=' + this.globals.apiKey +
              '&oauth_timestamp=' + this.timestamp +
              '&oauth_signature_method=HMAC-SHA1' +
              '&oauth_version=1.0' +
              '&oauth_signature=' + this.hmacSignResponse;

            console.log('request create photoset encodedUrl');
            console.log(url);

            const options = {
              headers: new HttpHeaders({
                'Accept': 'application/json+charset=UTF-8',
              })
            };

            this.getResultViaProxy(url, options)
              .subscribe(resultTestLogin => {
                console.log('result create photoset');
                console.log(resultTestLogin);

              }, errorTestLogin => {
                console.log('error create photoset');
                console.log(errorTestLogin);
                // retry
                this.createPhotoSet();
              });

          });
      });
  }

  uploadPhoto() {
    this.getNonceObservable.subscribe();
    this.timestamp = new Date().getTime().toString();
    const baseUrl =
      'description=TestPhoto' +
      '&title=testTitlePhoto' +
      '&format=json' +
      '&oauth_consumer_key=' + this.globals.apiKey +
      '&oauth_nonce=' + this.mynewnonce +
      '&oauth_signature_method=HMAC-SHA1' +
      '&oauth_timestamp=' + this.timestamp +
      '&oauth_token=' + this.globals.oauthToken +
      '&oauth_version=1.0';
    this.getEncodedUrl(baseUrl)
      .subscribe(tmpEncodedUrl => {
        this.encodedUrl = 'POST&' + this.globals.basicRestRequestUrl + '&' + tmpEncodedUrl.encodedUrl;

        console.log('request upload photo encodedUrl');
        console.log(this.encodedUrl);

        return this.getHmacSign(this.encodedUrl, this.globals.hmacSigningSecret)
          .subscribe(hmacSignResponse => {
            this.hmacSignResponse = hmacSignResponse.result;
            const url = 'https://up.flickr.com/services/upload/' +
              '?description=TestPhoto' +
              '&title=testTitlePhoto' +
              '&format=json' +
              '&oauth_consumer_key=' + this.globals.apiKey +
              '&oauth_nonce=' + this.mynewnonce +
              '&oauth_signature_method=HMAC-SHA1' +
              '&oauth_timestamp=' + this.timestamp +
              '&oauth_token=' + this.globals.oauthToken +
              '&oauth_version=1.0' +
              '&oauth_signature=' + this.hmacSignResponse;


            console.log('request upload photo signed encoded url');
            console.log(url);

            const options = {
              headers: new HttpHeaders({
                'Accept': 'application/json+charset=UTF-8',
                'Content-Type': 'multipart/form-data'
              })
            };

            this.getResultViaProxy(url, options)
              .subscribe(resultTestupload => {
                console.log('result upload photo');
                console.log(resultTestupload);

              }, errorTestUpload => {
                console.log('error upload photo');
                console.log(errorTestUpload);
                // retry
              });

          });
      });
  }
}
