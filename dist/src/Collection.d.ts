import { Observable } from "rxjs";
import { IModel } from "./interfaces/IModel";
export declare class Collection<T extends IModel> {
    private _pouchdb;
    private _allChanges$;
    private _docType;
    private _user?;
    private _hooks;
    private _subs;
    private _docsSubject;
    private _rxStore;
    changes$: Observable<any>;
    insert$: Observable<any>;
    update$: Observable<any>;
    remove$: Observable<any>;
    docs$: Observable<T[]>;
    constructor(_pouchdb: any, _allChanges$: any, _docType: string, _user?: any);
    destroy(): void;
    addHook: (hookName: string, fn: (doc: any) => any) => void;
    private loadData;
    get(id: string): any;
    create(doc: any): Promise<any>;
    update(doc: any): Promise<any>;
    save(doc: any): Promise<void>;
    remove(doc: any): Promise<any>;
    removeAll(): void;
}
