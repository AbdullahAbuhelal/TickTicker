import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {firstValueFrom, map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {tickerQuoteEndpoint} from "../../ticker";

@Injectable({
  providedIn: 'root'
})
export class StockApiService {

  getSearchResult(keyword: string) {
    let searchUrl = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + keyword +"&apikey=" + environment.APIKEY;
    if (keyword.length > 0)
    return this.http.get(searchUrl).pipe(
      map(res => {
        let bestMatches: [] = JSON.parse(JSON.stringify(res)).bestMatches ?? []
        return bestMatches.map((data: any) => ({
            symbol: data["1. symbol"],
            name: data["2. name"]
          }))
      })
    );
    else
      return new Observable<any>
  }

  async getStockSummary(ticker: string) {
    let quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${environment.APIKEY}`
    let tickerQuote: tickerQuoteEndpoint = {
      "01. symbol": "",
      "02. open": NaN,
      "03. high": NaN,
      "04. low": NaN,
      "05. price": NaN,
      "06. volume": 0,
      "07. latest trading day": new Date(),
      "08. previous close": 0,
      "09. change": 0,
      "10. change percent": 0
    };
    let getObservable = this.http.get(quoteUrl)
    let data = await firstValueFrom(getObservable)
    try {
      let tmpTickerQuote = JSON.parse(JSON.stringify(data))["Global Quote"];
      if (tmpTickerQuote != undefined) tickerQuote = tmpTickerQuote
    } catch (e) {}
    return tickerQuote
  }

  async getStockPrice(ticker: string) {
    let summary = await this.getStockSummary(ticker)
    return summary["05. price"] ?? NaN
  }

  /**
   * get the time series for a certain stock
   *
   * @param type - one of three types [Intraday, Weekly, and Monthly]
   * @param symbol - the stock ticker symbol
   * @return a JSON formatted time series of the stock prices, if it cannot get the time series it will return undefined object
   * **/
  async getTimeSeries(type: string, symbol: string | null) {
    // this.isGraphLoading = true;
    // console.log("graph by id", document.getElementById("performanceGraph"))
    let fun = (type=="Intraday")? "TIME_SERIES_INTRADAY" :
      (type=="Monthly")? "TIME_SERIES_MONTHLY" :
        "TIME_SERIES_WEEKLY";
    let url = `https://www.alphavantage.co/query?function=${fun}&symbol=${symbol}&apikey=${environment.APIKEY}`;
    if (type=="Intraday") url +="&interval=5min";
    try {
      let observableTS = this.http.get(url);
      let timeSeriesObject = await firstValueFrom(observableTS)
      return  JSON.parse(JSON.stringify(timeSeriesObject))

    } catch (e) {
      console.log("Cannot fetch time series", e)
      return undefined
      // this.isChartFailed = true;
    }
    // this.isGraphLoading = false;
  }

  constructor(
    private http: HttpClient
  ) { }
}
