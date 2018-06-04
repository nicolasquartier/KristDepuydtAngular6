import {Component, OnInit} from '@angular/core';
import {IAlbum, IEvent, Lightbox, LIGHTBOX_EVENT, LightboxConfig, LightboxEvent} from 'ngx-lightbox';
import {Subscription} from 'rxjs';
import {GlobalsService} from '../globals.service';
import {FlickrServiceService} from '../flickr-service.service';
import {ExpositiesService} from '../exposities.service';

interface ExpositiesPerYear {
  year: string;
  exposities: Array<ExpositieWithPhotos>;
}

interface ExpositieWithPhotos {
  year: string;
  id: number;
  name: string;
  description: string;
  hasPhotos: boolean;
  photo: Array<IAlbum>;
}

@Component({
  selector: 'app-exposities',
  templateUrl: './exposities.component.html',
  styleUrls: ['./exposities.component.css']
})
export class ExpositiesComponent implements OnInit {
  photos: Array<IAlbum> = [];
  photosetsTemp = [];
  pageTitle = 'Exposities';
  expositiesPerYear: Array<ExpositiesPerYear> = [];

  private _subscription: Subscription;

  constructor(private flickrService: FlickrServiceService,
              private expositiesService: ExpositiesService,
              private globals: GlobalsService,
              private _lightbox: Lightbox,
              private _lightboxEvent: LightboxEvent,
              private _lighboxConfig: LightboxConfig) {
  }

  ngOnInit() {
    this.flickrService.getPhotoSets()
      .subscribe(response => {
        const globalPhotosets = response.photosets.photoset;

        for (let i = 0; i < globalPhotosets.length; i++) {
          if (globalPhotosets[i].title._content.toUpperCase().indexOf(this.pageTitle.toUpperCase()) >= 0) {
            this.photosetsTemp.push({
              name: globalPhotosets[i].title._content.replace('Exposities: ', ''),
              description: globalPhotosets[i].description,
              id: globalPhotosets[i].id
            });
          }
        }

        this.expositiesService.getExposities()
          .subscribe(exposities => {

            let currentYear = '';
            let expositiesPerYearTemp = [];
            // let expositie: ExpositieWithPhotos;

            for (let i = 0; i < exposities.length; i++) {
              const expositie = {
                year: exposities[i].year,
                name: exposities[i].name,
                description: exposities[i].description,
                hasPhotos: exposities[i].hasPhotos,
                photo: Array<IAlbum>()
              };

              if (expositie.hasPhotos === true) {
                for (let l = 0; l < this.photosetsTemp.length; l++) {
                  const id = this.photosetsTemp[l].id;
                  const name = this.photosetsTemp[l].name;

                  if (expositie.name.toUpperCase() === name.toUpperCase()) {

                    this.flickrService.getPhotos(id)
                      .subscribe(photosFromPhotoset => {

                        for (let j = 0; j < photosFromPhotoset.photoset.photo.length; j++) {
                          const photoUrl = 'https://farm' + photosFromPhotoset.photoset.photo[j].farm + '.staticflickr.com/' + photosFromPhotoset.photoset.photo[j].server + '/' + photosFromPhotoset.photoset.photo[j].id + '_' + photosFromPhotoset.photoset.photo[j].secret + '_b.jpg';
                          expositie.photo.push({
                            src: photoUrl,
                            caption: photosFromPhotoset.photoset.title,
                            thumb: null
                          });
                        }
                      });
                    break;
                  }
                }
              }

              if (currentYear !== expositie.year) {
                if (expositiesPerYearTemp.length > 0) {
                  this.expositiesPerYear.push({year: currentYear, exposities: expositiesPerYearTemp});
                  expositiesPerYearTemp = [];
                }
                currentYear = expositie.year;
                expositiesPerYearTemp.push(expositie);
              } else {
                expositiesPerYearTemp.push(expositie);
              }
            }
            this.expositiesPerYear.push({year: currentYear, exposities: expositiesPerYearTemp});
            // console.log(this.expositiesPerYear);
          });
      });
  }

  open(photos: Array<IAlbum>, index: number): void {
    this._subscription = this._lightboxEvent.lightboxEvent$.subscribe((event: IEvent) => this._onReceivedEvent(event));
    // override the default config
    this._lightbox.open(photos, index, {wrapAround: true, showImageNumberLabel: true});
  }

  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      console.log('close lightbox');
      this._subscription.unsubscribe();
    }
  }
}
