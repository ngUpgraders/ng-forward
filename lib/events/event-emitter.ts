import Subject from '@reactivex/rxjs/dist/es6/Subject';

/**
 * Use by directives and components to emit custom Events. Copied from Angular 2's [EventEmitter](
 * https://github.com/angular/angular/blob/ca3986f31dba5793b0a141e90c4a5fb17ce8847a/modules/angular2/src/core/facade/async.ts#L88-L117).
 *
 * ### Examples
 *
 * In the following example, `Zippy` alternatively emits `open` and `close` events when its
 * title gets clicked:
 *
 * ```
 * @Component({
 *   selector: 'zippy',
 *   template: `
 *   <div class="zippy">
 *     <div (click)="toggle()">Toggle</div>
 *     <div [hidden]="!visible">
 *       <ng-content></ng-content>
 *     </div>
 *  </div>`})
 * export class Zippy {
 *   visible: boolean = true;
 *   @Output() open: EventEmitter = new EventEmitter();
 *   @Output() close: EventEmitter = new EventEmitter();
 *
 *   toggle() {
 *     this.visible = !this.visible;
 *     if (this.visible) {
 *       this.open.next(null);
 *     } else {
 *       this.close.next(null);
 *     }
 *   }
 * }
 * ```
 *
 * Use Rx.Observable but provides an adapter to make it work as specified here:
 * https://github.com/jhusain/observable-spec
 *
 * Once a reference implementation of the spec is available, switch to it.
 */
export default class EventEmitter<T> extends Subject<T> {
  /** @internal */
  _isAsync: boolean;

  /**
   * Creates an instance of [EventEmitter], which depending on [isAsync],
   * delivers events synchronously or asynchronously.
   */
  constructor(isAsync: boolean = true) {
    super();
    this._isAsync = isAsync;
  }

  subscribe(generatorOrNext?: any, error?: any, complete?: any): any {
    if (generatorOrNext && typeof generatorOrNext === 'object') {

      let schedulerFn = this._isAsync ?
          (value) => { setTimeout(() => generatorOrNext.next(value)); } :
          (value) => { generatorOrNext.next(value); };

      return super.subscribe(schedulerFn,
          (err) => generatorOrNext.error ? generatorOrNext.error(err) : null,
          () => generatorOrNext.complete ? generatorOrNext.complete() : null);

    } else {

      let schedulerFn = this._isAsync ?
          (value) => { setTimeout(() => generatorOrNext(value)); } :
          (value) => { generatorOrNext(value); };

      return super.subscribe(schedulerFn,
          (err) => error ? error(err) : null,
          () => complete ? complete() : null);

    }
  }
}

export {Subject}