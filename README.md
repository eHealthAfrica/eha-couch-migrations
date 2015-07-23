# eHealth Africa Couch Migrations

A collection of the code we use for data migrations on Couch databases. Hopefully we will extract some pattern out of this.

The rationale behind the creation of this repo, and links to other similar repos internal to eHealth are [on this private issue](https://github.com/eHealthAfrica/sense-dashboard/issues/64)


# migration mechanisms

We define a migration mechanism or `migrator` as a service that connects to a couchdb database
and performs a change in a document.

Current migrators are:



Different migrators serve different situations. The following table sums up the space:


| migrator                                                             | migration speed  | data size     | conflicts possiblity |
| -------------                                                        | -------------    | ------------- | -------------------- |
| [pouchdb-migrate](https://github.com/eHealthAfrica/pouchdb-migrate)  | fast             | small         |  high                |
| view + update function                                               | slow             | big           |  low                 |


# migrations

Migrations are included their own folder with a descriptive name of what it does; it contains:
- a migration file named `migration.js`
- a `README.md` for documentation and references of the migration.

