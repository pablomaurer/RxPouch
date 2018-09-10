import { IModel } from "./interfaces/IModel";
export declare class Store<T extends IModel> {
    docsSubject: any;
    private docs;
    constructor(docsSubject: any);
    setData(docs: any[]): void;
    get(id: string): T;
    getIndex(id: string): number;
    first(): T;
    updateInStore(model: any): boolean;
    addToStore(model: any): void;
    removeFromStore(id: string): boolean;
}
