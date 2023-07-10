import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {tickerPriceTimeSeriesStamp, tickerQuoteEndpoint} from "../ticker";
import {data} from "autoprefixer";

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

  tickerPrice = 0;
  tickerHigh = 0;
  tickerLow = 0;

  tickerTimeSeriesIntraday = {
    "Meta Data": [],
    "Time Series (5min)": []
  }

  graphPoints: {}[] = []

  chartOptions = {
    theme: "light2",
    animationEnabled: true,
    zoomEnabled: true,
    title: {
      text: "Ticker Performance"
    },
    data: [{
      type: "line",
      xValueFormatString: "YYYY MM DD hh:mm",
      yValueFormatString: "$#,###.##",
      dataPoints: this.graphPoints
    }]

  }

  ngOnInit() {
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    this.tickerSymbol = routeParams.get('tickerSymbol');

    let quoteUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.tickerSymbol}&apikey=${environment.APIKEY}`


    this.http.get(quoteUrl).subscribe(
      (data) => {

        this.tickerQuote = JSON.parse(JSON.stringify(data))["Global Quote"];
        console.log(this.tickerQuote);
        this.tickerPrice = this.tickerQuote["05. price"];
        this.tickerHigh = this.tickerQuote["03. high"];
        this.tickerLow = this.tickerQuote["04. low"];
      },
      (error) => {
        console.log('something went wrong')
        console.log(error.toString());
      }
    )

    this.extractIntradaySeries();

  }

  extractIntradaySeries() {
    let intradaySeriesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.tickerSymbol}&interval=5min&apikey=${environment.APIKEY}`;

    this.http.get(intradaySeriesUrl).subscribe(
      (data) => {
        this.tickerTimeSeriesIntraday = JSON.parse(JSON.stringify(data));
        console.log(this.tickerTimeSeriesIntraday);
        this.extractCoordinatesFromTimeSeries(this.tickerTimeSeriesIntraday["Time Series (5min)"]);
      },
      (error) => {
        console.log('something went wrong');
        console.log(error.toString());
      }
    )
  }

  extractCoordinatesFromTimeSeries(timeSeries: never[]) {
    for (const [key, value] of Object.entries(timeSeries)) {
      const dateString = key;
      const dateParts = dateString.split(" ");
      const date = dateParts[0];
      const time = dateParts[1];

      const datePartsArray = date.split("-");
      const year = +datePartsArray[0];
      const month = +datePartsArray[1] - 1;
      const day = +datePartsArray[2];

      const timePartsArray = time.split(":");
      const hours = +timePartsArray[0];
      const minutes = +timePartsArray[1];
      const seconds = +timePartsArray[2];

      const newDate = new Date(year, month, day, hours, minutes, seconds);
      // console.log(newDate);
      this.graphPoints.push({x: newDate, y: Number(value["1. open"])});

    }
    console.log(this.graphPoints)
  }
}
