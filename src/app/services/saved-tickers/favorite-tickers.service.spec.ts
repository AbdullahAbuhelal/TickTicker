import { TestBed } from '@angular/core/testing';

import { SavedTickersService } from './saved-tickers.service';

describe('FavoriteTickersService', () => {
  let service: SavedTickersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedTickersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
