import {Component, OnInit} from '@angular/core';
import {IAlbum} from 'ngx-lightbox';
import {ExpositiesService} from '../exposities.service';
import {FlickrServiceService} from '../flickr-service.service';

interface ExpositiesPerYear {
  year: string;
  exposities: Array<ExpositieWithPhotos>;
}

interface ExpositieWithPhotos {
  year: string;
  name: string;
  description: string;
  hasPhotos: boolean;
  photo: Array<IAlbum>;
}

@Component({
  selector: 'app-exposities-beheren',
  templateUrl: './exposities-beheren.component.html',
  styleUrls: ['./exposities-beheren.component.css']
})
export class ExpositiesBeherenComponent implements OnInit {
  photos: Array<IAlbum> = [];
  photosetsTemp = [];
  pageTitle = 'Exposities';
  expositiesPerYear: Array<ExpositiesPerYear> = [];

  constructor(private flickrService: FlickrServiceService,
              private expositiesService: ExpositiesService) {
  }

  ngOnInit() {

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

  }

}
