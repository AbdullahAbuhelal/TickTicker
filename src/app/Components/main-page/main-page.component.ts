import {Component, Input} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {tickerQuoteEndpoint} from "../../ticker";
import {SavedTickersService} from "../../services/saved-tickers/saved-tickers.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  constructor(
    private http: HttpClient,
    private favoriteTickersService: SavedTickersService
    ) {}

  savedTickers: {symbol: string, price: number}[] = []

  isLoadingTiles= true;
  isThereFavorites = false;

  private loadedList: string[] = []


  ngOnInit() {
    // let savedTickersList : any = []

    this.favoriteTickersService.getFavoriteTickers().subscribe(
      (savedTickersList) => {
        this.savedTickers = []
        if (savedTickersList.length == 0) this.isLoadingTiles = false;
        this.isThereFavorites = savedTickersList.length > 0;
        // GET tickers quotes
        savedTickersList.forEach((tickerSymbol: any)  => {
          let tickerIndex = this.loadedList.indexOf(tickerSymbol??"")
          if (tickerIndex==(-1))  {

            let quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${tickerSymbol}&apikey=${environment.APIKEY}`
            let tickerQuote: tickerQuoteEndpoint = {
              "01. symbol": "",
              "02. open": 0,
              "03. high": 0,
              "04. low": 0,
              "05. price": 0,
              "06. volume": 0,
              "07. latest trading day": new Date(),
              "08. previous close": 0,
              "09. change": 0,
              "10. change percent": 0
            };
            this.isLoadingTiles = true

            this.http.get(quoteUrl).subscribe(
              (data) => {
                try {
                  tickerQuote = JSON.parse(JSON.stringify(data))["Global Quote"];
                  let tickerPrice = tickerQuote["05. price"];
                  this.savedTickers.push({symbol: tickerSymbol, price: tickerPrice})
                  this.isLoadingTiles = false
                } catch (e) {
                  this.savedTickers.push({symbol: tickerSymbol, price: NaN})
                  this.isLoadingTiles = false
                }
              },
              (error) => {
                console.log('something went wrong')
                console.log(error.toString());
                this.savedTickers.push({symbol: tickerSymbol, price: NaN})
              }
            )

          }

        })

      }
    )


    // this.isLoadingTiles = false;

  }
}
