let RxPouch = require("rx-pouch");
let pouchLevelDB = require("pouchdb-adapter-leveldb");

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
});


// add db adapter for nodejs
RxPouch.plugin(pouchLevelDB);

// create database
let db = new RxPouch('myDB5');

// start listening for changes, enables all observers
let changes = db.changes();
changes.change$.subscribe(next => {
    console.log('change', next._id);
});

// create collection
let pokemons = db.collection('pokemon');

// listen for changes
pokemons.insert$.subscribe(next => {
    console.log('may display an notification that there is a new pokemon', next.id);
});

pokemons.docs$.subscribe(next => {
    console.log('may display an up to date list of all stored pokemons', next.length, next);
});

let pika = {
    _id: 'pikachu', // will result in pokemon-pikachu
    type: 'pokemon', // not needed, will be set anyway
    name: 'Pikachu',
    power: '120',
    element: 'power'
};
let fluffeluff = {
    _id: 'fluffeluff', // will result in pokemon-fluffeluff
    type: 'pokemon', // not needed, will be set anyway
    name: 'Fluffeluff',
    power: '50',
    element: 'earth'
};
let griffel = {
    _id: 'griffel', // will result in pokemon-griffel
    type: 'pokemon', // not needed, will be set anyway
    name: 'Griffel',
    power: '70',
    element: 'normal'
};

// docs 0

// docs 1
setTimeout(() => {
    pokemons.create(pika);
}, 1000);

// docs 2
setTimeout(() => {
    pokemons.create(fluffeluff);
}, 2000);

// docs 1, since fluffeluff got filtered out, by not having more than 60 power
setTimeout(() => {
    pokemons.setFilter({power: 60}, {power: 'gt'});
}, 3000);

// docs 2, since we got another pokemon with more than 60 power
// but allDocs$, would now be 3
setTimeout(() => {
    pokemons.create(griffel);
}, 4000);