/// <reference types="pouchdb-replication" />
/// <reference types="debug" />
/// <reference types="pouchdb-core" />
/// <reference types="pouchdb-adapter-fruitdown" />
/// <reference types="pouchdb-adapter-http" />
/// <reference types="pouchdb-adapter-idb" />
/// <reference types="pouchdb-adapter-leveldb" />
/// <reference types="pouchdb-adapter-localstorage" />
/// <reference types="pouchdb-adapter-memory" />
/// <reference types="pouchdb-adapter-websql" />
/// <reference types="pouchdb-find" />
/// <reference types="pouchdb-mapreduce" />
import { Sync } from "./Sync";
import { Changes } from "./Changes";
import { Collection } from "./Collection";
import ReplicateOptions = PouchDB.Replication.ReplicateOptions;
export declare class Db {
    private _name;
    private _options;
    private _hooks;
    pouchdb: any;
    rxSync: Sync;
    rxChange: Changes;
    collections: {};
    constructor(_name: string, _options: any);
    static replicate(source: Db, target: Db, options: ReplicateOptions): Sync;
    static sync(source: Db, target: Db, options: ReplicateOptions): Sync;
    static debug: import("debug").IDebug;
    static plugin: (plugin: "This should be passed to PouchDB.plugin()") => PouchDB.Static;
    static defaults: (options: PouchDB.Configuration.DatabaseConfiguration) => new <Content extends {} = {}>(name?: string, options?: PouchDB.Configuration.DatabaseConfiguration) => PouchDB.Database<Content>;
    info: any;
    compact: any;
    revsDiff: any;
    putAttachment: any;
    getAttachment: any;
    removeAttachment: any;
    get: any;
    remove(doc: any): any;
    create(doc: any): any;
    update(doc: any): any;
    save(doc: any): any;
    removeAll(): void;
    bulkGet(): any;
    bulkDocs(): any;
    allDocs(): any;
    destroy(): void;
    addHook: (hookName: string, fn: (doc: any) => any) => void;
    sync(remoteDb: any, options: any): Sync;
    replicateTo(remoteDb: any, options: any): Sync;
    replicateFrom(remoteDb: any, options: any): Sync;
    changes(): Changes;
    collection(docType: string, user?: string): Collection<any>;
}
