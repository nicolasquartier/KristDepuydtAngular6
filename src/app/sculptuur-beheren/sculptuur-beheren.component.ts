import {Component, OnInit} from '@angular/core';
import {IAlbum, IEvent, Lightbox, LIGHTBOX_EVENT, LightboxConfig, LightboxEvent} from 'ngx-lightbox';
import {Subscription} from 'rxjs';
import {FlickrServiceService} from '../flickr-service.service';
import {GlobalsService} from '../globals.service';

interface PhotoSet {
  id: string;
  title: string;
  description: string;
  photos: Array<IAlbum>;
}

@Component({
  selector: 'app-sculptuur-beheren',
  templateUrl: './sculptuur-beheren.component.html',
  styleUrls: ['./sculptuur-beheren.component.css']
})
export class SculptuurBeherenComponent implements OnInit {
  photos: Array<IAlbum> = [];
  photosToUpload = [];
  sculptuurPhotosets: Array<PhotoSet> = [];
  txtnewCollectionName = '';

  private _subscription: Subscription;

  constructor(private flickrService: FlickrServiceService,
              private globals: GlobalsService,
              private _lightbox: Lightbox,
              private _lightboxEvent: LightboxEvent,
              private _lighboxConfig: LightboxConfig) {
  }

  async delay(ms: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  ngOnInit() {
    this.globals.activePage = 'sculptuur';

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
    this._lightbox.open(photos, index, {wrapAround: true, showImageNumberLabel: true});
  }

  private _onReceivedEvent(event: IEvent): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      this._subscription.unsubscribe();
    }
  }

  showPopupAddNewCollection() {
    const addNewCollectionOverlay = document.getElementById('popupAddNewCollectionOverlay');
    const popupAddNewCollection = document.getElementById('popupAddNewCollection');
    addNewCollectionOverlay.setAttribute('style', 'display: inline');
    popupAddNewCollection.setAttribute('style', 'display: inline');
    this.photosToUpload = [];
    document.getElementById('selectPhotosToUpload').value = '';
  }

  closePopupAddNewCollection() {
    const addNewCollectionOverlay = document.getElementById('popupAddNewCollectionOverlay');
    const popupAddNewCollection = document.getElementById('popupAddNewCollection');
    addNewCollectionOverlay.setAttribute('style', 'display: none');
    popupAddNewCollection.setAttribute('style', 'display: none');
    this.photosToUpload = [];
    document.getElementById('selectPhotosToUpload').value = '';
  }

  addNewSculptuur($event) {
    console.log('you\'ll be adding a new sculptuur');
    const photosVerplicht = document.getElementById('PhotosVerplicht');
    const nameVerplicht = document.getElementById('NameVerplicht');
    nameVerplicht.setAttribute('style', 'display: none');
    photosVerplicht.setAttribute('style', 'display: none');

    let proceed = true;
    if (this.txtnewCollectionName === '' || this.txtnewCollectionName === null) {
      proceed = false;
      nameVerplicht.setAttribute('style', 'display: inline');
    }

    if (this.photosToUpload.length === 0) {
      proceed = false;
      photosVerplicht.setAttribute('style', 'display: inline');
    }

    if (proceed) {
      console.log('proceed');
      this.uploadPhotos();
    // this.flickrService.createPhotoSet();
    }
  }

  addPhotosToUpload(files: FileList) {
    // console.log('Photos will be added');
    for (let i = 0; i < files.length; i++) {
      const fileToUpload = files.item(i);
      this.photosToUpload.push(fileToUpload);
    }
    console.log('Photos will be added', this.photosToUpload);
  }

  async uploadPhotos() {
    console.log('Start uploading photos');
    for (let i = 0; i < this.photosToUpload.length; i++) {
      const fileToUpload = this.photosToUpload[i];
      this.flickrService.uploadPhoto(fileToUpload);
      while (this.flickrService.uploadingPhoto) {
        console.log('still uploading');
        await this.sleep(2000);
      }
    }
    console.log('done uploading photos');
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
