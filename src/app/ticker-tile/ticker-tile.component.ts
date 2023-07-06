import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-ticker-tile',
  templateUrl: './ticker-tile.component.html',
  styleUrls: ['./ticker-tile.component.css']
})
export class TickerTileComponent {
  @Input()
  tickerName = "";
  @Input()
  tickerPrice= 0;
  @Input()
  tickerSymbol: string | undefined;
}
