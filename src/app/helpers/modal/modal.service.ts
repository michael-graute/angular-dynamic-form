import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private componentSubscriber!: Subject<any>;
  public showSubscriber: Subject<any> = new Subject<any>();
  public buttonClicked: Subject<any> = new Subject<any>();
  public closeRequest: Subject<any> = new Subject<any>();
  private caller: any;

  constructor() { }

  show(config: any, caller: any): Observable<any> {
    this.showSubscriber.next({config: config});
    this.componentSubscriber = new Subject<any>();
    this.caller = caller;
    return this.componentSubscriber.asObservable();
  }

  buttonClick(payload: any): void {
    this.componentSubscriber.next(payload);
    this.buttonClicked.next(payload);
    /*if (button.callback) {
      button.callback(button.data, this.caller);
    }*/
  }

}
