### updated rxjs to 6.0.0

# Under heavy development
You can use it, but stuff might still changes quickly, until we are at version 1.0.0

# Docs
Read the [official docs](https://mnewmedia.github.io/RxPouch/#/) or look in the example directory.

# Introduction
RxPouch is [RxJS](https://github.com/ReactiveX/rxjs) powered [PouchDB](https://github.com/pouchdb/pouchdb), 
with some additional features, but still tried to provide all the same base functionallities. You can 
almost everywhere consult the [PouchDB Docs](https://pouchdb.com/api.html) for further information.

## Installation
```
npm install rx-pouch --save
npm install rxjs --save
```

## Difference to RxDB
Well a lot of credits goes to [RxDB](https://github.com/pubkey/rxdb), since we borrowed a lot from them.
In RxDB every collection creates a new database, which is in `most` use-cases perfectly fine.
`For my use-case it wasn't.`

- RxDB uses multiply databases, RxPouch uses document keys with the prefix `<collection>-` and adds to each 
 document a property `type: '<collection>'`
- RxDB has their own API
- RxPouch tried to follow the official PouchDB API as close as possible, but also added some sugar.
- RxPouch got less features (Leader Election, Schema, Population etc..)
- RxPouch has a different filter / sorting system

## Example usage
```js
let RxPouch = require("rx-pouch");
let pouchLevelDB = require("pouchdb-adapter-leveldb");

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
});


// add db adapter for nodejs
RxPouch.plugin(pouchLevelDB);

// create database
let db = new RxPouch('myDB');

// start listening for changes, enables all observers
let changes = db.changes();
changes.change$.subscribe(next => {
    console.log('change', next);
});

// create collection
let pokemons = db.collection('pokemon');

// listen for changes
pokemons.insert$.subscribe(next => {
    console.log('may display an notification that there is a new pokemon');
});

pokemons.remove$.subscribe(next => {
    console.log('may navigate away, from current pokemon page');
});

pokemons.docs$.subscribe(next => {
    console.log('may display an up to date list of all stored pokemons');
});

// create a doc
let pika = {
    _id: 'pikachu', // will result in pokemon-pikachu
    type: 'pokemon', // not needed, will be set anyway
    name: 'Pikachu',
    power: '120',
    element: 'power'
};

// insert data
pokemons.create(pika);
```