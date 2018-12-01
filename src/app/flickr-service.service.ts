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

  getNonceObservable = Rx.Observable.create((observer) => {
    this.mynewnonce = Math.random();
    observer.next(this.mynewnonce);
    observer.complete();
  });

  constructor(private http: HttpClient, private globals: GlobalsService) {
  }

  getPhotoSets() {
    return this.http.get<Response>('https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=' + this.globals.apiKey + '&user_id=' + this.globals.userId + '&format=json&nojsoncallback=1');
  }

  getPhotos(photosetId: any) {
    return this.http.get<PhotoSetByIds>('https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=' + this.globals.apiKey + '&photoset_id=' + photosetId + '&user_id=' + this.globals.userId + '&format=json&nojsoncallback=1');
  }

  getBaseString() {
    this.getNonceObservable.subscribe();
    this.timestamp = new Date().getTime().toString();
    return 'oauth_callback=http%3A%2F%2Flocalhost' +
      '&oauth_consumer_key=' + this.globals.apiKey +
      '&oauth_nonce=' + this.mynewnonce +
      '&oauth_signature_method=HMAC-SHA1' +
      '&oauth_timestamp=' + this.timestamp +
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

  getHmacSign(encodedRequestTokenUrl: string) {
    return this.http.post<HmacSignResult>('/api/hmacsign.php', {encodedRequestTokenUrl})
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
    // .pipe(map(httpResponse => {
    //     if (httpResponse.status !== 200) {
    //       throw httpResponse;
    //     }
    //     if (httpResponse.body === undefined || httpResponse.body === null) {
    //       throw httpResponse;
    //     }
    //     if (httpResponse.body.result === undefined || httpResponse.body.result === null) {
    //       throw  httpResponse;
    //     }
    //     this.requestTokenReceived = true;
    //     return httpResponse.body;
    //   }),
    //   retryWhen(errors => {
    //     return errors.pipe(
    //       map(value => this.requestTokenReceived = false),
    //       // log error message
    //       tap(val => console.log(val)),
    //       delayWhen(() => timer(500))
    //     );
    //   })
    // );
  }

  getOAuthToken() {
    this.errorRequesToken = false;
    const baseUrl = this.getBaseString();
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
              '&oauth_callback=http%3A%2F%2Flocalhost';

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
              }, error1 => {
                this.errorRequesToken = true;
                console.log('error1');
                console.log(error1);
                // retry
                this.getOAuthToken();
              });
          });
      });


    //BEFORE REFACTOR
    // return this.getBaseString()
    //   .subscribe(baseString => {
    //     const encodedBasestring = 'GET&' + this.globals.requestTokenBaseUrl + '&' + baseString.encodedUrl;
    //     // console.log('encoded baseString');
    //     // console.log(encodedBasestring);
    //     return this.http.post<HmacSignResult>('/api/hmacsign.php', {encodedBasestring})
    //       .subscribe(data2 => {
    //         console.log('signature: ' + data2.result);
    //         // console.log(baseString);
    //
    //         let url = 'https://www.flickr.com/services/oauth/request_token' +
    //           '?oauth_nonce=' + this.mynewnonce +
    //           '&oauth_timestamp=' + this.timestamp +
    //           '&oauth_consumer_key=' + this.globals.apiKey +
    //           '&oauth_signature_method=HMAC-SHA1' +
    //           '&oauth_version=1.0' +
    //           '&oauth_signature=' + data2.result +
    //           '&oauth_callback=http%3A%2F%2Flocalhost';
    //
    //         let headers = new HttpHeaders({
    //           'Accept': 'application/json',
    //         });
    //         let options = {headers: headers};
    //
    //         console.log('url:');
    //         console.log(url);
    //
    //         this.getProxyResult(url, options)
    //           .subscribe(data1 => {
    //             console.log('oauth token: ');
    //             console.log(data1);
    //             return data1;
    //           }, (error1 => {
    //             console.log('error1: ');
    //             console.log(error1);
    //           }));
    //       }, (error2 => {
    //         console.log('error2');
    //         console.log(error2);
    //       }));
    //   });
  }

  // genNonce() {
  //   // const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
  //   const charset = '0123456789';
  //   const result = [];
  //   window.crypto.getRandomValues(new Uint8Array(8)).forEach(c =>
  //     result.push(charset[c % charset.length]));
  //   return result.join('');
  // }

}
