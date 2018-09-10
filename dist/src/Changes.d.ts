export declare class Changes {
    private pouchChanges;
    private _subs;
    private _subjects;
    _isListening: boolean;
    change$: import("rxjs/internal/Observable").Observable<{}>;
    complete$: import("rxjs/internal/Observable").Observable<boolean>;
    error$: import("rxjs/internal/Observable").Observable<{}>;
    constructor();
    setupListener(pouchChanges: any): void;
    cancel(): void;
}
