import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class MainService {
  private apiBaseUrl;

  constructor(private _http: HttpClient) {
    this.apiBaseUrl = environment.api_url;
  }

  public getApiUrl(): string {
    return this.apiBaseUrl;
  }

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, ' +
            'Access-Control-Allow-Credentials, Access-Control-Allow-Headers, ' +
            'Access-Control-Allow-Methods, Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      })
    };
  }

  /**
  * GET request
  * @param path: Path of endpoint
  */
  public get(path: string): Observable<any> {
    const url = `${this.getApiUrl()}${path}`;
    return this._http.get(url, this.getHeaders());
  }

}
