import {Component, OnInit} from '@angular/core';
import {FlickrServiceService} from '../flickr-service.service';

@Component({
  selector: 'app-sculptuur',
  templateUrl: './sculptuur.component.html',
  styleUrls: ['./sculptuur.component.css']
})
export class SculptuurComponent implements OnInit {
  photos = 'Hier komen de fotos';
  photoSets = {};

  constructor(private flickrService: FlickrServiceService) {
    this.photoSets = {};
  }

  ngOnInit() {
    this.photoSets = this.flickrService.getPhotoSets();
    console.log('photosets:');
    console.log(this.photoSets);
  }
}
