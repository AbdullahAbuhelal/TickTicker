import {Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {debounceTime, Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {StockApiService} from "../services/stock-api.service";

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SearchbarComponent {

  noResult = false;
  isMenuShown = false;
  searchTickerObservable!: Observable<any>
  searchFormControl = new FormControl("");

  @Output() notifyNavigated = new EventEmitter()

  navigateToTicker(symbol: string) {
    if (symbol!="") {
      this.router.navigateByUrl("/").then(
        () => this.router.navigate(["/tickers", symbol])
      )
      this.notifyNavigated.emit()
    }
    this.isMenuShown = false
  }

  ngOnInit() {
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(500),

      ).subscribe(
      keyword => {
        this.searchTickerObservable = this.stockApiService.getSearchResult(keyword || "")
        this.searchTickerObservable.subscribe(value => {
          this.noResult = value.length == 0
        })
        this.noResult = keyword?.length == 0
        this.isMenuShown = keyword?.length != 0 || keyword == null
      }
    )

  }

  constructor(
    private router: Router,
    private stockApiService: StockApiService
  ) {
  }
}
