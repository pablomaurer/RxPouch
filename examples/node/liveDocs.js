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
    console.log('may display an notification that there is a new pokemon', next);
});

pokemons.remove$.subscribe(next => {
    console.log('may navigate away, from current pokemon page', next);
});

pokemons.docs$.subscribe(next => {
    console.log('may display an up to date list of all stored pokemons', next);
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

pokemons.enableLiveDocs();

setTimeout(() => {
    console.log('2 seconds after enabling live docs');

    let pika = {
        _id: 'dreckmon', // will result in pokemon-pikachu
        type: 'pokemon', // not needed, will be set anyway
        name: 'dreckmon',
        power: '120',
        element: 'earth'
    };

    // insert data
    pokemons.create(pika);
}, 2000);

setTimeout(() => {
    console.log('4 seconds after disable live docs');
    pokemons.disableLiveDocs();
}, 4000);

setTimeout(() => {
    console.log('6 seconds after enabling live docs again');
    pokemons.enableLiveDocs();
}, 6000);

setTimeout(() => {
    console.log('8 seconds after enabling live docs again');
}, 8000);