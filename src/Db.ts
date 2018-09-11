// import * as PouchDB from 'pouchdb-core';
import {Sync} from "./Sync";
import {Changes} from "./Changes";
import {Collection} from "./Collection";
import ReplicateOptions = PouchDB.Replication.ReplicateOptions;
import {EHook, Hook} from "./Hooks";

const PouchDB = require('pouchdb-core')
  .plugin(require('pouchdb-adapter-http'))
  .plugin(require('pouchdb-mapreduce'))
  .plugin(require('pouchdb-replication'));
// still need to add your local pouchdb adapter:
// browser: pouchdb-adapter-idb
// node:    pouchdb-adapter-leveldb
// cordova: pouchdb-adapter-websql

export default class Db {

  private _hooks = new Hook();

  public pouchdb = new PouchDB(this._name, this._options);
  public rxSync = new Sync();
  public rxChange = new Changes();
  public collections = {};

  constructor(private _name: string, private _options: any) {

    this.pouchdb.create = (doc) => {
      return this.pouchdb.put(doc).then(meta => {
        doc._id = meta.id;
        doc._rev = meta.rev;
        return doc
      })
    };

    this.pouchdb.update = (doc) => {
      // TODO: fetch new rev before updating? else remove, since it's the same as create
      return this.pouchdb.put(doc).then(meta => {
          doc._id = meta.id;
          doc._rev = meta.rev;
          return doc
        })
    };

    this.pouchdb.save = (doc) => {
      return doc._rev ? this.update(doc): this.create(doc);
    };
  }

  // ------------------
  // statics
  // ------------------
  public static replicate(source: Db, target: Db, options: ReplicateOptions) {
    source.replicateTo(target, options);
    return source.rxSync;
  }

  public static sync(source: Db, target: Db, options: ReplicateOptions) {
    source.sync(target, options);
    return source.rxSync;
  }

  // ------------------
  // statics proxy
  // ------------------
  public static debug = PouchDB.debug;
  public static plugin = PouchDB.plugin;
  public static defaults = PouchDB.defaults;

  // ------------------
  // methods proxy
  // ------------------
  public info = this.pouchdb.info;
  public compact = this.pouchdb.compact;
  public revsDiff = this.pouchdb.revsDiff;

  public putAttachment = this.pouchdb.putAttachment;
  public getAttachment = this.pouchdb.getAttachment;
  public removeAttachment = this.pouchdb.removeAttachment;

  // ------------------
  // CRUD
  // ------------------

  public get = this.pouchdb.get;

  public async remove(doc: any) {
    doc = await this._hooks.runHooks(EHook.PRE_REMOVE, doc);
    return this.pouchdb.remove(doc).then(() =>{
      this._hooks.runHooks(EHook.POST_REMOVE, doc);
    });
  }
  public async create(doc: any) {
    doc = await this._hooks.runHooks(EHook.PRE_CREATE, doc);
    return this.pouchdb.create(doc).then(() => {
      this._hooks.runHooks(EHook.POST_CREATE, doc);
    });
  }
  public async update(doc: any) {
    doc = await this._hooks.runHooks(EHook.PRE_UPDATE, doc);
    return this.pouchdb.update(doc).then(() => {
      this._hooks.runHooks(EHook.POST_UPDATE, doc);
    });
  }
  public async save(doc: any) {
    doc = await this._hooks.runHooks(EHook.PRE_SAVE, doc);
    return this.pouchdb.save(doc).then(() => {
      this._hooks.runHooks(EHook.POST_SAVE, doc);
    });
  }

  public removeAll() {
    // todo
  }

  public bulkGet() {
    return this.pouchdb.bulkGet;
  }
  public bulkDocs() {
    return this.pouchdb.bulkDocs;
  }
  public allDocs() {
    return this.pouchdb.allDocs;
  }


  // ------------------
  // methods
  // ------------------
  public destroy() {
    // stop sync
    // stop changelistener
    // cleanup all collections
    // cleanup all syncs
  }

  public addHook = this._hooks.addHook;

  public sync(remoteDb, options) {
    this.rxSync.setupListener(this.pouchdb.sync(remoteDb, options));
    return this.rxSync;
  }

  public replicateTo(remoteDb, options) {
    this.rxSync.setupListener(this.pouchdb.replicate(remoteDb, options));
    return this.rxSync;
  }

  public replicateFrom(remoteDb, options) {
    this.rxSync.setupListener(this.pouchdb.replicate(remoteDb, options));
    return this.rxSync;
  }

  public changes() {
    const changeOpts = {
      live: true,
      include_docs: true,
      since: 'now',
      return_docs: false
    };
    this.rxChange.setupListener(this.pouchdb.changes(changeOpts));
    return this.rxChange;
  }

  public collection(docType: string, user?: string): Collection<any> {
    if (this.collections[docType] == docType) {
      return this.collections[docType];
    }
    let collection = new Collection(this.pouchdb, this.rxChange.change$, docType, user);
    this.collections[docType] = collection;
    return collection;
  }

}