import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingTickerSummaryCardComponent } from './loading-ticker-summary-card.component';

describe('LoadingTickerSummaryCardComponent', () => {
  let component: LoadingTickerSummaryCardComponent;
  let fixture: ComponentFixture<LoadingTickerSummaryCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingTickerSummaryCardComponent]
    });
    fixture = TestBed.createComponent(LoadingTickerSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
