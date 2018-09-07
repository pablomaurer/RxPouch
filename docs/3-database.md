# Database

## Create
See docs of [pouchdb](https://pouchdb.com/api.html#create_database)

```js
const db = new RxPouch([name], [options]);
```

## Destroy
See docs of [pouchdb](https://pouchdb.com/api.html#delete_database)
cleans up all listeners and frees up memory (data will not be deleted)
```js
db.destroy();
```

## Remove All
deletes all docs from this database.
```js
db.removeAll();
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

## Changes
See docs of [pouchdb](https://pouchdb.com/api.html#changes)
```js
db.changes(options);
```

## Info
See docs of [pouchdb](https://pouchdb.com/api.html#database_information)
```js
let info = await db.info();
```

## Compaction
See docs of [pouchdb](https://pouchdb.com/api.html#compaction)
```js
let res = db.compact(obj);
```


## Revision diff
See docs of [pouchdb](https://pouchdb.com/api.html#revisions_diff)
```js
var result = await db.revsDiff(diff);
```

## Not implemented
Stuff for now not implemented, feel free to create a PR.
- **indexes**
- **ViewCleanup**
- *** close ***