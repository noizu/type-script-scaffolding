import { NoizuStruct }        from './noizu-struct';

export class EntityReference extends NoizuStruct  {
  protected ref_string: string;
  protected ref_kind: string;
  protected ref_identifier: string | number;
  protected client: any;
  protected auth: any;
  protected _cache: any;

  constructor(client, auth, json) {
    super();
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

        let repo = null;
        // Determine type.
        switch (this.kind()) {
            default:
              resolve(null);
            break;
        }
      }
    });
  }

  toJson(options = {}) {
    return this.ref_string;
  }

  identifier() {
    if (!this.ref_identifier) {
      this.ref_identifier = EntityReference.extractIdentifier(this.ref_string);
    }
    return this.ref_identifier;
  }

  kind() {
    if (!this.ref_kind) {
      this.ref_kind = EntityReference.extractKind(this.ref_string);
    }
    return this.ref_kind;
  }

  static extractIdentifier(sref: string) {
    if (sref) {
      let r = /ref\.([^\.]*)\.(.*)/g;
      let m = r.exec(sref);
      let i = m[2];
      let ni = parseInt(i);
      return (isNaN(ni) ? i : ni);
    } else {
      return null;
    }
  }

  static extractKind(sref: string) {
    if (sref) {
      let r = /ref\.([^\.]*)\.(.*)/g;
      let m = r.exec(sref);
      switch (m[1]) {
        case "affirmation":
        case "inspiration":
        case "journal-entry":
        case "user-box":
          return m[1];

        default:
          return "unsupported";
      }
    } else {
      return "unsupported";
    }
  }

  static IsRefString(sref: string) {
    return ((typeof sref === 'string') && sref.startsWith("ref."));
  }

  toString() {
    return this.ref_string;
  }

  static factory(client, auth, json) {
    switch (json["kind"]) {
        default:
          console.error("Unsupported Entity Kind for EntityReference.factory method", json["kind"]);
        return json;
    }
  }
}
