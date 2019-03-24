import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { filter, first } from 'rxjs/operators';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Sync = /** @class */ (function () {
    function Sync() {
        this._subs = [];
        this._subjects = {
            change: new Subject(),
            docs: new Subject(),
            active: new BehaviorSubject(false),
            complete: new BehaviorSubject(false),
            error: new Subject(),
            localLastSeq: new Subject(),
            remoteLastSeq: new Subject(),
            remotePending: new Subject(),
        };
        this._isListening = false;
        this.change$ = this._subjects.change.asObservable();
        this.docs$ = this._subjects.docs.asObservable();
        this.active$ = this._subjects.active.asObservable();
        this.complete$ = this._subjects.complete.asObservable();
        this.error$ = this._subjects.error.asObservable();
        this.localLastSeq$ = this._subjects.localLastSeq.asObservable();
        this.remoteLastSeq$ = this._subjects.remoteLastSeq.asObservable();
        this.remotePending$ = this._subjects.remotePending.asObservable();
    }
    Sync.prototype.setupListener = function (pouchSync) {
        var _this = this;
        if (this.pouchSync) {
            this.cancel();
        }
        this.pouchSync = pouchSync;
        this._isListening = true;
        // change
        this._subs.push(fromEvent(this.pouchSync, 'change').subscribe(function (ev) {
            if (ev.direction == 'pull') {
                _this._subjects.remoteLastSeq.next(ev.change.last_seq); // string
                _this._subjects.remotePending.next(ev.pending);
            }
            if (ev.direction == 'push') {
                _this._subjects.localLastSeq.next(ev.change.last_seq);
            }
        }));
        // docs
        this._subs.push(fromEvent(this.pouchSync, 'change').subscribe(function (ev) {
            if (_this._subjects.docs.observers.length === 0 || ev.direction !== 'pull')
                return;
            ev.change.docs.forEach(function (doc) { return _this._subjects.docs.next(doc); });
        }));
        // error
        this._subs.push(fromEvent(this.pouchSync, 'error').subscribe(function (ev) {
            _this._subjects.error.next(ev);
        }));
        // active
        this._subs.push(fromEvent(this.pouchSync, 'active').subscribe(function () {
            _this._subjects.active.next(true);
        }));
        this._subs.push(fromEvent(this.pouchSync, 'paused').subscribe(function () {
            _this._subjects.active.next(false);
        }));
        // complete
        this._subs.push(fromEvent(this.pouchSync, 'complete').subscribe(function (info) {
            _this._subjects.complete.next(info);
        }));
        this.pouchSync.on('change', function (info) {
            console.log('P:change', info);
        }).on('paused', function (err) {
            console.log('P:paused', err); // replication paused (e.g. replication up to date, user went offline)
        }).on('active', function () {
            console.log('P:active'); // replicate resumed (e.g. new changes replicating, user went back online)
        }).on('denied', function (err) {
            console.log('P:denied', err); // a document failed to replicate (e.g. due to permissions)
        }).on('complete', function (info) {
            console.log('P:complete', info); // handle complete
        }).on('error', function (err) {
            console.log('P:error', err); // handle error
        });
    };
    Sync.prototype.cancel = function () {
        var _this = this;
        this.pouchSync && this.pouchSync.cancel();
        this.pouchSync = null;
        this._isListening = false;
        // TODO: why need this? isn't cancel() syncronus? does rxdb also need this?
        setTimeout(function () {
            _this._subs.forEach(function (sub) { return sub.unsubscribe(); });
        }, 0);
    };
    return Sync;
}());

