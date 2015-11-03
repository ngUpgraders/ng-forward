// # EventEmitter class
// Angular 2's [EventEmitter](https://github.com/angular/angular/blob/master/modules/angular2/src/facade/async.ts#L97)
import Subject from '@reactivex/rxjs/dist/es6/Subject';

export default class EventEmitter{
  /** @internal */
  private _subject = new Subject();
  /** @internal */
  private _isAsync: boolean;

  /**
   * Creates an instance of [EventEmitter], which depending on [isAsync],
   * delivers events synchronously or asynchronously.
   */
  constructor(isAsync: boolean = true) {
    this._isAsync = isAsync;
  }

  observer(generator: any): any {
    var schedulerFn = this._isAsync ? (value: any) => { setTimeout(() => generator.next(value)); } :
                                      (value: any) => { generator.next(value); };
    return this._subject.subscribe(schedulerFn,
                                   (error: any) => generator.throw ? generator.throw(error) : null,
                                   () => generator.return ? generator.return () : null);
  }

  toRx(): any { return this._subject; }

  next(value: any) { this._subject.next(value); }

  throw(error: any) { this._subject.error(error); }

  return (value?: any) { this._subject.complete(); }
}
