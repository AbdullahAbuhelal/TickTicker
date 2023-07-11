import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TickerTileComponent } from './ticker-tile/ticker-tile.component';
import {AngularSvgIconModule} from "angular-svg-icon";
import {HttpClientModule} from "@angular/common/http";
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from "@angular/router";
import { TickerPageComponent } from './ticker-page/ticker-page.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { TickerPerformanceCardComponent } from './ticker-performance-card/ticker-performance-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TickerTileComponent,
    MainPageComponent,
    TickerPageComponent,
    TickerPerformanceCardComponent
  ],
    imports: [
        BrowserModule,
        AngularSvgIconModule,
        HttpClientModule,
        AngularSvgIconModule.forRoot(),
        RouterModule.forRoot([
          {path: '', component: MainPageComponent},
          {path: 'tickers/:tickerSymbol', component: TickerPageComponent},
        ]),
      CanvasJSAngularChartsModule,
      BrowserAnimationsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
