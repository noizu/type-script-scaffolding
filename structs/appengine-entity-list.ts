import { NoizuStruct }        from './noizu-struct';

export class AppengineEntityList extends NoizuStruct {
  public kind: string;
  public items: Array<any>;
  public cursor: string;

  constructor(kind, items, cursor) {
    super();
    this.kind = kind;
    this.items = items;
    this.cursor = cursor;
  } // end constructor

}
