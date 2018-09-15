# Collection
Collections are a concept to handle documents of the same type. Documents in a collection will have 
an `id` which will be prefixed with the collection type (`id: 'collectionType-...'`). Also they will have
a `type` property wich contains the collectionType (`type: 'collectoinType'`).

## Create
```js
// optinal options
let options = {
    user: Observable<string>,
    writePermission: Observable<boolean>,
    filter: Observable<any>,
    filterTypes: Observable<any>
    sort: Observable<any>

};
let collection = db.collection('customer', options);
```

All created collections, will be cached on the `db object`, so you can also access them via `db.collectionName`.
A collection of a specified type, can only be created once.

## Destroy
Destroys the collection, and cleans up all bindings.

```js
collection.destroy();
```

## All
Get all docs from db, returns array containing all docs.
```js
db.all();
```

## Remove All
Deletes all documents within a collection.

```js
collection.removeAll();
```

## CRUD
Beside the normal PouchDB functions, we provide you with following additions:
- create
- update
- save

You can still use all normal PouchDb functions:
- [create, update](https://pouchdb.com/api.html#create_document)
- [get](https://pouchdb.com/api.html#fetch_document)
- [delete](https://pouchdb.com/api.html#delete_document)
- [batch create](https://pouchdb.com/api.html#batch_create)
- [batch fetch](https://pouchdb.com/api.html#batch_fetch)
- [batch get](https://pouchdb.com/api.html#bulk_get)
- [save attachment](https://pouchdb.com/api.html#save_attachment)
- [get attachment](https://pouchdb.com/api.html#get_attachment)
- [delete attachment](https://pouchdb.com/api.html#delete_attachment)

## Filtering

You can filter the docs with defining a filter like:
```js
let pokeFilter = {
    $: 'pokemon',
    power: 80,
    size: {
        height: '100cm',
    }
};
```
- Since you did not define a the filterTypes, it will use the `includes` comparator for all search properties.
- The `$` property it a wildcard search, so it will look if the object contains in any property `pokemon`.
- You can use nested search

Now let's assume we want all Pokemons with a greater power than 80, so for that we need to create a `filterType` object:
```js
let pokeFilterType = {
    power: 'gt'
}
```
All other properties still use the `includes` comparator.

Read more about the filter at: [deep-array-filter](https://github.com/mnewmedia/deep-array-filter).

### Automated filtering using your observables

You can also provide the collection with observables of your filter and filterType, then it will automatically filter
based on your observable.
```js
let options = {
    filter: Observable<any>,
    filterTypes: Observable<any>
};
let collection = db.collection('customer', options);
```

### Manual filtering using setFilter
Instead of observable based filtering, you can also do it by manually with a function:
```js
let collection = db.collection('pokemon', options);
collection.setFilter(pokeFilter, pokeFilterType);
```
this will rerun the filter through all docs and emit the new filtered collection via the `docs$` observable.

### Comparator
There are following base comparators
- gt
- lt
- includes

```js
let filterType = {
    age: 'customFilter'
};

let customComparators = {
    customFilter: (value, filter) => {
        return value > filter;
    }
};

collection.extendComparator(customComparators);
```
If you think the filter is usable for other people too, feel free to open a PR at 
[deep-array-filter](https://github.com/mnewmedia/deep-array-filter).

## Sorting
For sorting you bassically just need to provide an object like this:
```js
let sortDefinition = {
    field: 'power',
    reverse: false
};
```
This will sort ascendening by the property power. Now you just have to decide if you gonna provide it as
an observable or if you will provide it via the `setSort` function.

### Automated sorting using your observables
You can also provide the collection with observables then it will automatically filter and sort based on 
your observables.
```js
let options = {
    filter: Observable<any>,
    filterTypes: Observable<any>
    sort: Observable<any>
};
let collection = db.collection('customer', options);
```
### Manual sorting using setFilter
```js
let sortDefinition = {
    field: 'power',
    reverse: false
};
let collection = db.collection('pokemon', options);
collection.setSort(sortDefinition);
```

## Observables
!> the observer are only emitting when you enable the [change listener](/5-changes).

### changes$
Emits all changes within the collection.

```js
collection.changes$.subscribe(changes => {
    console.log('new changes', changes);
});
```

### allDocs$
Emits all current docs within the collection.

```js
collection.allDocs$.subscribe(allDocs => {
   console.log('allDocs', allDocs);
});
```

### docs$
Emits all current docs which passes the filter, within the collection.

```js
collection.docs$.subscribe(docs => {
    console.log('docs which are passing the filter', docs);
});
```

### insert$;
Emits all inserts within the collection.

```js
collection.insert$.subscribe(doc => {
    console.log('a doc was inserted', doc);
});
```

### update$
Emits all updates within the collection.

```js
collection.update$.subscribe(doc => {
    console.log('a doc was updated', doc);
});
```

### remove$
Emits all removes within the collection.

```js
collection.remove$.subscribe(doc => {
    console.log('a doc was deleted', doc);
});
```