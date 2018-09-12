const deepFilter = require('deep-array-filter');
import {IModel} from "./interfaces/IModel";

// instead piped docs using filter, but will run filter after all changes
export class Filter<T extends IModel> {

  private _filter: any = {};
  private _filterType: any = {};
  private _comparator;

  private _filteredDocs: T[] = [];

  // TODO Sort
  constructor(private _docsSubject, private _allDocs: T[], private _filter$?, private _filterType$?) {
    if (_filter$ && _filterType$) {
      _filter$.combineLatest(_filterType$, this.setFilter);
    }
  }

  // ------------------------------------------
  // borrowed from store.ts - update filter store
  // ------------------------------------------
  private filter() {
    this._filteredDocs = deepFilter(this._allDocs, this._filter, this._filterType, this._comparator);
    this._docsSubject.next(this._filteredDocs);
  }

  private doesDocPassFilter(doc): boolean {
    let res = deepFilter([doc], this._filter, this._filterType, this._comparator);
    return !!res[0];
  }

  // ------------------------------------------
  // imperative style
  // ------------------------------------------
  public setFilter(filter, filterType) {
    this._filter = filter;
    this._filterType = filterType;
    this.filter();
  }

  public extendComparator(comparator: any) {
    this._comparator = comparator
  }

  // ------------------------------------------
  // borrowed from store.ts - update filter store
  // ------------------------------------------
  public getIndex(id: string): number {
    return this._filteredDocs.findIndex(model => model._id === id);
  }

  public updateInStore(model): boolean {
    let addDoc = this.doesDocPassFilter(model);
    let found = false;

    if (addDoc) {
      let index = this.getIndex(model._id);
      if (index !== -1) {
        this._filteredDocs[index] = model;
        found = true;
      }
    } else {
      this.removeFromStore(model._id);
    }
    this._docsSubject.next(this._filteredDocs);
    return found;
  }

  public addToStore(model) {
    let addDoc = this.doesDocPassFilter(model);
    if (addDoc) {
      this._filteredDocs.push(model);
      this._docsSubject.next(this._filteredDocs);
    }
    return addDoc
  }

  public removeFromStore(id: string): boolean {
    let found = false;
    let index = this.getIndex(id);
    if (index !== -1) {
      this._filteredDocs.splice(index, 1);
      found = true;
    }
    this._docsSubject.next(this._filteredDocs);
    return found;
  }

}