import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectenComponent } from './projecten.component';

describe('ProjectenComponent', () => {
  let component: ProjectenComponent;
  let fixture: ComponentFixture<ProjectenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
