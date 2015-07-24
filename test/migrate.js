'use strict'
var test = require('redtape')(),
    _ = require('lodash');

var migrate = require('../lib/migrate')
var fill = function(key, value, times) {
     return _.times(times || Math.ceil(Math.random() * 10), function() {
      var res = _.clone({}, true);
      res[key]=value();
      return res;
    });
  };
var same = function(key, times, value){ return fill(key, value || _.curry(_.constant(1)), times); };
var other = function(key, times){ return fill(key, Math.random, times); };

var duplicated = function(number) {
  var number = number || 4;
  return _.merge(
      same('lastContactDate', number),
      same('exposures', number),
      same('relationToCase', number)
    );
}

test('keep contacts different personId with and repeated lastContactDate', function (t) {
  var personIds = other('personId', 5);
  var sourceCases = _.merge(personIds, duplicated());
  var doc = { contact: { sourceCases: sourceCases}};
  t.notOk(migrate(doc), "nothing migrated");
  t.end();
})

test('keep contacts different personId with and repeated other elements', function (t) {
  var personIds = other('personId', 5);
  var sourceCases = _.merge(personIds, duplicated());
  var doc = { contact: { sourceCases: sourceCases}};
  t.notOk(migrate(doc), "nothing migrated");
  t.end();
})


test('merge contacts some personId missing, with and repeated other elements', function (t) {
  var personIds = _.union(same('personId', 3), [{}]);
  var lastContactDates = same('lastContactDate', 4);
  var exposures = same('exposures', 4);
  var relationsToCase = same('relationToCase', 4);
  var sourceCases = _.merge(lastContactDates, personIds, exposures, relationsToCase);
  var doc = { contact: { sourceCases: sourceCases}};
  var result = migrate(_.clone(doc, true));
  doc.contact.sourceCases = [ doc.contact.sourceCases[0] ];
  t.deepEqual(result, [doc]);
  t.end();
})

test('merge contacts some personId missing, with and repeated other elements, case personId missing is first', function (t) {
  var personIds = _.union([{}], same('personId', 3));
  var ids = same('id', 4);
  var sourceCases = _.merge(personIds, ids, duplicated());
  var doc = { contact: { sourceCases: sourceCases}};
  var result = migrate(_.clone(doc, true));
  var expected = [ { contact: { sourceCases: [ { exposures: 1, lastContactDate: 1, personId: 1, id: 1, relationToCase: 1 } ] } } ];
  t.deepEqual(result, expected);
  t.end();
})

test('merge contacts some personId missing and some id missing with and repeated other elements, missing cases are first', function (t) {
  var personIds = _.union([{}], same('personId', 3));
  var ids = _.union([{}], same('id', 3));
  var sourceCases = _.merge(personIds, ids, duplicated());
  var doc = { contact: { sourceCases: sourceCases}};
  var result = migrate(_.clone(doc, true));
  var expected = [ { contact: { sourceCases: [ { exposures: 1, lastContactDate: 1, personId: 1, id: 1, relationToCase: 1 } ] } } ];
  t.deepEqual(result, expected);
  t.end();
})

test('remove contacts same personId with and repeated lastContactDate and ', function (t) {
  var lastContactDates = same('lastContactDate', 5);
  var personIds = same('personId', 5);
  var sourceCases = _.merge(lastContactDates, personIds);
  var doc = { contact: { sourceCases: sourceCases}};
  var result = migrate(_.clone(doc, true));
  doc.contact.sourceCases = [ doc.contact.sourceCases[0] ];
  t.deepEqual(result, [doc]);
  t.end();
})

test('keep contacts same personId with different lastContactDate', function (t) {
  var personIds = same('personId', 5);
  var lastContactDates = other('lastContactDate', 5);
  var sourceCases = _.merge(lastContactDates, personIds);
  var doc = { contact: { sourceCases: sourceCases}};
  t.notOk(migrate(doc), "nothing migrated");
  t.end();
})


test('keeps contacts with different personId, case more than one element', function (t) {
  var sourceCases = other('personId', 5);
  var doc = { contact: { sourceCases: sourceCases }};
  t.notOk(migrate(doc), "nothing migrated");
  t.end();
})

test('merge  contacts with duplicated personId', function (t) {
  var sourceCases = same('personId', 15);
  var doc = { contact: { sourceCases: sourceCases }};
  var result = migrate(_.clone(doc, true));
  doc.contact.sourceCases = [ doc.contact.sourceCases[0] ];
  t.deepEqual(result, [doc]);
  t.end();
})
