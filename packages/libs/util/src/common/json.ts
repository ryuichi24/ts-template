export abstract class Json<T> {
  constructor(protected _props: T) {}
  protected toJson(): string {
    const json = JSON.stringify(this.toObj(), null, 2);
    return json;
  }
  protected toObj() {
    this._props;
  }
}
