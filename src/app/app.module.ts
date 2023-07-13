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
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ReactiveFormsModule} from "@angular/forms";

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
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
