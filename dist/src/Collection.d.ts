import { Observable } from "rxjs";
import { IModel } from "./interfaces/IModel";
export interface IObservableOptions {
    user?: Observable<string>;
    writePermission?: Observable<boolean>;
    filter?: Observable<any>;
    filterType?: Observable<any>;
    sort?: Observable<any>;
}
export declare class Collection<T extends IModel> {
    private _pouchdb;
    private _allChanges$;
    private _docType;
    private _observableOptions;
    private _hooks;
    private _subs;
    private _allDocsSubject;
    private _store;
    private _docsSubject;
    private _filterStore;
    changes$: Observable<any>;
    insert$: Observable<any>;
    update$: Observable<any>;
    remove$: Observable<any>;
    docs$: Observable<T[]>;
    allDocs$: Observable<T[]>;
    constructor(_pouchdb: any, _allChanges$: any, _docType: string, _observableOptions?: IObservableOptions);
    destroy(): void;
    addHook: (hookName: string, fn: (doc: any) => any) => void;
    setFilter: (filter: any, filterType: any) => void;
    extendComparator: (comparator: any) => void;
    private loadData;
    get(id: string): any;
    create(doc: any): Promise<any>;
    update(doc: any): Promise<any>;
    save(doc: any): Promise<void>;
    remove(doc: any): Promise<any>;
    removeAll(): void;
}
