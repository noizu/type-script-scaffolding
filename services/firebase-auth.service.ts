import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Headers, RequestOptions, Http} from '@angular/http';


@Injectable()
export class FirebaseAuthService {
  protected tokenPromise: Promise<any>;
  protected _resolve;
  protected _reject;
  protected _token: any;
  protected _fbs: any = null;

  constructor() {
    this.tokenPromise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    })
  }

  setFBS(fbs: any) {
    this._fbs = fbs;
    this._fbs.getIdToken().then((token) => {
      // backwards compatibility hack.
      this.setToken(token);
    });
  }

  getTokenPromise() {
    if (this._fbs) {
      // hack to work with lacrosse
      return this._fbs.getIdToken();
    } else {
      return this.tokenPromise;
    }
  }

  setToken(token) {
    this._resolve(token);
  }

  headers(token, options) {
    let expand_all_refs = options["expand_all_refs"] || false
    let expand_refs = options["expand_refs"] || false;

    let headers = new Headers({
      'content-type': 'application/json'
    });

    headers.append('authorization', "Bearer " + token );
    if (expand_all_refs) {
      headers.append('x-expand-all-refs','true');
    }
    return headers;
  }

  request_options(token, options) {
    let headers = this.headers(token, options);
    let requestOptions = new RequestOptions({
      headers: headers
    });
    return requestOptions;
  }
}
