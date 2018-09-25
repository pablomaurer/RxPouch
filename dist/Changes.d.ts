import { Observable } from "rxjs";
export declare class Changes {
    private pouchChanges;
    private _subs;
    private _subjects;
    _isListening: boolean;
    change$: Observable<any>;
    complete$: Observable<any>;
    error$: Observable<any>;
    constructor();
    setupListener(pouchChanges: any): void;
    cancel(): void;
}
