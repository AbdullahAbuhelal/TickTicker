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
      tickerQuote = JSON.parse(JSON.stringify(data))["Global Quote"];
    } catch (e) {}

    // subscribe(
    //   (data) => {
    //     try {
    //       tickerQuote = JSON.parse(JSON.stringify(data))["Global Quote"];
    //     } catch (e) {}
    //   },
    //   (error) => {}
    // )
    return tickerQuote
  }

  async getStockPrice(ticker: string) {
    let summary = await this.getStockSummary(ticker)
    return summary["05. price"] ?? NaN
  }

  constructor(
    private http: HttpClient
  ) { }
}
