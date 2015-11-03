/**
* CustomEvent polyfill based on https://github.com/webmodules/custom-event
*/
const NativeCustomEvent = CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  }
  catch (e) {
    return false;
  }
}

function fromCreateEvent(
  type:string,
  params: { bubbles: boolean, cancelable: boolean, detail: any} =
  { bubbles: false, cancelable: false, detail: {} }
){
  let e = document.createEvent('CustomEvent');

  e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);

  return e;
}

function fromCreateEventObject(
  type:string,
  params: { bubbles: boolean, cancelable: boolean, detail: any} =
  { bubbles: false, cancelable: false, detail: {} }
){
  let e = document.createEventObject();
  e.type = type;
  e.bubbles = params.bubbles;
  e.cancelable = params.cancelable;
  e.detail = params.detail;

  return e;
}

let eventExport: any;

if (useNative()){
  eventExport = NativeCustomEvent;
}
else if (typeof document.createEvent === 'function'){
  eventExport = fromCreateEvent;
}
else{
  eventExport = fromCreateEventObject;
}

export default eventExport;
