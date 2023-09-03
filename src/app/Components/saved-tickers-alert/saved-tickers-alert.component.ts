import { Component } from '@angular/core';
import {SavedTickersService} from "../../services/saved-tickers/saved-tickers.service";

@Component({
  selector: 'app-saved-tickers-alert',
  templateUrl: './saved-tickers-alert.component.html',
  styleUrls: ['./saved-tickers-alert.component.css']
})
export class SavedTickersAlertComponent {
  isSavedAlertShowed = false;
  isRemovedAlertShowed = false;
  tickerSymbol = "";
  private isFirstLaunch = true

  ngOnInit() {
    this.savedTickerService.getSavedTicker().subscribe(
      newTicker => {
        if (!this.isFirstLaunch){
          this.isSavedAlertShowed = true
          this.tickerSymbol = newTicker
          this.hideAlertAfterTwoSeconds()
        }
      }
    )
    this.savedTickerService.getRemovedTicker().subscribe(
      removedTicker => {
        if (!this.isFirstLaunch){
          this.isRemovedAlertShowed = true
          this.tickerSymbol = removedTicker
          this.hideAlertAfterTwoSeconds()
        }
      }
    )
    this.isFirstLaunch = false
  }

  private hideAlertAfterTwoSeconds() {
    setTimeout(()=> {
      this.isSavedAlertShowed = false;
      this.isRemovedAlertShowed = false;
    }, 2000)
  }

  constructor(private savedTickerService: SavedTickersService) {
  }

}
