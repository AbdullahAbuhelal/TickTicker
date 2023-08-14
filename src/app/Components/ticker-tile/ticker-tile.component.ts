import {Component, Input} from '@angular/core';
import {SavedTickersService} from "../../services/saved-tickers/saved-tickers.service";

@Component({
  selector: 'app-ticker-tile',
  templateUrl: './ticker-tile.component.html',
  styleUrls: ['./ticker-tile.component.css']
})
export class TickerTileComponent {
  @Input()
  tickerPrice = 0;
  @Input()
  tickerSymbol: string | undefined;
  protected readonly isNaN = isNaN;

  constructor(
    private favoriteTickerService: SavedTickersService
  ) {
  }

  onRemoveTickerClick() {
    this.favoriteTickerService.removeTicker(this.tickerSymbol || "")
  }
}
