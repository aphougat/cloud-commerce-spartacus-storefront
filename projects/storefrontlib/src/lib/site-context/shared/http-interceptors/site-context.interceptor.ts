import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as fromStore from '../store';
import { SiteContextConfig } from '../../site-context-module-config';
import { Config } from '../../../config/config.module';

@Injectable()
export class SiteContextInterceptor implements HttpInterceptor {
  baseReqString: string;
  activeLang = this.config.site.language;
  activeCurr = this.config.site.currency;

  constructor(
    private store: Store<fromStore.SiteContextState>,
    @Inject(Config) private config: SiteContextConfig
  ) {
    this.baseReqString =
      this.config.server.baseUrl +
      this.config.server.occPrefix +
      this.config.site.baseSite;

    this.store
      .select(fromStore.getActiveLanguage)
      .pipe(filter(lang => lang != null))
      .subscribe(data => (this.activeLang = data));

    this.store
      .select(fromStore.getActiveCurrency)
      .pipe(filter(curr => curr != null))
      .subscribe(data => (this.activeCurr = data));
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.indexOf(this.baseReqString) > -1) {
      request = request.clone({
        setParams: {
          lang: this.activeLang,
          curr: this.activeCurr
        }
      });
    }

    return next.handle(request);
  }
}
