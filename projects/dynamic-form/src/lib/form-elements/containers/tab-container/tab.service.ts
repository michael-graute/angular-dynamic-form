import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TabService {

  tabClicked: Subject<any> = new Subject<any>();

  constructor() { }

  clickTab(paneId: string) {
    this.tabClicked.next(paneId);
  }
}
