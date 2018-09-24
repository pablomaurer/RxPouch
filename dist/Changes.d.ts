export declare class Changes {
    private pouchChanges;
    private _subs;
    private _subjects;
    _isListening: boolean;
    change$: import("rxjs/Observable").Observable<{}>;
    complete$: import("rxjs/Observable").Observable<boolean>;
    error$: import("rxjs/Observable").Observable<{}>;
    constructor();
    setupListener(pouchChanges: any): void;
    cancel(): void;
}
