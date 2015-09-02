# eHealth Africa Couch Migrations

A collection of the code we use for data migrations on Couch databases. Hopefully we will extract some pattern out of this.

The rationale behind the creation of this repo, and links to other similar repos internal to eHealth are [on this private issue](https://github.com/eHealthAfrica/sense-dashboard/issues/64)


# migration mechanisms

We define a migration mechanism or `migrator` as a service that connects to a couchdb database
and performs a change in a document.

Current migrators are:

- pouchdb-migrate
- view-update (to be included)

Different migrators serve different situations. The following table sums up the space:


| migrator                                                                                             | migration speed  | data size     | conflicts possiblity |
| -------------                                                                                        | -------------    | ------------- | -------------------- |
| [pouchdb-migrate](https://github.com/eHealthAfrica/pouchdb-migrate)                                  | fast             | small         |  high                |
| view + update function                                                                               | slow             | big           |  low                 |
| nano script [example call center migrations](https://github.com/eHealthAfrica/call-center-migration) | fast             |    ?          |     ?                |


# migrations

Migrations are included their own folder with a descriptive name of what it does; it contains:
- a migration file named `migration.js`
- a `README.md` for documentation and references of the migration.


Installation
---

get the repo

```
git clone git@github.com:eHealthAfrica/eha-couch-migrations.git
cd eha-couch-migrations
```

and run ` npm install `


Usage
-----

in this example we'll run the `pouchdb-migrate` migrator against `db`, using the `deduplicate-source-cases` migration.

bin/main.js 'pouchdb-migrate' 'http://user:password@localhost:5984/test' deduplicate-source-cases

`db` is any db format accepted by `PouchDB`

Docker Usage
----

There is a docker image for the [call center migrations case](https://github.com/eHealthAfrica/call-center-migration), name `docker-registry.eocng.org/ehealthafrica/call_center_migrator`
with tag depending on the used branch.
The repo is [here](https://github.com/eHealthAfrica/ehealth-deployment/tree/docker/projects/call-center-migrations).


Development
-----------

Run the tests from project root with:

```sh
npm test
```

## License

Copyright 2015 [eHealth Africa](http://ehealthafrica.org)

Licensed under the Apache License, Version 2.0 (the "License"); you
may not use this file except in compliance with the License.  You may
obtain a copy of the License [here](/LICENSE).

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied.  See the License for the specific language governing
permissions and limitations under the License.
Apache License 2.0
