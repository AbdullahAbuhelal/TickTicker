import {Component, HostListener} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { TranslocoService } from '@ngneat/transloco';
import {ThemeService} from "../../services/theme/theme.service";



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isDark = false;


  constructor(
    private http: HttpClient,
    private translocoService: TranslocoService,
    private themeService: ThemeService,
  ) {}





  ngOnInit() {
    if (this.getLanguage()=="ar") this.changeLanguageToArabic();
    let theme = this.themeService.getCurrentTheme().subscribe(
      value => {
        this.isDark = (value == 'dark')
        this.checkLogoPath()
      }
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
  logoPath = "./assets/icons/logo.png";
  getLanguage() {
    return localStorage.getItem(this.languageKey) || navigator.language;
  }

  switchTheme(newTheme: string) {
    this.themeService.switchTheme(newTheme)
  }

  private checkLogoPath() {
    this.logoPath = (this.isDark)?
      "./assets/icons/logo-dark.png"
      : "./assets/icons/logo.png"
  }

  onSearchClick() {
    document.getElementById('nav-searchbar')?.classList.toggle('hidden')
    document.getElementById('search-input')?.focus()
  }

  // hide the searchbar when clicking outside it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: KeyboardEvent) {
    if (!document.getElementById('nav-searchbar')?.classList.contains('hidden'))
      document.getElementById('nav-searchbar')?.classList.add('hidden')
  }
}
