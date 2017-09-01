import {Headers, RequestOptions, Http} from '@angular/http';
import {Inject, Injectable} from '@angular/core';
import { FirebaseAuthService }        from './services/firebase-auth.service';
import { EntityReference }        from './structs/entity-reference';
import { NoizuStruct }        from './structs/noizu-struct';
import { AppengineEntityList }        from './structs/appengine-entity-list';
import { DomainObject } from './domain-object';
import 'rxjs/add/operator/toPromise';

export class DomainObjectRepo {
  protected _api_version = "v1";
  protected _kind = null;
  protected _appengine = true;

  constructor(protected client: Http, protected auth: any) {
  }

  _getListPromise(url, init, options = {}) {
    return new Promise(
      (resolve, reject) => {
        this.auth.getTokenPromise().then(
          (token) => {
            let requestOptions = this.auth.request_options(token, options);
            this.client.get(url, requestOptions)
              .toPromise()
              .then((response: any) => {
                let data = response.json();
                if (this._appengine) {
                  let entries = [];
                  if (data.items) {
                    for(var i = 0; i < data.items.length; i++) {
                      entries.push(init(data.items[i]));
                    }
                  }
                  resolve(new AppengineEntityList(this._kind, entries, data.cursor || null));
                } else {
                  let entries = [];
                  for(var i = 0; i < data.length; i++) {
                    entries.push(init(data[i]));
                  }
                  resolve(entries);
                }
               })
              .catch((error) => {
                console.error("Request Error", error);
                reject({message: "request error", details: error});
              });
          }, (error) => {
              console.error("Token Error", error);
              reject({message: "token error", details: error});
          }
        ).catch((error) => {
          console.error("Token Error", error);
          reject({message: "token error", details: error});
        });
      }
    );
  }

  _getEntityPromise(url, init, options = {}) {
    return new Promise(
      (resolve, reject) => {
        this.auth.getTokenPromise().then(
          (token) => {
            let requestOptions = this.auth.request_options(token, options);
            this.client.get(url, requestOptions)
              .toPromise()
              .then((response: any) => {
                let data = response.json();
                init(data, resolve);
               })
              .catch((error) => {
                console.error("Request Error", error);
                reject({message: "request error", details: error});
              });
          }, (error) => {
              console.error("Token Error", error);
              reject({message: "token error", details: error});
          }
        );
      }
    );
  }

   /**
   * Generic method for deleting an item/ handling [DELETE] requests.
   * @param {string} url The resource url.
   * @param {Object} [options={}] Additional optional parameters
   * @returns {Promise}
   */

    _deleteItemPromise(url, init, options = {})  {
      return new Promise(
        (resolve, reject) => {
          this.auth.getTokenPromise().then(
            (token) => {
              let requestOptions = this.auth.request_options(token, options);
              this.client.delete(url, requestOptions)
                .toPromise()
                .then((response: any) => {
                    let data = response.json();
                    init(data, resolve);
                 })
                .catch((error) => {
                  console.error("Request Error", error);
                  reject({message: "request error", details: error});
                });
            },(error) => {
              reject({
                message: "token error",
                details: error
              });
            });
      });
    }


    /**
   * Generic method for creating new items/ handling [POST] requests.
   * @param {string} url The url to query.
   * @param {DomainObject} data The data for new object
   * @param {Object} [options={}] Additional optional parameters
   * @returns {Promise}
   */

  _postItemPromise(url, data, init,options = {}){
    return new Promise(
      (resolve, reject) => {
        this.auth.getTokenPromise().then(
          (token) => {
            let json = data; //DomainObject.dataToJson(data, options);
            let requestOptions = this.auth.request_options(token, options);
            this.client.post(url, JSON.stringify(json), requestOptions)
              .toPromise()
              .then((response: any) => {
                let data = response.json();
                if(data && data["data"]) { data = data["data"]};
                init(data, resolve);
               })
              .catch((error) => {
                console.error("Request Error", error);
                reject({message: "request error", details: error});
              });
          },(error) => {
            reject({
              message: "token error",
              details: error
            });
          });
      });
  }


  _putItemPromise(url, data, init,options = {}){
    return new Promise(
      (resolve, reject) => {
        this.auth.getTokenPromise().then(
          (token) => {
            let json = data; //DomainObject.dataToJson(data, options);
            let requestOptions = this.auth.request_options(token, options);
            this.client.put(url, JSON.stringify(json), requestOptions)
              .toPromise()
              .then((response: any) => {
                let data = response.json();
                if(data && data["data"]) { data = data["data"]};
                init(data, resolve);
               })
              .catch((error) => {
                console.error("Request Error", error);
                reject({message: "request error", details: error});
              });
          },(error) => {
            reject({
              message: "token error",
              details: error
            });
          });
      });
  }
}
