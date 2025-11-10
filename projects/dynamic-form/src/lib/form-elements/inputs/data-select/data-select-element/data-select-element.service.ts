import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataSelectElementService {

  constructor(private http: HttpClient) {}

  loadData(url: string): Observable<any> {
    return this.http.get(url);
  }
}
