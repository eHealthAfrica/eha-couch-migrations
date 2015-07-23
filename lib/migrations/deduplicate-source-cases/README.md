deduplicate-source-cases
=====================

date: Thu Jul 23 18:51:25 CEST 2015
project(s): sl-sense-dashboard

Finds and remove duplicated [source cases](https://github.com/eHealthAfrica/data-models/blob/master/schemas/Person.json#L143)

Use case
--------

We have cases with no id or no personId. In this case we merge if the other properties match.
The case in wich we have different ids or personId and the other properties are exactly the same
is previously filtered out

finding duplicates follows this heuristics:
- merged iff
    - all properties match other object
    - no 'id' and 'personId' fields and rest of properties match other object
    - no 'id' field and rest of properties match other object
    - no 'personId' field and rest of properties match other object
