# RxPouch

## Import
```js
const RxPouch = require("rx-pouch");

```

## Replicate
See docs of [pouchdb](https://pouchdb.com/api.html#replication)

```js
RxPouch.replicate(source, target, [options]);
```

## Sync
See docs of [pouchdb](https://pouchdb.com/api.html#sync)

```js
let sync = RxPouch.sync(src, target, [options]);
```

## Plugin
See docs of [pouchdb](https://pouchdb.com/api.html#plugins)

```js
RxPouch.plugin(require('pouchdb-adapter-http'));
```

## Debug
See docs of [pouchdb](https://pouchdb.com/api.html#debug_mode)

```js
RxPouch.debugEnable('*');
RxPouch.debugDisable();
```

## Defaults
See docs of [pouchdb](https://pouchdb.com/api.html#defaults)

```js
RxPouch.defaults({
  option1: 'foo',
  option2: 'value'
});
```

## Events
See docs of [pouchdb](https://pouchdb.com/api.html#events)
todo
