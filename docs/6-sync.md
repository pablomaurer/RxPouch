# Sync
```js
let sync = db.sync(remoteDB, [options]);
```
The sync object will also be cached on the `db object` as `db.sync`.

# Sync cancel
```js
sync.cancel();
```

# Replicate

```js
db.replicate.to(remoteDB, [options]);
db.replicate.from(remoteDB, [options]);
```

# observables

## change$

## docs$

## active$

## complete$

## error$

## localLastSeq$

## remoteLastSeq$

## remotePending$


## localPending$
Sadly this isn't available in PouchDB at the moment.

# FastSync
todo...

- replicate down
- replicate up
- then live sync
```
var url = 'http://localhost:5984/mydb';
var opts = { live: true, retry: true };

// do one way, one-off sync from the server until completion
db.replicate.from(url).on('complete', function(info) {
  // then two-way, continuous, retriable sync
  db.sync(url, opts)
    .on('change', onSyncChange)
    .on('paused', onSyncPaused)
    .on('error', onSyncError);
}).on('error', onSyncError);
```