import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tickerQuoteEndpoint} from "../../ticker";
import {Chart} from "chart.js/auto";
import 'chartjs-adapter-luxon';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);
import { TranslocoService } from '@ngneat/transloco';
import {ThemeService} from "../../services/theme/theme.service";
import {SavedTickersService} from "../../services/saved-tickers/saved-tickers.service";
import {StockApiService} from "../../services/stock-api/stock-api.service";


@Component({
  selector: 'app-ticker-page',
  templateUrl: './ticker-page.component.html',
  styleUrls: ['./ticker-page.component.css']
})
export class TickerPageComponent {
  private isDark = false;
  constructor(
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
    private themeService: ThemeService,
    private favoriteTickerService: SavedTickersService,
    private stockApiService: StockApiService
  ) {}


  tickerSymbol: string = "";

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
  graphLoaded = false

  isTickerSaved = false;
  saveStroke = "currentColor";
  saveFill = "none";
  saveStatement = "Save";

  isSavedAlertShowed = false;
  isRemovedAlertShowed = false;

  // err handling
  isSummaryFailed = false;
  isChartFailed = false;

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

  async ngOnInit() {
    // First get the ticker id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    this.tickerSymbol = (routeParams.get('tickerSymbol') ?? "").toUpperCase();

    // Get the summary for the stock
    let fullSummary = await this.stockApiService.getStockSummary(this.tickerSymbol)
    this.tickerPrice = fullSummary["05. price"];
    this.tickerHigh = fullSummary["03. high"];
    this.tickerLow = fullSummary["04. low"];
    this.isSummaryLoading = false
    this.isSummaryFailed = isNaN(this.tickerPrice)


    this.getTimeSeries("Intraday", this.tickerSymbol).then(() => {
    this.extractCoordinatesFromTimeSeriesJS(this.tickerTimeSeriesIntraday["Time Series (5min)"], "Intraday")
    });

  //  check if the ticker saved in storage
    this.isTickerSaved = this.favoriteTickerService.isTickerSaved(this.tickerSymbol)
    if (this.isTickerSaved) {
      this.saveTickerStyle();
    }

  //   keep track of the theme changing
    this.themeService.getCurrentTheme().subscribe(
      newThem => {
        this.isDark = (newThem == 'dark')
        if (this.graphLoaded) {
          this.chart.destroy()
          this.createChart()
        }
      }
    )

  }

  async onTickerTypeReceived(type: string) {
    switch (type) {
      case ("خلال اليوم"):
        type = this.chartTypes[0]
        break;
      case ("اسبوعي"):
        type = this.chartTypes[1]
        break;
      case ("شهري"):
        type = this.chartTypes[2]
        break;
    }
    this.currentChartType = type;
    if (type=="Intraday") {
      if (!this.isIntradayLoaded) {
        console.log(type, "is not loaded")
        await this.getTimeSeries(type, this.tickerSymbol);
        console.log("done waiting", type)
      }
      this.extractCoordinatesFromTimeSeriesJS(this.tickerTimeSeriesIntraday["Time Series (5min)"], "Intraday");
    } else if (type == "Weekly") {
      if (!this.isWeeklyLoaded) {
        console.log(type, "is not loaded")
        await this.getTimeSeries(type, this.tickerSymbol);
        console.log("done waiting", type)
      }
      this.extractCoordinatesFromTimeSeriesJS(this.tickerTimeSeriesWeekly["Weekly Time Series"], "Weekly");
    } else {
      if (!this.isMonthlyLoaded) {
        console.log(type, "is not loaded")
        await this.getTimeSeries(type, this.tickerSymbol);
        console.log("done waiting", type)
      }
      this.extractCoordinatesFromTimeSeriesJS(this.tickerTimeSeriesMonthly["Monthly Time Series"], "Monthly");
    }
  }

  async getTimeSeries(type: string, symbol: string | null) {
    this.isGraphLoading = true;

    let timeSeries = await this.stockApiService.getTimeSeries(type, symbol)

    let isFailed = typeof timeSeries === 'undefined'
    if (!isFailed) {
      if (type == "Intraday") {
        this.tickerTimeSeriesIntraday = timeSeries;
        this.isIntradayLoaded = true;
      }
      if (type == "Weekly") {
        this.tickerTimeSeriesWeekly = timeSeries;
        this.isWeeklyLoaded = true;
      }
      if (type == "Monthly") {
        this.tickerTimeSeriesMonthly = timeSeries;
        this.isMonthlyLoaded = true;
      }
    }
    this.isGraphLoading = false
    this.isChartFailed = isFailed
  }


  onTickerSave() {
    if (this.isTickerSaved) {
    //   remove the ticker from the saved list
      this.removeTickerStyle();
      this.favoriteTickerService.removeTicker(this.tickerSymbol)
    } else {
      // save ticker
      this.saveTickerStyle();
      this.favoriteTickerService.addTicker(this.tickerSymbol);
    }
    this.isTickerSaved = !this.isTickerSaved

    this.isSavedAlertShowed = this.isTickerSaved
    this.isRemovedAlertShowed = !this.isTickerSaved
    setTimeout(()=> {
      this.isSavedAlertShowed = false;
      this.isRemovedAlertShowed = false;
    }, 2000)
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

//   chartjs
  chartTypes = ["Intraday", "Weekly", "Monthly"]
  currentChartType = this.chartTypes[0];

  chartPoints: {xs: any[], ys: number[]} = {
    xs: [],
    ys: []
  }

  chart: any
  isSummaryLoading = true;
  isGraphLoading = true;
  createChart(){
    this.chart = new Chart("performanceGraph", {
      type: 'line',

      data: {
        labels: this.chartPoints.xs,
        datasets: [
          {
            label: this.translocoService.translate('ticker.price'),
            data: this.chartPoints.ys,
            backgroundColor: this.isDark? "#91C8E4" : "#1D5D9B",
            borderColor: this.isDark? "#91C8E4" : "#1D5D9B",
            pointBackgroundColor: 'transparent', // set point background color to transparent
            pointBorderColor: 'transparent', // set point border color to transparent
            borderWidth: 1
          }
        ]
      },
      options: {
        color: this.isDark? "#FFFFFF" : "",
        scales: {
          x: {
            type: "time",
            grid: {
              color: this.isDark? "#5d5e5f" : "#e3e3e3",
            }
          },
          y: {
            grid: {
              color: this.isDark? "#5d5e5f" : "#e3e3e3",
            }
          }
        },
        plugins: {
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            }
          }
        }

      },
    });
  }

  extractCoordinatesFromTimeSeriesJS(timeSeries: never[] | Object, type: string ) {
    try {

      this.chartPoints.xs = [];
      this.chartPoints.ys = [];
      if (this.graphLoaded) {
        this.chart.destroy()
      }
      this.graphLoaded = true
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
        this.chartPoints.xs.push(newDate);
        this.chartPoints.ys.push(Number(value["1. open"]));
      }
      console.log("chart points",this.chartPoints)
      this.createChart()

    } catch (e) {
      this.isChartFailed = true;
    }
  }


  resetGraph() {
    this.chart.resetZoom();
  }
}
