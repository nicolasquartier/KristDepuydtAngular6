import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpositiesComponent } from './exposities.component';

describe('ExpositiesComponent', () => {
  let component: ExpositiesComponent;
  let fixture: ComponentFixture<ExpositiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpositiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpositiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
