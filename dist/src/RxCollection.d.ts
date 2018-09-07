import { Observable } from "rxjs";
import { IModel } from "./interfaces/IModel";
export declare class RxCollection<T extends IModel> {
    private localPouch;
    private allChanges$;
    private docType;
    private user?;
    private _subs;
    private docsSubject;
    private rxStore;
    changes$: any;
    insert$: any;
    update$: any;
    remove$: any;
    docs$: Observable<T[]>;
    constructor(localPouch: any, allChanges$: any, docType: string, user?: any);
    destroy(): void;
    private loadData;
    get(id: string): Promise<any>;
    saveId(id: string): Promise<any>;
    insert(doc: T): Promise<any>;
    remove(doc: T): Promise<any>;
}
