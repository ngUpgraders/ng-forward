/* global setTimeout */
// # EventEmitter class
// Simple re-implementation of Angular 2's [EventEmitter](https://github.com/angular/angular/blob/master/modules/angular2/src/facade/async.ts#L97)
import {Subject, Scheduler} from 'rx';

export class EventEmitter{
  _subject = new Subject();
  _immediateScheduler = Scheduler.immediate;

  observer(generator){
    return this._subject.observeOn(this._immediateScheduler)
      .subscribe(
        value => setTimeout(() => generator.next(value)),
        error => generator.throw ? generator.throw(error) : null,
        () => generator.return ? generator.return() : null
      );
  }

  toRx(){
    return this._subject;
  }

  next(value){
    this._subject.onNext(value);
  }

  throw(error){
    this._subject.onError(error);
  }

  return(){
    this._subject.onCompleted();
  }
}
