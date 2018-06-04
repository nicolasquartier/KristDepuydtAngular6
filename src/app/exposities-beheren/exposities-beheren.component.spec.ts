import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpositiesBeherenComponent } from './exposities-beheren.component';

describe('ExpositiesBeherenComponent', () => {
  let component: ExpositiesBeherenComponent;
  let fixture: ComponentFixture<ExpositiesBeherenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpositiesBeherenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpositiesBeherenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
