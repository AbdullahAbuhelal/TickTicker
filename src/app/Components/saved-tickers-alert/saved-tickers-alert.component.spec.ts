import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTickersAlertComponent } from './saved-tickers-alert.component';

describe('SavedTickersAlertComponent', () => {
  let component: SavedTickersAlertComponent;
  let fixture: ComponentFixture<SavedTickersAlertComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedTickersAlertComponent]
    });
    fixture = TestBed.createComponent(SavedTickersAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
