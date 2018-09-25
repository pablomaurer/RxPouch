import {IModel} from "./interfaces/IModel";

export class Store<T extends IModel> {

  private _docs: T[] = [];

  constructor(private _allDocsSubject) {
  }

  public setDocs(docs: any[]) {
    this._docs = docs;
    this._allDocsSubject.next(this._docs);
  }

  public getDocs = () => {
    return this._docs;
  };

  public destroy() {
    this._docs = [];
  }

  // ------------------------------------------
  // helpers
  // ------------------------------------------
  public get(id: string): T {
    return this._docs.find(model => model._id === id);
  }

  public getIndex(id: string): number {
    return this._docs.findIndex(model => model._id === id);
  }

  public first(): T {
    return this._docs[0];
  }

  public last(): T {
    return this._docs[0];
  }

  // ------------------------------------------
  // store crud
  // ------------------------------------------
  public updateInStore(model): boolean {
    let found = false;
    let index = this.getIndex(model._id);
    if (index !== -1) {
      this._docs[index] = model;
      found = true;
    }
    this._allDocsSubject.next(this._docs);
    return found;
  }

  public addToStore(model) {
    this._docs.push(model);
    this._allDocsSubject.next(this._docs);
  }

  public removeFromStore(id: string): boolean {
    let found = false;
    let index = this.getIndex(id);
    if (index !== -1) {
      this._docs.splice(index, 1);
      found = true;
    }
    this._allDocsSubject.next(this._docs);
    return found;
  }
}