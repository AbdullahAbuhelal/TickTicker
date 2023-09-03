import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SavedTickersService {

  savedTickersKey = 'savedTickersList'
  savedList: string[]

  private dynamicList = new BehaviorSubject<string[]>(this.getList())
  private removedTicker = new BehaviorSubject<string>("")
  private savedTicker = new BehaviorSubject<string>("")

  private getList() {
    return this.savedList
  }

  getFavoriteTickers() {
    return this.dynamicList.asObservable()
  }
  getSavedTicker() {
    return this.savedTicker.asObservable()
  }
  getRemovedTicker() {
    return this.removedTicker.asObservable()
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
    this.removedTicker.next(ticker)
  }

  addTicker(ticker: string) {
    this.savedList.push(ticker)
    this.updateStorage()
    this.dynamicList.next(this.savedList)
    this.savedTicker.next(ticker)
  }

  private updateStorage() {
    localStorage.setItem("savedTickersList", JSON.stringify(this.savedList))
  }

  constructor() {
    this.savedList = JSON.parse(`${localStorage.getItem(this.savedTickersKey)}`) ?? []
    this.dynamicList.next(this.savedList)
  }
}
