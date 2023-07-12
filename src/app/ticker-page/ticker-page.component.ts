import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { tickerPriceTimeSeriesStamp, tickerQuoteEndpoint} from "../ticker";
import {data} from "autoprefixer";
import {firstValueFrom} from "rxjs";

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

  tickerTimeSeriesIntraday  = {
    "Meta Data": [],
    "Time Series (5min)": []
  }
  tickerTimeSeriesWeekly = {
    "Meta Data": [],
    "Weekly Time Series": []
  }
  tickerTimeSeriesMonthly = {
    "Meta Data": [],
    "Monthly Time Series": []
  }

  isIntradayLoaded = false;
  isWeeklyLoaded = false;
  isMonthlyLoaded = false;

  graphPoints: {}[] = []

  isTickerSaved = false;
  saveStroke = "currentColor";
  saveFill = "none";
  saveStatement = "Save";

  savedTickersList: string[]= []

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

    // this.extractIntradaySeries();
    this.getTimeSeries("Intraday", this.tickerSymbol).then(() => {
      console.log("Done waiting")
      this.extractCoordinatesFromTimeSeries(this.tickerTimeSeriesIntraday["Time Series (5min)"], "Intraday")
    });

  //   TODO: check if the ticker saved in storage
    this.savedTickersList = JSON.parse(`${localStorage.getItem('savedTickersList')}`)
    let tickerFind = this.savedTickersList.find((symbol) => symbol==this.tickerSymbol);
    this.isTickerSaved = typeof tickerFind != "undefined";
    if (this.isTickerSaved) {
      this.saveTickerStyle();
    }
    console.log("saved list", this.savedTickersList, this.isTickerSaved, tickerFind);
  }

  async onTickerTypeReceived(type: string) {
    if (type=="Intraday") {
      if (!this.isIntradayLoaded) {
        console.log(type, "is not loaded")
        await this.getTimeSeries(type, this.tickerSymbol);
        console.log("done waiting", type)
      }
      this.extractCoordinatesFromTimeSeries(this.tickerTimeSeriesIntraday["Time Series (5min)"], "Intraday");
    } else if (type == "Weekly") {
      if (!this.isWeeklyLoaded) {
        console.log(type, "is not loaded")
        await this.getTimeSeries(type, this.tickerSymbol);
        console.log("done waiting", type)
      }
      this.extractCoordinatesFromTimeSeries(this.tickerTimeSeriesWeekly["Weekly Time Series"], "Weekly");
    } else {
      if (!this.isMonthlyLoaded) {
        console.log(type, "is not loaded")
        await this.getTimeSeries(type, this.tickerSymbol);
        console.log("done waiting", type)
      }
      this.extractCoordinatesFromTimeSeries(this.tickerTimeSeriesMonthly["Monthly Time Series"], "Monthly");
    }
  }

  async getTimeSeries(type: string, symbol: string | null) {
    let fun = (type=="Intraday")? "TIME_SERIES_INTRADAY" :
      (type=="Monthly")? "TIME_SERIES_MONTHLY" :
    "TIME_SERIES_WEEKLY";
    let url = `https://www.alphavantage.co/query?function=${fun}&symbol=${symbol}&apikey=${environment.APIKEY}`;
    if (type=="Intraday") url +="&interval=5min";
    console.log("url before calling")
    console.log(url)
    try {
      let observableTS = this.http.get(url);
      let timeSeriesObject = await firstValueFrom(observableTS)
      let timeSeries = JSON.parse(JSON.stringify(timeSeriesObject))

      console.log("time series after fetching", timeSeries)

      if (type=="Intraday") {
        this.tickerTimeSeriesIntraday = timeSeries;
        this.isIntradayLoaded = true;
      } if(type=="Weekly") {
        this.tickerTimeSeriesWeekly = timeSeries;
        this.isWeeklyLoaded = true;
      } if (type=="Monthly") {
        this.tickerTimeSeriesMonthly = timeSeries;
        this.isMonthlyLoaded = true;
      }
    } catch (e) {
      console.log("Cannot fetch time series", e)
    }


  }

  extractIntradaySeries() {
    let intradaySeriesUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.tickerSymbol}&interval=5min&apikey=${environment.APIKEY}`;

    this.http.get(intradaySeriesUrl).subscribe(
      (data) => {
        this.tickerTimeSeriesIntraday = JSON.parse(JSON.stringify(data));
        console.log(this.tickerTimeSeriesIntraday);
        this.getTimeSeries("Intraday", "AAPL");
        this.extractCoordinatesFromTimeSeries(this.tickerTimeSeriesIntraday["Time Series (5min)"], "Intraday");
      },
      (error) => {
        console.log('something went wrong');
        console.log(error.toString());
      }
    )
  }



  extractCoordinatesFromTimeSeries(timeSeries: never[] | Object, type: string ) {
    this.graphPoints = [];

    for (const [key, value] of Object.entries(timeSeries)) {
      let newDate: Date = new Date();
      if (type=="Intraday"){
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

        newDate = new Date(year, month, day, hours, minutes, seconds);
      } else {
        const dateString = key;
        const dateParts = dateString.split("-");
        const year = +dateParts[0];
        const month = +dateParts[1] - 1;
        const day = +dateParts[2];
        newDate = new Date(year, month, day);
      }
      this.graphPoints.push({x: newDate, y: Number(value["1. open"])});
    }
    console.log("graph points",this.graphPoints)
  }

  onTickerSave() {
    if (this.isTickerSaved) {
    //   remove the ticker from the saved list
      this.removeTickerStyle();
      let tickerIndex = this.savedTickersList.indexOf(`${this.tickerSymbol}`);
      this.savedTickersList.splice(tickerIndex);
    } else {
      // save ticker
      this.saveTickerStyle();
      this.savedTickersList.push(`${this.tickerSymbol}`);
    }
    localStorage.setItem("savedTickersList", JSON.stringify(this.savedTickersList));
    this.isTickerSaved = !this.isTickerSaved
  }

  saveTickerStyle() {
    this.saveFill = "currentColor";
    this.saveStroke = "none";
    this.saveStatement = "Saved";
  }
  removeTickerStyle() {
    this.saveFill = "none";
    this.saveStroke = "currentColor";
    this.saveStatement = "Save";
  }
}

