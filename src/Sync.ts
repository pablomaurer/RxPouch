import {BehaviorSubject, fromEvent, Subject, Subscription} from "rxjs";

export class Sync {

  private pouchSync;
  private _subs: Subscription[] = [];
  private _subjects = {
    change: new Subject(),
    docs: new Subject(), // todo create docsPushed, docsPulled, doc
    active: new BehaviorSubject(false),
    complete: new BehaviorSubject(false),
    error: new Subject(),
    localLastSeq: new Subject(),
    remoteLastSeq: new Subject(),
    remotePending: new Subject(),
  };

  public _isListening: boolean = false;

  public change$ = this._subjects.change.asObservable();
  public docs$ = this._subjects.docs.asObservable();
  public active$ = this._subjects.active.asObservable();
  public complete$ = this._subjects.complete.asObservable();
  public error$ = this._subjects.error.asObservable();

  public localLastSeq$ = this._subjects.localLastSeq.asObservable();
  public remoteLastSeq$ = this._subjects.remoteLastSeq.asObservable();
  public remotePending$ = this._subjects.remotePending.asObservable();

  constructor() {

  }

  public setupListener(pouchSync) {
    if (this.pouchSync) {
      this.cancel();
    }
    this.pouchSync = pouchSync;
    this._isListening = true;

    // change
    this._subs.push(
      fromEvent(this.pouchSync, 'change').subscribe((ev:any) => {
        if (ev.direction == 'pull') {
          this._subjects.remoteLastSeq.next(ev.change.last_seq); // string
          this._subjects.remotePending.next(ev.pending);
        }

        if (ev.direction == 'push') {
          this._subjects.localLastSeq.next(ev.change.last_seq);
        }

      })
    );

    // docs
    this._subs.push(
      fromEvent(this.pouchSync, 'change').subscribe((ev:any) => {
        if (this._subjects.docs.observers.length === 0 || ev.direction !== 'pull') return;
        ev.change.docs.forEach(doc => this._subjects.docs.next(doc));
      }));

    // error
    this._subs.push(
      fromEvent(this.pouchSync, 'error').subscribe(ev => {
        this._subjects.error.next(ev)
      })
    );

    // active
    this._subs.push(
      fromEvent(this.pouchSync, 'active').subscribe(() => {
        this._subjects.active.next(true)
      })
    );
    this._subs.push(
      fromEvent(this.pouchSync, 'paused').subscribe(() => {
        this._subjects.active.next(false)
      })
    );

    // complete
    this._subs.push(
      fromEvent(this.pouchSync, 'complete').subscribe((info: any) => {
        this._subjects.complete.next(info)
      })
    );

    this.pouchSync.on('change', (info) => {
      console.log('P:change', info);
    }).on('paused', (err) => {
      console.log('P:paused', err);       // replication paused (e.g. replication up to date, user went offline)
    }).on('active', () => {
      console.log('P:active');            // replicate resumed (e.g. new changes replicating, user went back online)
    }).on('denied', (err) => {
      console.log('P:denied', err);       // a document failed to replicate (e.g. due to permissions)
    }).on('complete', (info) => {
      console.log('P:complete', info);    // handle complete
    }).on('error', (err) => {
      console.log('P:error', err);        // handle error
    });
  }

  public cancel() {
    this.pouchSync.cancel();
    this.pouchSync = null;
    this._isListening = false;
    // TODO: why need this? isn't cancel() syncronus? does rxdb also need this?
    setTimeout(() => {
      this._subs.forEach(sub => sub.unsubscribe());
    }, 0)
  }

}