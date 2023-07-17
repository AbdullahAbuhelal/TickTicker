import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingTickerTileComponent } from './loading-ticker-tile.component';

describe('LoadingTickerTileComponent', () => {
  let component: LoadingTickerTileComponent;
  let fixture: ComponentFixture<LoadingTickerTileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingTickerTileComponent]
    });
    fixture = TestBed.createComponent(LoadingTickerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
