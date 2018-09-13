import Db from "../src/Db";
import {EHook} from "../src/Hooks";

let pouchLevelDB = require("pouchdb-adapter-leveldb");
Db.plugin(pouchLevelDB);

let db = new Db('testDB');

// ------------------
// methods proxy
// ------------------
test('get info of the db', async () => {
  const info = await db.info();
  expect(info.db_name).toBe('testDB');
});

// ------------------
// CRUD
// ------------------
// single docs
test('create, update, get and remove doc using hooks', async () => {
  // hooks
  db.addHook(EHook.PRE_CREATE, (doc) => {
    doc.pre_create = true;
    return doc;
  });
  db.addHook(EHook.PRE_SAVE, (doc) => {
    doc.pre_save = true;
    return doc;
  });
  db.addHook(EHook.POST_SAVE, (doc) => {
    doc.post_save = true;
    return doc;
  });

  // create
  let created = await db.save({_id: 'test-doc', field1: 'value1', field2: 'value2'});
  expect(created._id).toBe('test-doc');
  expect(created._rev.charAt(0)).toBe('1');
  expect(created.pre_create).toBe(true);
  expect(created.pre_save).toBe(true);
  expect(created.post_save).toBe(true);

  // get
  let fetched = await db.get('test-doc');
  expect(fetched._id).toBe('test-doc');
  expect(fetched._rev.charAt(0)).toBe('1');

  // update
  fetched.field1 = 'updated';
  let updated = await db.save(fetched);
  expect(updated.field1).toBe('updated');
  expect(updated._rev.charAt(0)).toBe('2');

  // remove
  let removed = await db.remove(updated);
  expect(removed.ok).toBe(true);
  expect(removed.rev.charAt(0)).toBe('3');
});

// muplitple docs
test('remove all', async () => {
  const info = await db.info();
  expect(info.db_name).toBe('testDB');
});

test('bulk get', async () => {
  let created1 = await db.save({_id: 'sample-1', field1: 'value1', field2: 'value2'});
  let created2 = await db.save({_id: 'sample-2', field1: 'value1', field2: 'value2'});
  const res = await db.bulkGet({docs: [{id: 'sample-1'}, {id: 'sample-2'}]});
  expect(res.results.length).toBe(2);
});

test('bulk docs', async () => {
  let result = await db.bulkDocs([
    {title : 'Lisa Says', _id: 'doc1'},
    {title : 'Space Oddity', _id: 'doc2'}
  ]);
  expect(result[0].ok).toBe(true);
  expect(result[1].ok).toBe(true);
});

test('all docs', async () => {
  let result = await db.allDocs({
    include_docs: true,
    startkey: 'sample',
    endkey: 'sample\ufff0'
  });
  // todo get rid of this rows.0.docs._id, just get a normal array containing the docs
  expect(result.rows[0].id).toBe('sample-1');
  expect(result.rows[1].id).toBe('sample-2');
});
