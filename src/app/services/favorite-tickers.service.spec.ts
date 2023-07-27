import { TestBed } from '@angular/core/testing';

import { FavoriteTickersService } from './favorite-tickers.service';

describe('FavoriteTickersService', () => {
  let service: FavoriteTickersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteTickersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
