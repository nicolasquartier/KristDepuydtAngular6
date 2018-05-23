import { Component, OnInit } from '@angular/core';
import {IAlbum, IEvent, Lightbox, LIGHTBOX_EVENT, LightboxConfig, LightboxEvent} from 'ngx-lightbox';
import {FlickrServiceService} from '../flickr-service.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-projecten',
  templateUrl: './projecten.component.html',
  styleUrls: ['./projecten.component.css']
})
export class ProjectenComponent implements OnInit {

  pageTitle = 'Projecten';
  projectenPhotoSetId = '';
  projectenPhotos: Array<IAlbum> = [];
  private _subscription: Subscription;

  constructor(private flickrService: FlickrServiceService,
              private _lightbox: Lightbox,
              private _lightboxEvent: LightboxEvent,
              private _lighboxConfig: LightboxConfig) { }

  ngOnInit() {
    this.flickrService.getPhotoSets()
      .subscribe(response => {
        const globalPhotosets = response.photosets.photoset;

        for (let i = 0; i < globalPhotosets.length; i++) {
          if (globalPhotosets[i].title._content.toUpperCase() === this.pageTitle.toUpperCase()) {
            this.projectenPhotoSetId = globalPhotosets[i].id;
            break;
          }
        }

        this.flickrService.getPhotos(this.projectenPhotoSetId)
          .subscribe(photoSetByIds => {
            const photos = photoSetByIds.photoset.photo;
            for (let i = 0; i < photos.length; i++) {
              const photoUrl = 'https://farm' + photos[i].farm + '.staticflickr.com/' + photos[i].server + '/' + photos[i].id + '_' + photos[i].secret + '_b.jpg';
              this.projectenPhotos.push({
                src: photoUrl,
                caption: 'Keramiek',
                thumb: null
              });
            }
          });
      });
  }

  open(index: number): void {
    this._subscription = this._lightboxEvent.lightboxEvent$.subscribe((event: IEvent) => this._onReceivedEvent(event));
    // override the default config
    this._lightbox.open(this.projectenPhotos, index, { wrapAround: true, showImageNumberLabel: true });
  }

  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      console.log('close lightbox');
      this._subscription.unsubscribe();
    }
  }
}
