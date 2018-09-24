export declare class Sync {
    private pouchSync;
    private _subs;
    private _subjects;
    _isListening: boolean;
    change$: import("rxjs/Observable").Observable<{}>;
    docs$: import("rxjs/Observable").Observable<{}>;
    active$: import("rxjs/Observable").Observable<boolean>;
    complete$: import("rxjs/Observable").Observable<boolean>;
    error$: import("rxjs/Observable").Observable<{}>;
    localLastSeq$: import("rxjs/Observable").Observable<{}>;
    remoteLastSeq$: import("rxjs/Observable").Observable<{}>;
    remotePending$: import("rxjs/Observable").Observable<{}>;
    constructor();
    setupListener(pouchSync: any): void;
    cancel(): void;
}
