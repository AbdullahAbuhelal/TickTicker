import {Component} from '@angular/core';
import { environment } from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {debounceTime, firstValueFrom, map, Observable, startWith} from "rxjs";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import { TranslocoService } from '@ngneat/transloco';
import {ThemeService} from "../services/theme.service";
import {StockApiService} from "../services/stock-api.service";



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isDark = false;

  searchKeyword = "";

  constructor(
    private http: HttpClient,
    private router: Router,
    private translocoService: TranslocoService,
    private themeService: ThemeService,
    private stockApiService: StockApiService
  ) {}



  searchTickerObservable!: Observable<any>
  searchFormControl = new FormControl("");

  ngOnInit() {
    if (this.getLanguage()=="ar") this.changeLanguageToArabic();
    let theme = this.themeService.getCurrentTheme().subscribe(
      value => {
        this.isDark = (value == 'dark')
      }
    )

    this.searchFormControl.valueChanges
      .pipe(
      debounceTime(500),
    ).subscribe(
      keyword => {
        console.log("value is ", keyword)
        this.searchTickerObservable = this.stockApiService.getSearchResult(keyword || "")
      }
    )
  }

  navigateToTicker(symbol: string) {
    this.router.navigateByUrl("/").then(
      () => this.router.navigate(["/tickers", symbol])
    )
  }

  onChangeLanguage() {
    let activeLanguage = this.translocoService.getActiveLang()
    console.log(activeLanguage)
    if (activeLanguage=='ar') {
      this.changeLanguageToEnglish();
    } else {
      this.changeLanguageToArabic();
    }
  }

  private changeLanguageToEnglish() {
    this.translocoService.setActiveLang('en')
    localStorage.setItem(this.languageKey, 'en')
    document.documentElement.removeAttribute('dir')
  }

  private changeLanguageToArabic() {
    this.translocoService.setActiveLang('ar')
    localStorage.setItem(this.languageKey, 'ar')
    document.documentElement.setAttribute('dir', 'rtl')
  }

  languageKey = "lan";
  getLanguage() {
    return localStorage.getItem(this.languageKey) || navigator.language;
  }

  switchTheme(newTheme: string) {
    this.themeService.switchTheme(newTheme)
  }

}
