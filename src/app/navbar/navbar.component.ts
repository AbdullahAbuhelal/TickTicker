import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isDark = false;
  isDarkIconSrc = "assets/icons/icon _moon_.svg";
  iconStyles = {'width.px':25, 'height.px':25}
  onDarkModeClicked() {
    document.body.classList.toggle('dark-mode');
    this.isDarkIconSrc = (this.isDark)? "assets/icons/icon _moon_.svg": "assets/icons/icon _sun 1_.svg";
    this.isDark = !this.isDark;
  }
}
