import { IModel } from "./interfaces/IModel";
export declare class Store<T extends IModel> {
    private _allDocsSubject;
    private _docs;
    constructor(_allDocsSubject: any);
    setDocs(docs: any[]): void;
    getDocs: () => T[];
    destroy(): void;
    get(id: string): T;
    getIndex(id: string): number;
    first(): T;
    last(): T;
    updateInStore(model: any): boolean;
    addToStore(model: any): void;
    removeFromStore(id: string): boolean;
}
