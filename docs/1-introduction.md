# Introduction

RxPouch is [RxJs](https://github.com/ReactiveX/rxjs) powered [PouchDB](https://github.com/pouchdb/pouchdb), 
with some additional features, but still tried to stick provide all the same base functionallities. So you
can almost everywhere consult the [PouchDB Docs](https://pouchdb.com/api.html) for further information.

## Installation
```
npm install rx-pouch --save

# peerDependencies
npm install rxjs babel-polyfill --save
```

## Difference to RxDB

Well a lot of credits goes to [RxDB](https://github.com/pubkey/rxdb), since we borrowed a lot from them.
In RxDB every collection creates a new database, which is in `most` use-cases is perfectly fine.
`For my use-case it wasn't.`

- RxDB uses multiply databases, RxPouch uses document keys with the prefix `<collection>-` and adds to each 
 document a property `type: '<collection>'`
- RxDB has thei own API
- RxPouch tried to follow the official PouchDB API as close as possible, but also added some sugar.
- RxPouch got less features (Leader Election, Schema, Population etc..)
- RxPouch has a different filter / sorting system

## Example usage
```js
import {RxPouch} from "RxPouch";

let localDb = new RxPouch('myDb', )
let remoteDb = new RxPouch('myDb', )
```