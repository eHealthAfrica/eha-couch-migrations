#! /usr/bin/env node

var argv_count = process.argv.length < 5;
if (argv_count ) {
  console.error("commands needs 3 arguments, a db, a migrator and a migration you passed " + argv_count);
  process.exit(1);
}

var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-migrate'));
var migrator = process.argv[2];
var dbName = process.argv[3];
var migration_path = '../lib/migrations/' + process.argv[4] + '/migration.js';
if (migrator === 'pouchdb-migrate') {
  var migration = require(migration_path);
  var db = new PouchDB(dbName);
  // Migration script
  // // * Return :D:=:N:Pfalsy value to skip the doc
  // // * Make sure to prevent from loops
  //
  db.migrate(migration)
  .then(
    function(){console.log("Done");},
    function(error){
      console.log(error + " Not Done");},
    function(error){console.log(" progress");}
  ).catch(function(e) { console.error(e); process.exit(1); });
} else {
  console.error("no such a migrator available");
}
