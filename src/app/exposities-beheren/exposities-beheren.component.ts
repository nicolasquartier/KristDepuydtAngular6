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
  id: number;
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

  reloadExposities() {
    console.log('reload');
    // this.expositiesPerYear = [];
    this.expositiesService.getExposities()
      .subscribe(exposities => {

        let currentYear = '';
        let expositiesPerYearTemp = [];
        // let expositie: ExpositieWithPhotos;

        for (let i = 0; i < exposities.length; i++) {
          const expositie = {
            year: exposities[i].year,
            id: exposities[i].id,
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
      });

    const btnEdits = document.querySelectorAll('.edit');
    for (let i = 0; i < btnEdits.length; i++) {
      const btnEdit = btnEdits[i];
      btnEdit.setAttribute('style', 'display: inline');
    }

    const spanTexts = document.querySelectorAll('.spanTitle');
    for (let i = 0; i < spanTexts.length; i++) {
      const spanText = spanTexts[i];
      spanText.setAttribute('style', 'display: inline');
    }

    const inpuTexts = document.querySelectorAll('.spanLocation');
    for (let i = 0; i < inpuTexts.length; i++) {
      const inputText = inpuTexts[i];
      inputText.setAttribute('style', 'display: inline');
    }

    const btnSaves = document.querySelectorAll('.save');
    for (let i = 0; i < btnSaves.length; i++) {
      const btnSave = btnSaves[i];
      btnSave.setAttribute('style', 'display: none');
    }

    const txtTitles = document.querySelectorAll('.txtTitle');
    for (let i = 0; i < txtTitles.length; i++) {
      const txtTitle = txtTitles[i];
      txtTitle.setAttribute('style', 'display: none');
    }

    const txtLocations = document.querySelectorAll('.txtLocation');
    for (let i = 0; i < txtLocations.length; i++) {
      const txtLocation = txtLocations[i];
      txtLocation.setAttribute('style', 'display: none');
    }

  }

  ngOnInit() {
    this.reloadExposities();
  }

  edit(event, year: number ) {
    event.preventDefault();
    const target = event.target;

    this.save(event, year);
    this.setAllBtnEditActive();
    this.setAllInputTextDisabled();
    this.toggleCurrentText(target);
    this.toggleCurrentBtn(target);
  }

  save(event, year: number) {
    event.preventDefault();
    const target = event.target;
    console.log(target);
    const id = this.getNameOfElement(target);
    console.log('save: ' + id);

    this.showText(target);
    this.showEditButtonAfterSave(target);

    this.editExpositieInDB(id);

    // this.expositiesPerYear = [];
    this.reloadExposities();
  }

  private getNameOfElement(target: any) {
    const fullElementName = target.id;

    // get name of element
    const kindOfBtn = fullElementName.indexOf('btnEdit') > -1 ? 'btnEdit' : 'btnSave';
    const parts = fullElementName.split(kindOfBtn);
    return parts[parts.length - 1];
  }

  private setAllBtnEditActive() {
    // show span
    const btnEdits = document.querySelectorAll('.edit');
    for (let i = 0; i < btnEdits.length; i++) {
      const btnEdit = btnEdits[i];
      btnEdit.setAttribute('style', 'display: inline');
    }

    // disable input texts
    const btnSaves = document.querySelectorAll('.save');
    for (let i = 0; i < btnSaves.length; i++) {
      const btnSave = btnSaves[i];
      btnSave.setAttribute('style', 'display: none');
    }
  }

  private setAllInputTextDisabled() {
    // show span
    const spanTitleTexts = document.querySelectorAll('.spanTitle');
    for (let i = 0; i < spanTitleTexts.length; i++) {
      const spanText = spanTitleTexts[i];
      spanText.setAttribute('style', 'display: inline');
    }

    const spanLocationTexts = document.querySelectorAll('.spanLocation');
    for (let i = 0; i < spanLocationTexts.length; i++) {
      const inpuText = spanLocationTexts[i];
      inpuText.setAttribute('style', 'display: inline');
    }

    const inputTitleTexts = document.querySelectorAll('.txtTitle');
    for (let i = 0; i < inputTitleTexts.length; i++) {
      const inpuText = inputTitleTexts[i];
      inpuText.setAttribute('style', 'display: none');
    }

    const inputLocationTexts = document.querySelectorAll('.txtLocation');
    for (let i = 0; i < inputLocationTexts.length; i++) {
      const inpuText = inputLocationTexts[i];
      inpuText.setAttribute('style', 'display: none');
    }
  }

  private toggleCurrentText(target: any) {
    const id = this.getNameOfElement(target);
    console.log('#txtLocation' + id);

    // toggle span
    const spanText = document.querySelector('#spanTitle' + id);
    const styleSpanText = spanText.getAttribute('style') === 'display: inline' ? 'none' : 'inline';
    spanText.setAttribute('style', 'display: ' + styleSpanText);

    // toggle input
    const txtInput = document.querySelector('#txtTitle' + id);
    const styleTxtInput = txtInput.getAttribute('style') === 'display: inline' ? 'none' : 'inline';
    txtInput.setAttribute('style', 'display: ' + styleTxtInput);

    // toggle span
    const spanLocation = document.querySelector('#spanLocation' + id);
    const styleSpanLocation = spanLocation.getAttribute('style') === 'display: inline' ? 'none' : 'inline';
    spanLocation.setAttribute('style', 'display: ' + styleSpanLocation);

    // toggle input
    const txtLocation = document.querySelector('#txtLocation' + id);
    console.log(txtLocation);
    const styleTxtLocation = txtLocation.getAttribute('style') === 'display: inline' ? 'none' : 'inline';
    txtLocation.setAttribute('style', 'display: ' + styleTxtLocation);
  }

  private toggleCurrentBtn(target: any) {
    const id = this.getNameOfElement(target);

    // toggle span
    const btnEdit = document.querySelector('#btnEdit' + id);
    const stylebtnEdit = btnEdit.getAttribute('style') === 'display: inline' ? 'none' : 'inline';
    btnEdit.setAttribute('style', 'display: ' + stylebtnEdit);

    // toggle input
    const btnSave = document.querySelector('#btnSave' + id);
    const stylebtnSave = btnSave.getAttribute('style') === 'display: inline' ? 'none' : 'inline';
    btnSave.setAttribute('style', 'display: ' + stylebtnSave);
  }

  private showText (target) {
    const name = this.getNameOfElement(target);

    // toggle span
    const spanTextTitle = document.querySelector('#spanTitle' + name);
    spanTextTitle.setAttribute('style', 'display: inline');

    // toggle input
    const txtInputTitle = document.querySelector('#txtTitle' + name);
    txtInputTitle.setAttribute('style', 'display: none');

    // toggle span
    const spanTextLocation = document.querySelector('#spanLocation' + name);
    spanTextLocation.setAttribute('style', 'display: inline');

    // toggle input
    const txtInputLocation = document.querySelector('#txtLocation' + name);
    txtInputLocation.setAttribute('style', 'display: none');
  }

  private showEditButtonAfterSave(target) {
    const name = this.getNameOfElement(target);

    // toggle btnEdit
    const btnEdit = document.querySelector('#btnEdit' + name);
    btnEdit.setAttribute('style', 'display: inline');

    // toggle btnSave
    const btnSave = document.querySelector('#btnSave' + name);
    btnSave.setAttribute('style', 'display: none');
  }

  private editExpositieInDB(id) {
    const txtUpdatedTitle = (<HTMLInputElement>document.querySelector('#txtTitle' + id)).value;
    const txtUpdatedLocation = (<HTMLInputElement>document.querySelector('#txtLocation' + id)).value;
    console.log(txtUpdatedTitle);
    console.log(txtUpdatedLocation);

    this.expositiesService.editExpositie(id, txtUpdatedTitle, txtUpdatedLocation)
      .subscribe(response => {
        console.log(response);
      });
  }
}