var Changes = /** @class */ (function () {
    function Changes() {
        this._subs = [];
        this._subjects = {
            change: new Subject(),
            docs: new Subject(),
            complete: new BehaviorSubject(false),
            error: new Subject(),
        };
        this._isListening = false;
        this.change$ = this._subjects.change.asObservable();
        this.complete$ = this._subjects.complete.asObservable();
        this.error$ = this._subjects.error.asObservable();
    }
    Changes.prototype.setupListener = function (pouchChanges) {
        var _this = this;
        if (this.pouchChanges) {
            this.cancel();
        }
        this.pouchChanges = pouchChanges;
        this._isListening = true;
        // change
        this._subs.push(fromEvent(this.pouchChanges, 'change').subscribe(function (ev) {
            // fix rxjs 6, no idea why they give an array?
            if (Array.isArray(ev)) {
                ev = ev[0];
            }
            var op = ev.doc._rev.startsWith('1-') ? 'INSERT' : 'UPDATE';
            if (ev.doc._deleted)
                op = 'REMOVE';
            ev.op = op;
            _this._subjects.change.next(ev);
        }));
        // complete
        this._subs.push(fromEvent(this.pouchChanges, 'complete').subscribe(function (info) {
            _this._subjects.complete.next(info);
        }));
        // error
        this._subs.push(fromEvent(this.pouchChanges, 'error').subscribe(function (ev) {
            _this._subjects.error.next(ev);
        }));
    };
    Changes.prototype.cancel = function () {
        var _this = this;
        this.pouchChanges && this.pouchChanges.cancel();
        this.pouchChanges = null;
        this._isListening = false;
        setTimeout(function () {
            _this._subs.forEach(function (sub) { return sub.unsubscribe(); });
        }, 0);
    };
    return Changes;
}());

var Store = /** @class */ (function () {
    function Store(_allDocsSubject) {
        var _this = this;
        this._allDocsSubject = _allDocsSubject;
        this._docs = [];
        this.getDocs = function () {
            return _this._docs;
        };
    }
    Store.prototype.setDocs = function (docs) {
        this._docs = docs;
        this._allDocsSubject.next(this._docs);
    };
    Store.prototype.destroy = function () {
        this._docs = [];
    };
    // ------------------------------------------
    // helpers
    // ------------------------------------------
    Store.prototype.get = function (id) {
        return this._docs.find(function (model) { return model._id === id; });
    };
    Store.prototype.getIndex = function (id) {
        return this._docs.findIndex(function (model) { return model._id === id; });
    };
    Store.prototype.first = function () {
        return this._docs[0];
    };
    Store.prototype.last = function () {
        return this._docs[0];
    };
    // ------------------------------------------
    // store crud
    // ------------------------------------------
    Store.prototype.updateInStore = function (model) {
        var found = false;
        var index = this.getIndex(model._id);
        if (index !== -1) {
            this._docs[index] = model;
            found = true;
        }
        this._allDocsSubject.next(this._docs);
        return found;
    };
    Store.prototype.addToStore = function (model) {
        this._docs.push(model);
        this._allDocsSubject.next(this._docs);
    };
    Store.prototype.removeFromStore = function (id) {
        var found = false;
        var index = this.getIndex(id);
        if (index !== -1) {
            this._docs.splice(index, 1);
            found = true;
        }
        this._allDocsSubject.next(this._docs);
        return found;
    };
    return Store;
}());

