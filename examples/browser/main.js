import PouchDB from 'pouchdb';
/*
import PouchDB from 'pouchdb-core';
import PouchIdb from 'pouchdb-adapter-idb';
import PouchHttp from 'pouchdb-adapter-http';
import PouchMapReduce from 'pouchdb-mapreduce';
import PouchReplication from 'pouchdb-replication';

PouchDB.plugin(PouchIdb)
    .plugin(PouchHttp)
    .plugin(PouchMapReduce)
    .plugin(PouchReplication);
*/
let localDb = new PouchDB('mydb');
let remoteDb = new PouchDB('http://localhost:32769/mydb');

async function info() {
    console.log('localDb', await localDb.info());
    console.log('remoteDb', await remoteDb.info());
    console.log('----------------------------------------');
}

let sync;

function startSync() {
    let opts = {
        live: false,
        retry: true,
        since: 0,
        include_docs: false
    };

    //sync = PouchDB.replicate('http://localhost:5984/mydb', 'mydb', opts);
    sync = localDb.sync(remoteDb, opts);

    //let sync = localDb.sync(remoteDb);

    sync.on('change', (info) => {
        console.log('P:change', info);
    }).on('paused', (err) => {
        console.log('P:paused', err);       // replication paused (e.g. replication up to date, user went offline)
    }).on('active', () => {
        console.log('P:active');            // replicate resumed (e.g. new changes replicating, user went back online)
    }).on('denied', (err) => {
        console.log('P:denied', err);       // a document failed to replicate (e.g. due to permissions)
    }).on('complete', (info) => {
        console.log('P:complete', info);    // handle complete
    }).on('error', (err) => {
        console.log('P:error', err);        // handle error
    });
}

function cancelSync() {
    sync.cancel();
}

function showDoc() {
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
}

function createDoc() {
    localDb.put({_id: 'simple-1', field1: 'lala', field2: 'lolo'});
    localDb.put({_id: 'simple-2', field1: 'lala', field2: 'lolo'});
    localDb.put({_id: 'simple-3', field1: 'lala', field2: 'lolo'});
    localDb.put({_id: 'simple-4', field1: 'lala', field2: 'lolo'});
}

document.getElementById("info").addEventListener("click", info);
document.getElementById("start").addEventListener("click", startSync);
document.getElementById("cancel").addEventListener("click", cancelSync);
document.getElementById("createdoc").addEventListener("click", createDoc);
document.getElementById("showdoc").addEventListener("click", showDoc);

