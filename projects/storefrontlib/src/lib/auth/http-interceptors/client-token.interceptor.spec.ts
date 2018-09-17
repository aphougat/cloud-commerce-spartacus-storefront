import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { StoreModule, combineReducers, Store } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromRoot from '../../routing/store';
import * as fromStore from '../store';
import { ClientTokenState } from '../store/reducers/client-token.reducer';

import { ClientTokenInterceptor } from './client-token.interceptor';

import { InterceptorUtil } from '../../occ/utils/interceptor-util';

import { ClientAuthenticationToken } from './../models/token-types.model';

import { AuthModuleConfig } from '../auth-module.config';
import { Config } from '../../config/config.module';

const testToken: ClientAuthenticationToken = {
  access_token: 'abc-123',
  token_type: 'bearer',
  expires_in: 1000,
  scope: ''
};
const clientTokenState: ClientTokenState = {
  loaded: true,
  loading: false,
  token: testToken
};

const MockAuthModuleConfig: AuthModuleConfig = {
  server: {
    baseUrl: 'https://localhost:9002',
    occPrefix: '/rest/v2/'
  },

  site: {
    baseSite: 'electronics'
  }
};

describe('ClientTokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let store: Store<fromStore.AuthState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          ...fromRoot.getReducers(),
          auth: combineReducers(fromStore.getReducers())
        })
      ],
      providers: [
        { provide: Config, useValue: MockAuthModuleConfig },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ClientTokenInterceptor,
          multi: true
        }
      ]
    });
    store = TestBed.get(Store);
    httpMock = TestBed.get(HttpTestingController);

    spyOn(store, 'select').and.returnValue(of(clientTokenState));
  });

  describe('Client Token', () => {
    it('Should only add token to specified requests', inject(
      [HttpClient],
      (http: HttpClient) => {
        http
          .get('https://localhost:9002/rest/v2/electronics/test')
          .subscribe(result => {
            expect(result).toBeTruthy();
          });
        let mockReq = httpMock.expectOne(
          'https://localhost:9002/rest/v2/electronics/test'
        );
        let authHeader = mockReq.request.headers.get('Authorization');
        expect(authHeader).toBe(null);

        spyOn<any>(InterceptorUtil, 'getInterceptorParam').and.returnValue(
          true
        );
        http
          .post(
            'https://localhost:9002/rest/v2/electronics/somestore/forgottenpasswordtokens',
            { userId: 1 }
          )
          .subscribe(result => {
            expect(result).toBeTruthy();
          });

        mockReq = httpMock.expectOne(
          'https://localhost:9002/rest/v2/electronics/somestore/forgottenpasswordtokens'
        );
        authHeader = mockReq.request.headers.get('Authorization');
        expect(authHeader).toBe(
          `${testToken.token_type} ${testToken.access_token}`
        );
      }
    ));

    it(`should not add an 'Authorization' token to a request if it already has one`, inject(
      [HttpClient],
      (http: HttpClient) => {
        const headers = { Authorization: 'bearer 123' };
        http
          .get('/somestore/forgottenpasswordtokens', { headers })
          .subscribe(result => {
            expect(result).toBeTruthy();
          });

        const mockReq = httpMock.expectOne(
          '/somestore/forgottenpasswordtokens'
        );
        const authHeader = mockReq.request.headers.get('Authorization');
        expect(authHeader).toBe(headers.Authorization);
      }
    ));
  });
});
