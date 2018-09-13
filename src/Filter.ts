const deepFilter = require('deep-array-filter');
const deepSort = require('fast-sort');
import {IModel} from "./interfaces/IModel";

export interface ISort {
  field: string
  reverse: boolean
}

// instead piped docs using filter, but will run filter after all changes
export class Filter<T extends IModel> {

  private _filter: any = {};
  private _filterType: any = {};
  private _comparator;
  private _sort: ISort;

  private _filteredDocs: T[] = [];

  constructor(
    private _docsSubject,
    private _allDocs: T[],
    private _filter$?,
    private _filterType$?,
    private _sort$?
  ) {
    if (_filter$ && _filterType$) {
      _filter$.combineLatest(_filterType$, this.setFilter);
    }
    if(_sort$) {
      _sort$.subscribe(next => {
        this._sort = next;
      });
    }
  }

  // ------------------------------------------
  // filter / store
  // ------------------------------------------
  private filter() {
    this._filteredDocs = deepFilter(this._allDocs, this._filter, this._filterType, this._comparator);
    this._sort && this.sort();
    this._docsSubject.next(this._filteredDocs);
  }

  private doesDocPassFilter(doc): boolean {
    let res = deepFilter([doc], this._filter, this._filterType, this._comparator);
    return !!res[0];
  }

  public sort(): T[] {
    if (this._sort.reverse) {
      this._filteredDocs = deepSort(this._filteredDocs).desc('firstName');
    } else {
      this._filteredDocs = deepSort(this._filteredDocs).asc('firstName');
    }
    return this._filteredDocs;
  }

  // ------------------------------------------
  // imperative style
  // ------------------------------------------
  public setFilter = (filter, filterType) => {
    this._filter = filter;
    this._filterType = filterType;
    this.filter();
  };
  public setSort = (sortDef: ISort) => {
    this._sort = sortDef;
    this.sort();
    this._docsSubject.next(this._filteredDocs);
  };

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
    this._sort && this.sort();
    this._docsSubject.next(this._filteredDocs);
    return found;
  }

  public addToStore(model) {
    let addDoc = this.doesDocPassFilter(model);
    if (addDoc) {
      this._filteredDocs.push(model);
      this._sort && this.sort();
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