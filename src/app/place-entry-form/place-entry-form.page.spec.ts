import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceEntryFormPage } from './place-entry-form.page';

describe('PlaceEntryFormPage', () => {
  let component: PlaceEntryFormPage;
  let fixture: ComponentFixture<PlaceEntryFormPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PlaceEntryFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
