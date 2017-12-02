import { NoizuStruct }        from './noizu-struct';

export class EntityReference extends NoizuStruct  {
  protected ref_string: string;
  protected ref_kind: string;
  protected ref_identifier: string | number;
  public client: any;
  public auth: any;
  protected _cache: any;
  protected strategy: any;

  constructor(strategy, client, auth, json) {
    super();
    this.strategy = strategy;
    this.ref_string = json;
    this.ref_kind = null;
    this.ref_identifier = null;
    this.client = client;
    this.auth = auth;
    this._cache = {};
  } // end constructor

  ref() {
    //console.error("ref() must be changed,");
    return this.ref_string;
  }

  expand(refresh = false) {
    return new Promise((resolve, reject) => {
      if (!refresh && this._cache[this.ref_string]) {
        resolve(this._cache[this.ref_string]);
      } else {
        let success = (entity) => {
          this._cache[this.ref_string] = entity;
          resolve(entity);
        }

        let failure = (e) => {
          console.error(`${this.ref_string}.expand() error`, e);
          reject(e);
        }

        this.strategy.expand(this).then((r) => {resolve(r)}).error((e) => {reject(e)});
      }
    });
  }

  toJson(options = {}) {
    return this.ref_string;
  }

  identifier() {
    if (!this.ref_identifier) {
      this.ref_identifier = this.strategy.extractIdentifier(this.ref_string);
    }
    return this.ref_identifier;
  }

  kind() {
    if (!this.ref_kind) {
      this.ref_kind = this.strategy.extractKind(this.ref_string);
    }
    return this.ref_kind;
  }

  toString() {
    return this.ref_string;
  }

  static IsRefString(sref: string) {
      return ((typeof sref === 'string') && sref.startsWith("ref."));
  }

}
