import {Component, OnInit} from '@angular/core';
import {FlickrServiceService} from '../flickr-service.service';
import {GlobalsService} from '../globals.service';

@Component({
  selector: 'app-sculptuur',
  templateUrl: './sculptuur.component.html',
  styleUrls: ['./sculptuur.component.css']
})
export class SculptuurComponent implements OnInit {
  photos = 'Hier komen de fotos';
  photoSets = [];

  constructor(private flickrService: FlickrServiceService, private globals: GlobalsService) {
  }

  ngOnInit() {
    this.flickrService.getPhotoSets()
      .subscribe(response => {
        // this.photoSets = response.photoset;
        console.log('response');
        // console.log(response.photosets.photoset[0]);
        console.log(response);
        this.photoSets = response.photosets.photoset;
      });
    console.log('photosets:');
    console.log(this.photoSets);
  }
}
