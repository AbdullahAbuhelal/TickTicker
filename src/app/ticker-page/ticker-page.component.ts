import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {tickerQuoteEndpoint} from "../ticker";

@Component({
  selector: 'app-ticker-page',
  templateUrl: './ticker-page.component.html',
  styleUrls: ['./ticker-page.component.css']
})
export class TickerPageComponent {
  // constructor() { }
  constructor(private http: HttpClient, private route: ActivatedRoute) {}


  tickerSymbol: string | null = "";

  tickerQuote: tickerQuoteEndpoint = {
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

  ngOnInit() {
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    this.tickerSymbol = routeParams.get('tickerSymbol');

    let searchUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.tickerSymbol}&apikey=${environment.APIKEY}`


    this.http.get(searchUrl).subscribe(
      (data) => {

        this.tickerQuote = JSON.parse(JSON.stringify(data))["Global Quote"];
        console.log(this.tickerQuote);

      },
      (error) => {
        console.log('something went wrong')
        console.log(error.toString());
      }
    )
  }
}
