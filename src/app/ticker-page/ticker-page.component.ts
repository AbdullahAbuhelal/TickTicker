import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ticker-page',
  templateUrl: './ticker-page.component.html',
  styleUrls: ['./ticker-page.component.css']
})
export class TickerPageComponent {
  constructor(private route: ActivatedRoute) { }

  tickerSymbol: string | null = "";

  ngOnInit() {
    // First get the product id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    this.tickerSymbol = routeParams.get('tickerSymbol');
    console.log(this.tickerSymbol);
  }
}
