import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {


  themeKey = "theme"

  getTheme() {
    return localStorage.getItem(this.themeKey) ?? "light"
  }

  switchTheme(newTheme: string) {

    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem(this.themeKey, newTheme)

  }

  constructor() { }
}
