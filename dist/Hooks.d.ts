export declare enum EHook {
    PRE_CREATE = "preCreate",
    POST_CREATE = "postCreate",
    PRE_UPDATE = "preUpdate",
    POST_UPDATE = "postUpdate",
    PRE_SAVE = "preSave",
    POST_SAVE = "postSave",
    PRE_REMOVE = "preRemove",
    POST_REMOVE = "postRemove"
}
export declare class Hook {
    private preCreate;
    private postCreate;
    private preUpdate;
    private postUpdate;
    private preSave;
    private postSave;
    private preRemove;
    private postRemove;
    constructor();
    addHook: (hookName: string, fn: (doc: any) => any) => void;
    runHooks(hookName: EHook | string, doc: any): Promise<any>;
}
