import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactBeherenComponent } from './contact-beheren.component';

describe('ContactBeherenComponent', () => {
  let component: ContactBeherenComponent;
  let fixture: ComponentFixture<ContactBeherenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactBeherenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactBeherenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
