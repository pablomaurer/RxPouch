import { RxSync } from "./RxSync";
import { RxChanges } from "./RxChanges";
import { RxCollection } from "./RxCollection";
export declare class RxDb {
    dbLocal: any;
    dbRemote: any;
    rxSync: RxSync;
    rxChange: RxChanges;
    collections: {};
    constructor();
    login(remote: string, local: string): void;
    logout(): void;
    dump(): void;
    importDump(): void;
    info(): Promise<any>;
    sync(live: boolean, writePermission?: boolean): RxSync;
    changes(): RxChanges;
    get(id: string): Promise<any>;
    insert(doc: any): Promise<any>;
    remove(doc: any): Promise<any>;
    collection(docType: string, user?: string): RxCollection<any>;
}