var deepFilter = require('deep-array-filter');
var deepSort = require('fast-sort');
// instead piped docs using filter, but will run filter after all changes
var Filter = /** @class */ (function () {
    function Filter(_docsSubject, _getAllDocs, _filter$, _filterType$, _sort$) {
        var _this = this;
        this._docsSubject = _docsSubject;
        this._getAllDocs = _getAllDocs;
        this._filter$ = _filter$;
        this._filterType$ = _filterType$;
        this._sort$ = _sort$;
        this._filter = {};
        this._filterType = {};
        this._filteredDocs = [];
        // ------------------------------------------
        // imperative style
        // ------------------------------------------
        this.setFilter = function (filter, filterType) {
            _this._filter = filter;
            _this._filterType = filterType;
            _this.filter();
        };
        this.setSort = function (sortDef) {
            _this._sort = sortDef;
            _this.sort();
            _this._docsSubject.next(_this._filteredDocs);
        };
        this.extendComparator = function (comparator) {
            _this._comparator = comparator;
        };
        // use init, beacause we need to wait for data to be loaded
    }
    Filter.prototype._init = function () {
        var _this = this;
        this._docsSubject.next(this._getAllDocs());
        if (this._filter$ && this._filterType$) {
            this._filter$.combineLatest(this._filterType$, this.setFilter);
        }
        if (this._sort$) {
            this._sort$.subscribe(function (next) {
                _this._sort = next;
            });
        }
    };
    // ------------------------------------------
    // filter / store
    // ------------------------------------------
    Filter.prototype.filter = function () {
        this._filteredDocs = deepFilter(this._getAllDocs(), this._filter, this._filterType, this._comparator);
        this._sort && this.sort();
        this._docsSubject.next(this._filteredDocs);
    };
    Filter.prototype.doesDocPassFilter = function (doc) {
        var res = deepFilter([doc], this._filter, this._filterType, this._comparator);
        return !!res[0];
    };
    Filter.prototype.sort = function () {
        if (this._sort.reverse) {
            this._filteredDocs = deepSort(this._filteredDocs).desc(this._sort.field);
        }
        else {
            this._filteredDocs = deepSort(this._filteredDocs).asc(this._sort.field);
        }
        return this._filteredDocs;
    };
    // ------------------------------------------
    // borrowed from store.ts - update filter store
    // ------------------------------------------
    Filter.prototype.getIndex = function (id) {
        return this._filteredDocs.findIndex(function (model) { return model._id === id; });
    };
    Filter.prototype.updateInStore = function (model) {
        var addDoc = this.doesDocPassFilter(model);
        var found = false;
        if (addDoc) {
            var index = this.getIndex(model._id);
            if (index !== -1) {
                this._filteredDocs[index] = model;
                found = true;
            }
        }
        else {
            this.removeFromStore(model._id);
        }
        this._sort && this.sort();
        this._docsSubject.next(this._filteredDocs);
        return found;
    };
    Filter.prototype.addToStore = function (model) {
        var addDoc = this.doesDocPassFilter(model);
        if (addDoc) {
            this._filteredDocs.push(model);
            this._sort && this.sort();
            this._docsSubject.next(this._filteredDocs);
        }
        return addDoc;
    };
    Filter.prototype.removeFromStore = function (id) {
        var found = false;
        var index = this.getIndex(id);
        if (index !== -1) {
            this._filteredDocs.splice(index, 1);
            found = true;
        }
        this._docsSubject.next(this._filteredDocs);
        return found;
    };
    // ------------------------------------------
    // destroy
    // ------------------------------------------
    Filter.prototype.destroy = function () {
        this._filteredDocs = [];
    };
    return Filter;
}());

var EHook;
(function (EHook) {
    EHook["PRE_CREATE"] = "preCreate";
    EHook["POST_CREATE"] = "postCreate";
    EHook["PRE_UPDATE"] = "preUpdate";
    EHook["POST_UPDATE"] = "postUpdate";
    EHook["PRE_SAVE"] = "preSave";
    EHook["POST_SAVE"] = "postSave";
    EHook["PRE_REMOVE"] = "preRemove";
    EHook["POST_REMOVE"] = "postRemove";
})(EHook || (EHook = {}));
var Hook = /** @class */ (function () {
    function Hook() {
        var _this = this;
        this.preCreate = null;
        this.postCreate = null;
        this.preUpdate = null;
        this.postUpdate = null;
        this.preSave = null;
        this.postSave = null;
        this.preRemove = null;
        this.postRemove = null;
        this.addHook = function (hookName, fn) {
            if (!_this[hookName]) {
                _this[hookName] = [];
            }
            _this[hookName].push(fn);
        };
    }
    Hook.prototype.runHooks = function (hookName, doc) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, fn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this[hookName])
                            return [2 /*return*/, doc];
                        _i = 0, _a = this[hookName];
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        fn = _a[_i];
                        return [4 /*yield*/, fn(doc)];
                    case 2:
                        doc = _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, doc];
                }
            });
        });
    };
    return Hook;
}());

