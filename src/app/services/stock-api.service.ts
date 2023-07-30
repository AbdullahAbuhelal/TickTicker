import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {map, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StockApiService {

  getSearchResult(keyword: string) {
    let searchUrl = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + keyword +"&apikey=" + environment.APIKEY;
    if (keyword.length > 0)
    return this.http.get(searchUrl).pipe(
      map(res => {
        console.log("start mapping")
        let searchObject = JSON.parse(JSON.stringify(res)).bestMatches;
        console.log(searchObject)
        return searchObject.map((data: any) => ({symbol: data["1. symbol"], name: data["2. name"]}))
      })
    );
    else
      return new Observable<any>
  }

  constructor(
    private http: HttpClient
  ) { }
}
