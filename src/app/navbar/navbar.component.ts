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
    document.body.classList.toggle('dark-mode');
    this.isDarkIconSrc = (this.isDark)? "assets/icons/icon _moon_.svg": "assets/icons/icon _sun 1_.svg";
    this.isDark = !this.isDark;
  }


  searchTickerObservable!: Observable<any>
  searchFormControl = new FormControl("");

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
      this.translocoService.setActiveLang('en')
      document.documentElement.removeAttribute('dir')
    } else {
      this.translocoService.setActiveLang('ar')
      document.documentElement.setAttribute('dir', 'rtl')
    }
  }
}
