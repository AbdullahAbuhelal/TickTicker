import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadinTickerSummaryCardComponent } from './loadin-ticker-summary-card.component';

describe('LoadinTickerSummaryCardComponent', () => {
  let component: LoadinTickerSummaryCardComponent;
  let fixture: ComponentFixture<LoadinTickerSummaryCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadinTickerSummaryCardComponent]
    });
    fixture = TestBed.createComponent(LoadinTickerSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
