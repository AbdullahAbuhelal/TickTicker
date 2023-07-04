import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickerTileComponent } from './ticker-tile.component';

describe('TickerTileComponent', () => {
  let component: TickerTileComponent;
  let fixture: ComponentFixture<TickerTileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TickerTileComponent]
    });
    fixture = TestBed.createComponent(TickerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
