let RxPouch = require("rx-pouch");
let pouchLevelDB = require("pouchdb-adapter-leveldb");

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
});

// add db adapter for nodejs
RxPouch.plugin(pouchLevelDB);

// create database
let localDb = new RxPouch('DB1');
let remoteDb = new RxPouch('http://localhost:32769/mydb');

async function info() {
    console.log('localDb', await localDb.info());
    console.log('remoteDb', await remoteDb.info());
    console.log('----------------------------------------');
}

info();
/*
let sync = localDb.sync(remoteDb);

sync.complete$.subscribe(complete => {
    console.log('completed');

    remoteDb.get('simple-1').then(doc => {
        console.log('remote sample', doc);
    }).catch(err => {
        console.log('remote sample err', err);
    });

    localDb.get('simple-1').then(doc => {
        console.log('local sample', doc);
    }).catch(err => {
        console.log('local sample error', err);
    });
});

let info1 = {
    doc_count: 0,
    update_seq: 0,
    backend_adapter: 'LevelDOWN',
    db_name: 'myDB',
    auto_compaction: false,
    adapter: 'leveldb'
};
let info2 = {
    doc_count: 0,
    update_seq: 0,
    websql_encoding: 'UTF-8',
    db_name: 'dbname',
    auto_compaction: false,
    adapter: 'http',
    instance_start_time: '1534931567063',
    host: 'http://localhost:5984/dbname/'
};

let change = {
    ok: true,
    start_time: '2018-09-14T06:52:15.383Z',
    docs_read: 4,
    docs_written: 4,
    doc_write_failures: 0,
    errors: [],
    last_seq: 4,
    docs: []
};

let ch = {
    direction: 'pull',
    change: {
        ok: true,
        start_time: '2018-09-14T20:35:26.414Z',
        docs_read: 4,
        docs_written: 4,
        doc_write_failures: 0,
        errors: [],
        last_seq: '4-g1AAAA-',
        docs: [[Object], [Object], [Object], [Object]],
        pending: 0
    }
};



/*
remoteDb.get('simple-1').then(doc => {
    console.log('remote sample', doc);
}).catch(err => {
    console.log('remote sample err', err);
});
*/