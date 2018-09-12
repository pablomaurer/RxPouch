# Changes
To enable all observables, you must listen for changes. Else they will never emit anything.
Also needed for observables in collections. *(maybe we should enable this by default?)*
```js
let changes = db.changes();
```

RxPouch will cache the changes object on the database, so you can also access the changes 
instance via `db.changes`.

# Cancel changes
This will stop listening for changes, so all observables will stop emmitting new values.
```js
changes.cancel();
```

# Observables

## change$
```js
changes.change$.subscribe(change => {
    console.log('got some changes', change);
});
```
## complete$
```js
changes.complete$.subscribe(complete => {
    console.log('changes got stopped?', complete);
});
```
## error$
```js
changes.error$.subscribe(error => {
    console.log('error in changes?', error);
});
```