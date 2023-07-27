import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteTickersService {

  FavoriteTickersKey = 'savedTickersList'
  savedList: string[]

  getFavoriteTickers() {
    return this.savedList
  }

  isTickerSaved(ticker: string) {
    let tickerFind = this.savedList.find((symbol) => symbol==ticker);
    return typeof tickerFind != "undefined";
  }

  removeTicker(ticker: string) {
    let tickerIndex = this.savedList.indexOf(ticker);
    this.savedList.splice(tickerIndex, 1);
    this.updateStorage()
  }

  addTicker(ticker: string) {
    this.savedList.push(ticker)
    this.updateStorage()
  }

  private updateStorage() {
    localStorage.setItem("savedTickersList", JSON.stringify(this.savedList))
  }

  constructor() {
    this.savedList = JSON.parse(`${localStorage.getItem(this.FavoriteTickersKey)}`) ?? []
  }
}
