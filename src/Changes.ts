import {BehaviorSubject, Observable, Subject, Subscription, fromEvent} from "rxjs";

export class Changes {

  private pouchChanges: any;
  private _subs: Subscription[] = [];
  private _subjects = {
    change: new Subject(),
    docs: new Subject(),
    complete: new BehaviorSubject(false),
    error: new Subject(),
  };

  public _isListening: boolean = false;

  public change$: Observable<any> = this._subjects.change.asObservable();
  public complete$: Observable<any> = this._subjects.complete.asObservable();
  public error$: Observable<any> = this._subjects.error.asObservable();

  constructor() {

  }

  public setupListener(pouchChanges) {
    if (this.pouchChanges) {
      this.cancel();
    }
    this.pouchChanges = pouchChanges;
    this._isListening = true;

    // change
    this._subs.push(
      fromEvent(this.pouchChanges, 'change').subscribe((ev: any) => {

        // fix rxjs 6, no idea why they give an array?
        if (Array.isArray(ev)) {
          ev = ev[0];
        }

        let op = ev.doc._rev.startsWith('1-') ? 'INSERT' : 'UPDATE';
        if (ev.doc._deleted) op = 'REMOVE';
        ev.op = op;

        this._subjects.change.next(ev)
      })
    );

    // complete
    this._subs.push(
      fromEvent(this.pouchChanges, 'complete').subscribe((info: any) => {
        this._subjects.complete.next(info)
      })
    );

    // error
    this._subs.push(
      fromEvent(this.pouchChanges, 'error').subscribe(ev => {
        this._subjects.error.next(ev)
      })
    );
  }

  public cancel() {
    this.pouchChanges && this.pouchChanges.cancel();
    this.pouchChanges = null;
    this._isListening= false;

    setTimeout(() => {
      this._subs.forEach(sub => sub.unsubscribe());
    }, 0)
  }

}