var Collection = /** @class */ (function () {
    function Collection(_pouchdb, _allChanges$, _docType, _observableOptions) {
        // todo observable filters
        if (_observableOptions === void 0) { _observableOptions = {}; }
        var _this = this;
        this._pouchdb = _pouchdb;
        this._allChanges$ = _allChanges$;
        this._docType = _docType;
        this._observableOptions = _observableOptions;
        this._hooks = new Hook();
        this._subs = [];
        this._subsOpts = [];
        this._allDocsSubject = new BehaviorSubject([]);
        this._docsSubject = new BehaviorSubject([]);
        this._store = new Store(this._allDocsSubject);
        this._filter = new Filter(this._docsSubject, this._store.getDocs, this._observableOptions.filter, this._observableOptions.filterType, this._observableOptions.sort);
        this.docs$ = this._docsSubject.asObservable();
        this.allDocs$ = this._allDocsSubject.asObservable();
        this.isLiveDocsEnabled = false;
        this.addHook = this._hooks.addHook;
        this.setFilter = this._filter.setFilter;
        // else it generates type definitoin with strange import
        this.setSort = this._filter.setSort;
        this.extendComparator = this._filter.extendComparator;
        if (this._observableOptions.user) {
            this._subsOpts.push(this._observableOptions.user.pipe(filter(function (user) { return user; })).subscribe(function (next) {
                _this.isLiveDocsEnabled && _this.loadDocs();
            }));
        }
        // ------------------------------------------
        // create changes$, insert$, update$, remove$
        // ------------------------------------------
        this.changes$ = this._allChanges$.pipe(filter(function (change) { return change.doc.type === _this._docType || change.id.startsWith(_this._docType); }));
        this.insert$ = this.changes$.pipe(filter(function (change) { return change.op === 'INSERT'; }));
        this.update$ = this.changes$.pipe(filter(function (change) { return change.op === 'UPDATE'; }));
        this.remove$ = this.changes$.pipe(filter(function (change) { return change.op === 'REMOVE'; }));
    }
    // ------------------------------------------
    // live docs$
    // ------------------------------------------
    Collection.prototype.enableLiveDocs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isLiveDocsEnabled)
                            return [2 /*return*/];
                        this.isLiveDocsEnabled = true;
                        return [4 /*yield*/, this.loadDocs()];
                    case 1:
                        res = _a.sent();
                        this._subs.push(this.insert$.subscribe(function (next) {
                            _this._store.addToStore(next.doc);
                            _this._filter.addToStore(next.doc);
                        }));
                        this._subs.push(this.update$.subscribe(function (next) {
                            _this._store.updateInStore(next.doc);
                            _this._filter.updateInStore(next.doc);
                        }));
                        this._subs.push(this.remove$.subscribe(function (next) {
                            _this._store.removeFromStore(next.doc);
                            _this._filter.removeFromStore(next.doc);
                        }));
                        return [2 /*return*/, res];
                }
            });
        });
    };
    Collection.prototype.disableLiveDocs = function () {
        if (!this.isLiveDocsEnabled)
            return;
        this.isLiveDocsEnabled = false;
        this._subs.forEach(function (sub) { return sub.unsubscribe(); });
        this._filter.destroy();
        this._store.destroy();
    };
    // ------------------------------------------
    // methods
    // ------------------------------------------
    Collection.prototype.loadDocs = function () {
        var _this = this;
        return this.all().then(function (res) {
            _this._store.setDocs(res);
            _this._filter._init();
        });
    };
    Collection.prototype.destroy = function () {
        this.disableLiveDocs();
        this._subsOpts.forEach(function (sub) { return sub.unsubscribe(); });
    };
    // ------------------------------------------
    // crud
    // ------------------------------------------
    Collection.prototype.get = function (id) {
        return this._pouchdb.get(id);
    };
    Collection.prototype.create = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        doc.type = this._docType;
                        doc._id = this._docType + '-' + doc._id;
                        return [4 /*yield*/, this._hooks.runHooks(EHook.PRE_CREATE, doc)];
                    case 1:
                        doc = _a.sent();
                        return [2 /*return*/, this._pouchdb.create(doc).then(function () {
                                _this._hooks.runHooks(EHook.POST_CREATE, doc);
                            })];
                }
            });
        });
    };
    Collection.prototype.update = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hooks.runHooks(EHook.PRE_UPDATE, doc)];
                    case 1:
                        doc = _a.sent();
                        return [2 /*return*/, this._pouchdb.update(doc).then(function () {
                                _this._hooks.runHooks(EHook.PRE_UPDATE, doc);
                            })];
                }
            });
        });
    };
    Collection.prototype.save = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hooks.runHooks(EHook.PRE_SAVE, doc)];
                    case 1:
                        doc = _a.sent();
                        promise = doc._rev ? this.update(doc) : this.create(doc);
                        return [2 /*return*/, promise.then(function () {
                                _this._hooks.runHooks(EHook.POST_SAVE, doc);
                            })];
                }
            });
        });
    };
    Collection.prototype.remove = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hooks.runHooks(EHook.PRE_REMOVE, doc)];
                    case 1:
                        doc = _a.sent();
                        return [2 /*return*/, this._pouchdb.remove(doc).then(function () {
                                _this._hooks.runHooks(EHook.POST_REMOVE, doc);
                            })];
                }
            });
        });
    };
    Collection.prototype.removeAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.all().then(function (docs) {
                        return Promise.all(docs.map(function (doc) {
                            return _this._pouchdb.remove(doc);
                        }));
                    })];
            });
        });
    };
    Collection.prototype.all = function () {
        return __awaiter(this, void 0, void 0, function () {
            var endkey, user, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endkey = this._docType + '-\uffff';
                        if (!this._observableOptions.user) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._observableOptions.user.pipe(first(function (user) { return user; })).toPromise()];
                    case 1:
                        user = _a.sent();
                        endkey = this._docType + '-' + user + '\uffff';
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this._pouchdb.allDocs({
                            startkey: this._docType,
                            endkey: endkey,
                            include_docs: true
                        })];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, res.rows.map(function (row) {
                                return row.doc;
                            })];
                }
            });
        });
    };
    return Collection;
}());

