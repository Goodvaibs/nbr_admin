import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomevedioComponent } from './homevedio.component';

describe('HomevedioComponent', () => {
  let component: HomevedioComponent;
  let fixture: ComponentFixture<HomevedioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomevedioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomevedioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
