# 0.6.6
- fix: set types for collection.setSort explicit, to avoid strange import in type definitions
- refactor: use user observable in a more rxjs-y way

# 0.6.5
- fix: don't set filter and store to null, only set the data in them to null, so you can proxy to them

# 0.6.4
- fix: proxied functions to filter, store can only be created docs are enabled
- fix: fix changes to work with rxjs5 and rxjs6, since in rxjs6 their is some strange behaviour
- fix: revert back to custom-builds for pouchdb

# 0.6.3
- fixed wrongly generated types for observables

# 0.6.2
- chore: downgrade to rxjs 5, so I an use it in ionic 3 - needs maybe two branches with both versions
- fix: checked all destroy functions and implemented missing cleanups

# 0.6.1
- chore: rollup config, exclude tests and temp dir
- fix: uptade build

# 0.6.0
- fix: removed pouchdb types, because first need to figure out how to ship them
- fix: sort used parameters to sort
- fix: moved write permission to db-level instead collection-level
- fix: reload collection data if provided user-observable emits new data
- fix: function extendComparator to be a var so you it can be proxied from db-level to collection-level
- feat: $docs observable must now be manually enabled and disabled for perfomance reasons
 - else it would add 3 by default activated subscriptions per collection (cpu)
 - else it would store all docs as an array and a filtered array per collection (memory)
- chore: updated packages

# 0.5.1
- fix: bad require, because of switch to full pouchdb bundle

# 0.5.0
- feat: added all function to collection and db
- feat: added removeAll function to collection an db
- fix: ship with full pouchdb bundle, until I figure out a solution for 
[PouchDB issue #7263](https://github.com/pouchdb/pouchdb/issues/7263) #7299

# 0.4.0
- feat: added browser example, needs improvment
- feat: new example about how to use synchronisation
- feat: sync class has new observers: localLastSeq$, remoteLastSeq$, remotePending$

# 0.3.1
- fixed: tests are working and ready to write
- fixed: hooks are wokring now
- fixed: proxying of some function where wrong
- fixed: added repository and keywords to package.json

# 0.3.0
- fixed: filtering bug
- feat: added nodejs filtering example

# 0.2.0
- fixed: default export instead export
- fixed: bug with async hooks
- feat: added nodejs example
- feat: added docs
- feat: ship with pouchdb-core instead pouchdb
- feat: added changelog

# 0.1.0
initial commit