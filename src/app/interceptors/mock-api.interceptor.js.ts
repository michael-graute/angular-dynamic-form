import {HttpEvent, HttpHandlerFn, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

export function mockApiInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if(environment.mockApi) {
    const fakeRequest = req.clone({url: '/mock-api' + req.url + '.json'});
    return next(fakeRequest);
  }
  return next(req);
}
