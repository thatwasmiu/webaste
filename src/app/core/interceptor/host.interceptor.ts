import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class HostInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (
      req.url.includes('assets') ||
      req.url.includes('http') ||
      req.url.includes('https')
    )
      return next.handle(req);
    req = req.clone({
      url: environment.HOST_GW + req.url,
    });

    return next.handle(req);
  }
}
