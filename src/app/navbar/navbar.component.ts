import { Component } from '@angular/core';
import { environment } from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isDark = false;
  isDarkIconSrc = "assets/icons/icon _moon_.svg";
  iconStyles = {'width.px':25, 'height.px':25};
  searchResult: any[] = [];

  searchKeyword = "";

  constructor(private http: HttpClient) {}

  searchTickers(keyword: string) {
    let searchUrl = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + keyword +"&apikey=" + environment.APIKEY;
    if (keyword.length>0) {
      this.http.get(searchUrl).subscribe(
        (data) => {

          this.searchResult = JSON.parse(JSON.stringify(data)).bestMatches;
          console.log(this.searchResult);
          console.log(this.searchResult[0]["2. name"]);

        },
        (error) => {
          console.log('something went wrong')
          console.log(error.toString());
        }
      );
    } else {
      this.searchResult = [];
    }
  }
  onDarkModeClicked() {
    document.body.classList.toggle('dark-mode');
    this.isDarkIconSrc = (this.isDark)? "assets/icons/icon _moon_.svg": "assets/icons/icon _sun 1_.svg";
    this.isDark = !this.isDark;
  }
}
