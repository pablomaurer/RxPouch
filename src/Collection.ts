import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {Store} from "./Store";
import {IModel} from "./interfaces/IModel";
import {filter} from "rxjs/operators";
import {EHook, Hook} from "./Hooks";

export class Collection<T extends IModel> {

  private _hooks = new Hook();
  private _subs: Subscription[] = [];
  private _docsSubject: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private _rxStore: Store<T> = new Store(this._docsSubject);

  public changes$: Observable<any>;
  public insert$: Observable<any>;
  public update$: Observable<any>;
  public remove$: Observable<any>;
  public docs$: Observable<T[]> = this._docsSubject.asObservable();

  // setFilter(observable)
  // option 1 run through all docs, on change
  // option 2 run the change on through filter and append or remove docs | requires 3 subscriptions/but still need to sort

  // todo change user to observable
  // todo https://stackoverflow.com/questions/35743426/async-constructor-functions-in-typescript
  constructor(private _pouchdb, private _allChanges$, private _docType: string, private _user?: any) {
    // ------------------------------------------
    // create changes$, insert$, update$, remove$
    // ------------------------------------------
    this.changes$ = this._allChanges$.pipe(
      filter((change: any) => change.doc.type === this._docType || change.id.startsWith(this._docType))
    );

    this.insert$ = this.changes$.pipe(
      filter((change: any) => change.op === 'INSERT')
    );

    this.update$ = this.changes$.pipe(
      filter((change: any) => change.op === 'UPDATE')
    );

    this.remove$ = this.changes$.pipe(
      filter((change: any) => change.op === 'REMOVE')
    );

    // ------------------------------------------
    // create docs$
    // ------------------------------------------
    // todo constuctor async better way?
    this.loadData().then(res => {
      this._rxStore.setData(res);
    });

    this._subs.push(
      this.insert$.subscribe(next => {
        this._rxStore.addToStore(next.doc)
      })
    );

    this._subs.push(
      this.update$.subscribe(next => {
        this._rxStore.updateInStore(next.doc)
      })
    );

    this._subs.push(
      this.remove$.subscribe(next => {
        this._rxStore.removeFromStore(next.doc)
      })
    );
  }
  // ------------------------------------------
  // methods
  // ------------------------------------------
  public destroy() {
    this._subs.forEach(sub => sub.unsubscribe());
    this._rxStore = null;
  }

  public addHook = this._hooks.addHook;

  private async loadData(): Promise<any[]> {
    let endkey = this._docType + '-\uffff';
    if (this._user) {
      endkey = this._docType + '-' + this._user.code + '\uffff'
    }

    let res = await this._pouchdb.allDocs({
      startkey: this._docType,
      endkey: endkey,
      include_docs: true
    });

    return res.rows.map(row => {
      return row.doc;
    });
  }

  // ------------------------------------------
  // crud
  // ------------------------------------------
  public get(id: string) {
    return this._pouchdb.get(id);
  }

  public async create(doc) {
    doc.type = this._docType;
    doc._id = this._docType + '-' + doc._id;
    doc = await this._hooks.runHooks(EHook.PRE_CREATE, doc);
    return this._pouchdb.create(doc).then(() => {
      this._hooks.runHooks(EHook.POST_CREATE, doc);
    });
  }

  public async update(doc) {
    doc = await this._hooks.runHooks(EHook.PRE_UPDATE, doc);
    return this._pouchdb.update(doc).then(() => {
      this._hooks.runHooks(EHook.PRE_UPDATE, doc);
    });
  }

  public async save(doc) {
    doc = await this._hooks.runHooks(EHook.PRE_SAVE, doc);
    let promise = doc._rev ? this.update(doc): this.create(doc);
    return promise.then(() => {
      this._hooks.runHooks(EHook.POST_SAVE, doc);
    });
  }

  public async remove(doc) {
    doc = await this._hooks.runHooks(EHook.PRE_REMOVE, doc);
    return this._pouchdb.remove(doc).then(() => {
      this._hooks.runHooks(EHook.POST_REMOVE, doc);
    });
  }

  public removeAll() {
    // todo
  }


}