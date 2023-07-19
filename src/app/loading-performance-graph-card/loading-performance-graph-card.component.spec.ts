import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPerformanceGraphCardComponent } from './loading-performance-graph-card.component';

describe('LoadingPerformanceGraphCardComponent', () => {
  let component: LoadingPerformanceGraphCardComponent;
  let fixture: ComponentFixture<LoadingPerformanceGraphCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingPerformanceGraphCardComponent]
    });
    fixture = TestBed.createComponent(LoadingPerformanceGraphCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
