import {Component, OnInit} from '@angular/core';
import {FlickrServiceService} from '../flickr-service.service';
import {GlobalsService} from '../globals.service';
import {IAlbum, IEvent, Lightbox, LIGHTBOX_EVENT, LightboxConfig, LightboxEvent} from 'ngx-lightbox';
import {Subscription} from 'rxjs';



interface PhotoSet {
  id: string;
  title: string;
  description: string;
  photos: Array<IAlbum>;
}

@Component({
  selector: 'app-sculptuur',
  templateUrl: './sculptuur.component.html',
  styleUrls: ['./sculptuur.component.css']
})

export class SculptuurComponent implements OnInit {
  photos: Array<IAlbum> = [];
  sculptuurPhotosets: Array<PhotoSet> = [];

  private _subscription: Subscription;

  constructor(private flickrService: FlickrServiceService,
              private globals: GlobalsService,
              private _lightbox: Lightbox,
              private _lightboxEvent: LightboxEvent,
              private _lighboxConfig: LightboxConfig) {
  }

  ngOnInit() {
    this.globals.activePage = 'sculptuur';
    console.log(this.globals.activePage);
    this.flickrService.getPhotoSets()
      .subscribe(response => {
        const globalPhotosets = response.photosets.photoset;
        const allPhotosetsTemp = [];

        const pages = this.globals.pages;


        for (let i = 0; i < globalPhotosets.length; i++) {
          allPhotosetsTemp.push(globalPhotosets[i]);
          for (let j = 0; j < pages.length; j++) {
            if ((globalPhotosets[i].title._content.toUpperCase() === pages[j].toUpperCase())
              || (globalPhotosets[i].title._content.toUpperCase().indexOf(pages[j].toUpperCase()) !== -1)) {
              const k = allPhotosetsTemp.indexOf(globalPhotosets[i]);
              allPhotosetsTemp.splice(k, 1);
            }
          }
        }

        for (let l = 0; l < allPhotosetsTemp.length; l++) {
          const id = allPhotosetsTemp[l].id;
          const title = allPhotosetsTemp[l].title._content;
          const description = allPhotosetsTemp[l].description._content;
          this.flickrService.getPhotos(allPhotosetsTemp[l].id)
            .subscribe(photosFromPhotoset => {
              this.photos = [];
              for (let i = 0; i < photosFromPhotoset.photoset.photo.length; i++) {
                const photoUrl = 'https://farm' + photosFromPhotoset.photoset.photo[i].farm + '.staticflickr.com/' + photosFromPhotoset.photoset.photo[i].server + '/' + photosFromPhotoset.photoset.photo[i].id + '_' + photosFromPhotoset.photoset.photo[i].secret + '_b.jpg';
                this.photos.push({
                  src: photoUrl,
                  caption: title,
                  thumb: null
                });
              }

              this.sculptuurPhotosets.push({
                id: id,
                title: title,
                description: description,
                photos: this.photos
              });

              this.sort();

            });
        }
      });
  }

  sort() {
    this.sculptuurPhotosets.sort((a: any, b: any) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
  }

  open(photos: Array<IAlbum>, index: number): void {
    this._subscription = this._lightboxEvent.lightboxEvent$.subscribe((event: IEvent) => this._onReceivedEvent(event));
    // override the default config
    this._lightbox.open(photos, index, { wrapAround: true, showImageNumberLabel: true });
  }

  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      this._subscription.unsubscribe();
    }
  }
}
