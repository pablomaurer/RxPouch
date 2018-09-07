# Collection
Collections are a concept to handle documents of the same type. Documents in a collection will have 
an `id` which will be prefixed with the collection type (`id: 'collectionType-...'`). Also they will have
a `type` property wich contains the collectionType (`type: 'collectoinType'`).

## Create
```js
let collection = db.collection('customer');
```

All created collections, will be cached on the `db object`, so you can also access them via `db.collectionName`.
A collection of a specified type, can only be created once.

## Destroy
Destroys the collection, and cleans up all bindings.

```js
collection.destroy();
```

## Remove All
Deletes all documents within a collection.

```js
collection.removeAll();
```

## CRUD
You can also create and edit documents without creating a collection. Using the PouchDb functions:

- [create, update](https://pouchdb.com/api.html#create_document)
- [get](https://pouchdb.com/api.html#fetch_document)
- [delete](https://pouchdb.com/api.html#delete_document)
- [batch create](https://pouchdb.com/api.html#batch_create)
- [batch fetch](https://pouchdb.com/api.html#batch_fetch)
- [batch get](https://pouchdb.com/api.html#bulk_get)
- [save attachment](https://pouchdb.com/api.html#save_attachment)
- [get attachment](https://pouchdb.com/api.html#get_attachment)
- [delete attachment](https://pouchdb.com/api.html#delete_attachment)

## Observables
!> the observer are only emitting when you enable the [change listener](/5-changes).

### changes$
Emits all changes within the collection.

```js
collection.changes$.asObservable();
```

### allDocs$
Emits all current docs within the collection.

```js
collection.allDocs$.asObservable();
```

### docs$
Emits all current docs which passes the filter, within the collection.

```js
collection.docs$.asObservable();
```

### insert$;
Emits all inserts within the collection.

```js
collection.insert$.asObservable();
```

### update$
Emits all updates within the collection.

```js
collection.update$.asObservable();
```

### remove$
Emits all removes within the collection.

```js
collection.remove$.asObservable();
```