# RxPouch
This is my implementation of RxJs powered PouchDB.

# Why?
 - With RxJs it's super easy to reflect database changes to the UI.

# Why not RxDB
There is already [RxDB](https://github.com/pubkey/rxdb) with a lot of more features, but they make for every 
collection a new database. This is mostly no problem, since databases in couchdb/pouchdb are cheap.

But for me I needed a solution with just one Database.
 
## Installation
```
npm install rx-pouch --save

# peerDependencies
npm install rxjs babel-polyfill --save
```