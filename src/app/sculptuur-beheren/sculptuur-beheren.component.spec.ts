import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SculptuurBeherenComponent } from './sculptuur-beheren.component';

describe('SculptuurBeherenComponent', () => {
  let component: SculptuurBeherenComponent;
  let fixture: ComponentFixture<SculptuurBeherenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SculptuurBeherenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SculptuurBeherenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
