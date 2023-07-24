import {Component} from '@angular/core';
import { environment } from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import { firstValueFrom, map, Observable } from "rxjs";
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import { TranslocoService } from '@ngneat/transloco';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isDark = false;
  isDarkIconSrc = "assets/icons/icon _moon_.svg";
  iconStyles = {'width.px':25, 'height.px':25};

  searchKeyword = "";

  constructor(private http: HttpClient, private router: Router, private translocoService: TranslocoService) {}
  onDarkModeClicked() {
    let newTheme = (this.getTheme()=="light")? "dark" : "light"
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem(this.themeKey, newTheme)
    console.log(newTheme)
  }


  searchTickerObservable!: Observable<any>
  searchFormControl = new FormControl("");

  ngOnInit() {
    if (this.getLanguage()=="ar") this.changeLanguageToArabic();
    if (this.getTheme()=="dark") this.onDarkModeClicked();
  }

  onSearchKeyUp(value: string) {
    // TODO: move this to 'ngOnInit' [I could not make it work so I did it this way]
    this.searchKeyword = value;
    let searchUrl = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + value +"&apikey=" + environment.APIKEY;
    this.searchTickerObservable = this.http.get(searchUrl).pipe(
      map(res => {
        console.log("start mapping")
        let searchObject = JSON.parse(JSON.stringify(res)).bestMatches;
        console.log(searchObject)
        return searchObject.map((data: any) => ({symbol: data["1. symbol"], name: data["2. name"]}))
      })
    );
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

  themeKey = "theme"
  private getTheme() {
    return localStorage.getItem(this.themeKey) ?? "light"
  }
}
