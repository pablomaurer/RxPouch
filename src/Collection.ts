import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {Store} from "./Store";
import {Filter} from "./Filter";
import {IModel} from "./interfaces/IModel";
import {filter} from "rxjs/operators";
import {EHook, Hook} from "./Hooks";

export interface IObservableOptions {
  user?: Observable<string>
  filter?: Observable<any>
  filterType?: Observable<any>
  sort?: Observable<any>
}

export class Collection<T extends IModel> {

  private _hooks = new Hook();
  private _subs: Subscription[] = [];

  private _allDocsSubject: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private _store: Store<T> = new Store(this._allDocsSubject);
  private _docsSubject: BehaviorSubject<T[]> = new BehaviorSubject([]);
  private _filterStore: Filter<T> = new Filter(this._docsSubject, this._store.getDocs(),
    this._observableOptions.filter, this._observableOptions.filterType, this._observableOptions.sort);

  public changes$: Observable<any>;
  public insert$: Observable<any>;
  public update$: Observable<any>;
  public remove$: Observable<any>;
  public docs$: Observable<T[]> = this._docsSubject.asObservable();
  public allDocs$: Observable<T[]> = this._allDocsSubject.asObservable();


  // todo change user to observable
  // todo https://stackoverflow.com/questions/35743426/async-constructor-functions-in-typescript
  constructor(private _pouchdb, private _allChanges$, private _docType: string, private _observableOptions: IObservableOptions = {}) {

    // todo
    if (this._observableOptions.user) {
    }

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
    this.all().then(res => {
      this._store.setDocs(res);
    });

    this._subs.push(
      this.insert$.subscribe(next => {
        this._store.addToStore(next.doc);
        this._filterStore.addToStore(next.doc);
      })
    );

    this._subs.push(
      this.update$.subscribe(next => {
        this._store.updateInStore(next.doc);
        this._filterStore.updateInStore(next.doc);
      })
    );

    this._subs.push(
      this.remove$.subscribe(next => {
        this._store.removeFromStore(next.doc);
        this._filterStore.removeFromStore(next.doc);
      })
    );
  }
  // ------------------------------------------
  // methods
  // ------------------------------------------
  public destroy() {
    this._subs.forEach(sub => sub.unsubscribe());
    this._store = null;
  }

  public addHook = this._hooks.addHook;
  public setFilter = this._filterStore.setFilter;
  public extendComparator = this._filterStore.extendComparator;

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

  public async removeAll() {
    return this.all().then(docs => {
        return Promise.all(docs.map((doc) => {
          return this._pouchdb.remove(doc)
        }))
      })
  }

  public async all() {
    let endkey = this._docType + '-\uffff';
    if (this._observableOptions.user) {
      endkey = this._docType + '-' + this._observableOptions.user + '\uffff'
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


}