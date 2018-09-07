import {IModel} from "./interfaces/IModel";

export class Store<T extends IModel> {

  private docs: T[] = [];

  constructor(public docsSubject) {
  }

  public setData(docs: any[]) {
    this.docs = docs;
  }

  public get(id: string): T {
    return this.docs.find(model => model._id === id);
  }

  public getIndex(id: string): number {
    return this.docs.findIndex(model => model._id === id);
  }

  public first(): T {
    return this.docs[0];
  }

  public updateInStore(model): boolean {
    let found = false;
    let index = this.getIndex(model._id);
    if (index !== -1) {
      this.docs[index] = model;
      found = true;
    }
    this.docsSubject.next(this.docs);
    return found;
  }

  public addToStore(model) {
    this.docs.push(model);
    this.docsSubject.next(this.docs);
  }

  public removeFromStore(id: string): boolean {
    let found = false;
    let index = this.getIndex(id);
    if (index !== -1) {
      this.docs.splice(index, 1);
      found = true;
    }
    this.docsSubject.next(this.docs);
    return found;
  }
}