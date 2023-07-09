export interface tickerPriceTimeSeriesStamp {
  "1. open": number,
  "2. high": number,
  "3. low": number,
  "4. close": number,
  "5. volume": number
}

export interface tickerMetaData {
  "1. Information": string,
  "2. Symbol": string,
  "3. Last Refreshed": string,
  "4. Interval": string,
  "5. Output Size": string,
  "6. Time Zone": string
}

export interface tickerQuoteEndpoint {
  "01. symbol": string,
  "02. open": number,
  "03. high": number,
  "04. low": number,
  "05. price": number,
  "06. volume": "2982738",
  "07. latest trading day": Date,
  "08. previous close": number,
  "09. change": number,
  "10. change percent": number
}
