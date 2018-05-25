import { TestBed, inject } from '@angular/core/testing';

import { ExpositiesService } from './exposities.service';

describe('ExpositiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpositiesService]
    });
  });

  it('should be created', inject([ExpositiesService], (service: ExpositiesService) => {
    expect(service).toBeTruthy();
  }));
});
