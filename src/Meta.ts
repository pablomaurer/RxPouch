export class Meta {

  // todo seq percantage to include updates
  // todo doc count to include amount of docs

  // first time from info
  public localSeq: number;
  public remoteSeq: number;

  // then from sync
  public localLastSeq: number;
  public remoteLastSeq: number;

  // info
  public localDocCount: number;
  public remoteDocCount: number;

  // from changes..
  public remotePending: number;

  // percentage from RemotePending
  // percentage from lastSeq
  // percentage from docs
  // mix all percentages to get the best possible result
  // or first, remotePending then diff from localSeq to remoteSeq
}

/*
let info1 = {
    doc_count: 0,
    update_seq: 0,
    backend_adapter: 'LevelDOWN',
    db_name: 'myDB',
    auto_compaction: false,
    adapter: 'leveldb'
};
let info2 = {
    doc_count: 0,
    update_seq: 0,
    websql_encoding: 'UTF-8',
    db_name: 'dbname',
    auto_compaction: false,
    adapter: 'http',
    instance_start_time: '1534931567063',
    host: 'http://localhost:5984/dbname/'
};

let change = {
    ok: true,
    start_time: '2018-09-14T06:52:15.383Z',
    docs_read: 4,
    docs_written: 4,
    doc_write_failures: 0,
    errors: [],
    last_seq: 4,
    docs: []
};

let ch = {
    direction: 'pull',
    change: {
        ok: true,
        start_time: '2018-09-14T20:35:26.414Z',
        docs_read: 4,
        docs_written: 4,
        doc_write_failures: 0,
        errors: [],
        last_seq: '4-g1AAAA-',
        docs: [[Object], [Object], [Object], [Object]],
        pending: 0
    }
};

 */