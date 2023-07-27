import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteTickersService {

  FavoriteTickersKey = 'savedTickersList'
  savedList = []
  getFavoriteTickers() {
    if (this.savedList.length == 0) this.savedList = JSON.parse(`${localStorage.getItem(this.FavoriteTickersKey)}`) ?? []
    return this.savedList
  }

  constructor() { }
}
