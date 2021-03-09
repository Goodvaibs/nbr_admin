import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GallimagComponent } from './gallimag.component';

describe('GallimagComponent', () => {
  let component: GallimagComponent;
  let fixture: ComponentFixture<GallimagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GallimagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GallimagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
