import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {


  themeKey = "theme"

  private currentTheme = new BehaviorSubject<string>(this.getTheme())

  private getTheme() {
    return localStorage.getItem(this.themeKey) ?? "light"
  }

  switchTheme(newTheme: string) {

    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem(this.themeKey, newTheme)
    this.currentTheme.next(newTheme)

  }

  getCurrentTheme() {
    return this.currentTheme.asObservable()
  }

  constructor() {
    this.switchTheme(this.currentTheme.value)
  }
}
