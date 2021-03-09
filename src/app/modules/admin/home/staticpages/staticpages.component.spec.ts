import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticpagesComponent } from './staticpages.component';

describe('StaticpagesComponent', () => {
  let component: StaticpagesComponent;
  let fixture: ComponentFixture<StaticpagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticpagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticpagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
