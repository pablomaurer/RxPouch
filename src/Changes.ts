import {BehaviorSubject, fromEvent, Subject, Subscription} from "rxjs";

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

  public change$ = this._subjects.change.asObservable();
  public complete$ = this._subjects.complete.asObservable();
  public error$ = this._subjects.error.asObservable();

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
      fromEvent(this.pouchChanges, 'change').subscribe(ev => {

        let op = ev[0].doc._rev.startsWith('1-') ? 'INSERT' : 'UPDATE';
        if (ev[0].doc._deleted) op = 'REMOVE';
        ev[0].op = op;

        this._subjects.change.next(ev[0])
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
    this.pouchChanges.cancel();
    this.pouchChanges = null;
    this._isListening= false;

    setTimeout(() => {
      this._subs.forEach(sub => sub.unsubscribe());
    }, 0)
  }

}