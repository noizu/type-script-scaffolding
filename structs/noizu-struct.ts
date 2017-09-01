export class NoizuStruct  {
  protected strip_from_json = {};
  protected _always_strip = {strip_from_json: 0, _always_strip: 0};

  constructor() {
  } // end constructor

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

    for(let key in this) {
        if ( !(Object.hasOwnProperty(key) )) {
          let key_str = key.toString()
          if ( (key_str in strip_from_json && strip_from_json[key_str] < strip_level) || (key_str in this._always_strip && this._always_strip[key_str] < strip_level)) {
            // skip
          } else {
            if (this[key] instanceof NoizuStruct) {
              let p: any = this[key];
              c[key] = p.toJson(options);
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
              //  console.warn("SKIP", key, this[key]);
              }
            }
          }
        }
    }
    return c;
  }
}
