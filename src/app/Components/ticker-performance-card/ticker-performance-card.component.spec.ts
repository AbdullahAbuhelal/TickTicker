import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerPerformanceCardComponent } from './ticker-performance-card.component';

describe('TickerPerformanceCardComponent', () => {
  let component: TickerPerformanceCardComponent;
  let fixture: ComponentFixture<TickerPerformanceCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TickerPerformanceCardComponent]
    });
    fixture = TestBed.createComponent(TickerPerformanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
