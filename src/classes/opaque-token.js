export class OpaqueToken {
  constructor(_desc) { this._desc = _desc }
  toString() { return `Token ${this._desc}`; }
}