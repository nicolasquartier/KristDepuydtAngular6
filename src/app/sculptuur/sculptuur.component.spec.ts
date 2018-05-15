import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SculptuurComponent } from './sculptuur.component';

describe('SculptuurComponent', () => {
  let component: SculptuurComponent;
  let fixture: ComponentFixture<SculptuurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SculptuurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SculptuurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
