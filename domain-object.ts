import 'rxjs/add/operator/toPromise';
import { Headers, RequestOptions, Http } from '@angular/http';
import { FirebaseAuthService }        from './services/firebase-auth.service';
import { EntityReference }        from './structs/entity-reference';
import { NoizuStruct }        from './structs/noizu-struct';

export class DomainObject extends NoizuStruct{
    public  identifier = "nyi";
    public vsn: number;
    public raw: any;
    protected strip_from_json = {};
    protected _always_strip = {_kind: 0, strip_from_json: 0, raw: 0, _always_strip: 0, auth: 0, client: 0};
    protected _kind = "nyi";

    constructor(protected client: Http, protected auth: FirebaseAuthService, json: any) {
      super();
      this.refresh(json);
    }

    refresh(data) {
      this.vsn = data["vsn"] || null;
      this.identifier = data["id"] || data["identifier"] || null;
      this.raw = data;
    }

    ref() {
      return new EntityReference(this.client, this.auth, "ref." + this._kind + "." + this.identifier);
    }

    kind() {
      return this._kind;
    }

    id() {
      return this.identifier;
    }

    expand() {
      return this;
    }

    toJson(options: any = {}) {
      let c:any = {};
      let strip_level = 3;
      let strip_from_json = this.strip_from_json;

      // Overrides
      if ("strip_level" in options) {
        strip_level = options.strip_level;
      }
      if ("strip_from_json" in options) {
        strip_from_json = options.strip_from_json;
      }
      let exclude_fields = options["exclude_fields"] || []
      let exclude = {}
      for (var f = 0; f < exclude_fields.length; f++) {
        exclude[exclude_fields[f]] = true;
      }

      for(let key in this) {
            let key_str = key.toString()
            if ( (key_str in strip_from_json && strip_from_json[key_str] < strip_level) ||
                 (key_str in this._always_strip && this._always_strip[key_str] < strip_level) ||
                 (key_str in exclude))  {
                   //console.log("Strip 1: ", key_str);
            } else {
              if (this[key] instanceof DomainObject || this[key] instanceof NoizuStruct) {
                if (key === "category") {
                  c[key] = this[key]["enum"];
                } else {
                  let p: any = this[key];
                  c[key] = p.toJson(options);
                }
              } else {
                if (!(this[key] && {}.toString.call(this[key]) === '[object Function]')) {

                  if (Array.isArray(this[key])) {
                    let o = [];
                    let a:any = this[key];
                    for(let na = 0; na < a.length; na++) {
                      // todo recursive array support;
                      if (a[na] instanceof NoizuStruct) {
                        o.push(a[na].toJson(options))
                      } else {
                        o.push(a[na])
                      }
                    }
                    c[key] = o;
                  } else {
                    c[key] = this[key];
                  }

                } else {
                  //console.log("Strip 2: ", key_str);
                }
              }
            }

      }

      // Copy DomainObject properties
      c.identifier = this.identifier;
      c.kind = this.kind();
      c.vsn = this.vsn;

      return c;
    }

  //============================================================================
  // Utils
  //============================================================================
    isObject(value) {
      return value === Object(value);
    }

    isSRef(value) {
        return (this.isString(value) && value.startsWith("ref."));
    }

    isString(value) {
      return typeof value === 'string';
    }

    static dataToJson(entity, options = {}) {
      if (entity instanceof DomainObject || entity instanceof NoizuStruct) {
        return entity.toJson(options);
      } else {
        return entity;
      }
    }

  //============================================================================
  // REST Helpers
  //============================================================================


    _put(url, data, init, options = {})  {
      return new Promise(
        (resolve, reject) => {
          let json = DomainObject.dataToJson(data, options);
          this.auth.getTokenPromise().then(
            (token) => {
              let requestOptions = this.auth.request_options(token, options);
              this.client.put(url, JSON.stringify(json), requestOptions)
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

   _post(url, data, init, options = {})  {
      let p = new Promise(
        (resolve, reject) => {
          let json = DomainObject.dataToJson(data, options);
          this.auth.getTokenPromise().then(
            (token) => {
              let requestOptions = this.auth.request_options(token, options);
              this.client.post(url, JSON.stringify(json), requestOptions)
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
      return p;
    }

    _get(url, init, options = {})  {
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

    _delete(url, init, options = {})  {
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
            }, (error) => {
                console.error("Token Error", error);
                reject({message: "token error", details: error});
            }
          );
        }
      );
    }
}
