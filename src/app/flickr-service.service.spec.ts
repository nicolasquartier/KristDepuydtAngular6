import { TestBed, inject } from '@angular/core/testing';

import { FlickrServiceService } from './flickr-service.service';

describe('FlickrServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FlickrServiceService]
    });
  });

  it('should be created', inject([FlickrServiceService], (service: FlickrServiceService) => {
    expect(service).toBeTruthy();
  }));
});
