import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-ticker-performance-card',
  templateUrl: './ticker-performance-card.component.html',
  styleUrls: ['./ticker-performance-card.component.css']
})
export class TickerPerformanceCardComponent {
  @Input({
    required: true
  }) chartOptions = {};

  @Output() dataEvent = new EventEmitter<string>();


  currentChartType = "Intraday";
  chartTypes = [
    "Intraday",
    "Weekly",
    "Monthly",
  ]

  onClick(input: string) {
    this.currentChartType = input;
    this.dataEvent.emit(input);
  }

}
