import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthModuleConfig } from '../../auth-module.config';
import { Config } from '../../../config/config.module';

const OAUTH_ENDPOINT = '/authorizationserver/oauth/token';

@Injectable()
export class ClientAuthenticationTokenService {
  constructor(@Inject(Config) private config: AuthModuleConfig, private http: HttpClient) {}

  loadClientAuthenticationToken(): Observable<any> {
    const url = this.getOAuthEndpoint();
    const params = new HttpParams()
      .set(
        'client_id',
        encodeURIComponent(this.config.authentication.client_id)
      )
      .set(
        'client_secret',
        encodeURIComponent(this.config.authentication.client_secret)
      )
      .set('grant_type', 'client_credentials');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http
      .post(url, params, { headers })
      .pipe(catchError((error: any) => throwError(error.json())));
  }

  private getOAuthEndpoint() {
    return this.config.server.baseUrl + OAUTH_ENDPOINT;
  }
}
