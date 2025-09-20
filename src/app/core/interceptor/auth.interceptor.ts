import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (req.url.includes('auth/token')) return next.handle(req);
    if (req.url.includes('auth/token')) return next.handle(req);
    const token = this.authService.getToken();
    const tenantId = this.authService.getTenant();

    let headers = req.headers;

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (tenantId) {
      headers = headers.set('X-Tenant-ID', tenantId);
    }

    console.log(tenantId);

    const authReq = req.clone({ headers });

    return next.handle(authReq);
  }
}
