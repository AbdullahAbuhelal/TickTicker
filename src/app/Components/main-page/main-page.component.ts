import {Component} from '@angular/core';
import {SavedTickersService} from "../../services/saved-tickers/saved-tickers.service";
import {StockApiService} from "../../services/stock-api/stock-api.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  constructor(
    private favoriteTickersService: SavedTickersService,
    private stockApiService: StockApiService
    ) {}

  savedTickers: {symbol: string, price: number}[] = []

  isLoadingTiles= true;
  isThereFavorites = false;

  ngOnInit() {
    this.favoriteTickersService.getFavoriteTickers().subscribe(
      (savedTickersList) => {
        this.savedTickers = []
        this.isLoadingTiles = savedTickersList.length != 0;
        this.isThereFavorites = savedTickersList.length > 0;
        savedTickersList.forEach(async (tickerSymbol: any)  => {
          this.isLoadingTiles = true
          this.savedTickers.push({
            symbol: tickerSymbol,
            price: await this.stockApiService.getStockPrice(tickerSymbol)
          })
          this.isLoadingTiles = false
        })
      }
    )
  }
}
