import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FavoriteTickersService {

  FavoriteTickersKey = 'savedTickersList'
  savedList: string[]

  private dynamicList = new BehaviorSubject<string[]>(this.getList())

  private getList() {
    return this.savedList
  }

  getFavoriteTickers() {
    return this.dynamicList.asObservable()
  }

  isTickerSaved(ticker: string) {
    let tickerFind = this.savedList.find((symbol) => symbol==ticker);
    return typeof tickerFind != "undefined";
  }

  removeTicker(ticker: string) {
    let tickerIndex = this.savedList.indexOf(ticker);
    this.savedList.splice(tickerIndex, 1);
    this.updateStorage()
    this.dynamicList.next(this.savedList)
  }

  addTicker(ticker: string) {
    this.savedList.push(ticker)
    this.updateStorage()
    this.dynamicList.next(this.savedList)
  }

  private updateStorage() {
    localStorage.setItem("savedTickersList", JSON.stringify(this.savedList))
  }

  constructor() {
    this.savedList = JSON.parse(`${localStorage.getItem(this.FavoriteTickersKey)}`) ?? []
    this.dynamicList.next(this.savedList)
  }
}