//const PouchDB = require('pouchdb/dist/pouchdb');
//import PouchDB from 'pouchdb/dist/pouchdb';
var PouchDB = require('pouchdb-core');
var PouchHttp = require('pouchdb-adapter-http');
var PouchMapReduce = require('pouchdb-mapreduce');
var PouchReplication = require('pouchdb-replication');
PouchDB.plugin(PouchHttp);
PouchDB.plugin(PouchMapReduce);
PouchDB.plugin(PouchReplication);
// still need to add your local pouchdb adapter:
// browser: pouchdb-adapter-idb
// node:    pouchdb-adapter-leveldb
// cordova: pouchdb-adapter-websql
var Db = /** @class */ (function () {
    function Db(_name, _options) {
        var _this = this;
        this._name = _name;
        this._options = _options;
        this._hooks = new Hook();
        this.pouchdb = new PouchDB(this._name, this._options);
        this.rxSync = new Sync();
        this.rxChange = new Changes();
        this.collections = {};
        // ------------------
        // methods proxy
        // ------------------
        this.info = this.pouchdb.info;
        this.compact = this.pouchdb.compact;
        this.revsDiff = this.pouchdb.revsDiff;
        this.putAttachment = this.pouchdb.putAttachment;
        this.getAttachment = this.pouchdb.getAttachment;
        this.removeAttachment = this.pouchdb.removeAttachment;
        // ------------------
        // CRUD
        // ------------------
        this.get = this.pouchdb.get;
        this.bulkGet = this.pouchdb.bulkGet;
        this.bulkDocs = this.pouchdb.bulkDocs;
        this.allDocs = this.pouchdb.allDocs;
        this.addHook = this._hooks.addHook;
        this.pouchdb.create = function (doc) {
            return _this.pouchdb.put(doc).then(function (meta) {
                doc._id = meta.id;
                doc._rev = meta.rev;
                return doc;
            });
        };
        this.pouchdb.update = function (doc) {
            // TODO: fetch new rev before updating? else remove, since it's the same as create
            return _this.pouchdb.put(doc).then(function (meta) {
                doc._id = meta.id;
                doc._rev = meta.rev;
                return doc;
            });
        };
        this.pouchdb.save = function (doc) {
            return doc._rev ? _this.update(doc) : _this.create(doc);
        };
    }
    // ------------------
    // statics
    // ------------------
    Db.replicate = function (source, target, options) {
        source.replicateTo(target, options);
        return source.rxSync;
    };
    Db.sync = function (source, target, options) {
        source.sync(target, options);
        return source.rxSync;
    };
    Db.prototype.remove = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hooks.runHooks(EHook.PRE_REMOVE, doc)];
                    case 1:
                        doc = _a.sent();
                        return [4 /*yield*/, this.pouchdb.remove(doc)];
                    case 2:
                        doc = _a.sent();
                        return [4 /*yield*/, this._hooks.runHooks(EHook.POST_REMOVE, doc)];
                    case 3:
                        doc = _a.sent();
                        return [2 /*return*/, doc];
                }
            });
        });
    };
    Db.prototype.create = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hooks.runHooks(EHook.PRE_CREATE, doc)];
                    case 1:
                        doc = _a.sent();
                        return [4 /*yield*/, this.pouchdb.create(doc)];
                    case 2:
                        doc = _a.sent();
                        return [4 /*yield*/, this._hooks.runHooks(EHook.POST_CREATE, doc)];
                    case 3:
                        doc = _a.sent();
                        return [2 /*return*/, doc];
                }
            });
        });
    };
    Db.prototype.update = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hooks.runHooks(EHook.PRE_UPDATE, doc)];
                    case 1:
                        doc = _a.sent();
                        return [4 /*yield*/, this.pouchdb.update(doc)];
                    case 2:
                        doc = _a.sent();
                        doc = this._hooks.runHooks(EHook.POST_UPDATE, doc);
                        return [2 /*return*/, doc];
                }
            });
        });
    };
    Db.prototype.save = function (doc) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._hooks.runHooks(EHook.PRE_SAVE, doc)];
                    case 1:
                        doc = _a.sent();
                        return [4 /*yield*/, this.pouchdb.save(doc)];
                    case 2:
                        doc = _a.sent();
                        return [4 /*yield*/, this._hooks.runHooks(EHook.POST_SAVE, doc)];
                    case 3:
                        doc = _a.sent();
                        return [2 /*return*/, doc];
                }
            });
        });
    };
    Db.prototype.removeAll = function () {
        var _this = this;
        return this.all().then(function (docs) {
            return Promise.all(docs.map(function (doc) {
                return _this.pouchdb.remove(doc);
            }));
        });
    };
    Db.prototype.all = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pouchdb.allDocs({
                            include_docs: true
                        })];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.rows.map(function (row) {
                                return row.doc;
                            })];
                }
            });
        });
    };
    // ------------------
    // methods
    // ------------------
    Db.prototype.destroy = function () {
        var _this = this;
        Object.keys(this.collections).forEach(function (key) { return _this.collections[key].destroy(); });
        this.rxChange.cancel();
        this.rxSync.cancel();
    };
    Db.prototype.sync = function (remoteDb, options) {
        this.rxSync.setupListener(this.pouchdb.sync(remoteDb.pouchdb, options));
        return this.rxSync;
    };
    Db.prototype.replicateTo = function (remoteDb, options) {
        this.rxSync.setupListener(this.pouchdb.replicate.to(remoteDb.pouchdb, options));
        return this.rxSync;
    };
    Db.prototype.replicateFrom = function (remoteDb, options) {
        this.rxSync.setupListener(this.pouchdb.replicate.from(remoteDb.pouchdb, options));
        return this.rxSync;
    };
    Db.prototype.changes = function () {
        var changeOpts = {
            live: true,
            include_docs: true,
            since: 'now',
            return_docs: false
        };
        this.rxChange.setupListener(this.pouchdb.changes(changeOpts));
        return this.rxChange;
    };
    Db.prototype.collection = function (docType, observableOptions) {
        if (this.collections[docType] == docType) {
            return this.collections[docType];
        }
        var collection = new Collection(this.pouchdb, this.rxChange.change$, docType, observableOptions);
        this.collections[docType] = collection;
        return collection;
    };
    // ------------------
    // statics proxy
    // ------------------
    Db.debug = PouchDB.debug;
    Db.plugin = PouchDB.plugin;
    Db.defaults = PouchDB.defaults;
    return Db;
}());

export default Db;
