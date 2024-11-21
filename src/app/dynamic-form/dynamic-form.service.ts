import {ComponentRef, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {FormElement} from "./dynamic-form.types";


export type ElementAddedPayload = {
  element: FormElement;
  targetContainerId: string;
}

export type ElementRemovedPayload = {
  elementId: string;
}

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  componentRefs: {[key: string]: ComponentRef<any>} = {};

  elementAdded = new Subject<ElementAddedPayload>();
  elementRemoved = new Subject<ElementRemovedPayload>();

  constructor(private http: HttpClient) {}

  loadForm(url: string): Observable<any> {
    return this.http.get(url);
  }

  addElement(element: FormElement, targetId: string): void {
    this.elementAdded.next({element: element, targetContainerId: targetId});
  }

  removeElement(elementId: string): void {
    this.elementRemoved.next({elementId: elementId});
    this.removeComponentRef(elementId);
  }

  addComponentRef(componentRef: ComponentRef<any>, id: string): void {
    this.componentRefs[id] = componentRef;
  }

  removeComponentRef(id: string): void {
    this.componentRefs[id].destroy()
  }
}
