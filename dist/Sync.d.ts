import { Observable } from "rxjs";
export declare class Sync {
    private pouchSync;
    private _subs;
    private _subjects;
    _isListening: boolean;
    change$: Observable<any>;
    docs$: Observable<any>;
    active$: Observable<any>;
    complete$: Observable<any>;
    error$: Observable<any>;
    localLastSeq$: Observable<any>;
    remoteLastSeq$: Observable<any>;
    remotePending$: Observable<any>;
    constructor();
    setupListener(pouchSync: any): void;
    cancel(): void;
}
