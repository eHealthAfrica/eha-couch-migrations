'use strict'

var _ = require('lodash');

/* returns the object without the 'id' property*/
var omitId = _.partialRight(_.omit, 'id');
/* returns the object without the 'personId' property*/
var omitPersonId = _.partialRight(_.omit, 'personId');

/**
* @param {Array} of objects
* @property {string} a property
* @returns true iff there is a Falsy(lodash) value for the passed property
*/
function anyFalsy (collection, property) {
  return _.chain(_.clone(collection)).pluck(property).uniq().compact().size().value() !== _.size(collection);
}

function hasDuplicates(doc){
  return _.size(update(_.cloneDeep(doc)).contact.sourceCases) !== _.size(doc.contact.sourceCases);
}

function update(doc) {
  //merge evident duplicates
  var sc = _.clone(doc.contact.sourceCases),
      res = _.chain(sc)
            .uniq(JSON.stringify)
            .value();
  //merge evident duplicates btw objects both missing 'id' and 'personId'
  if (anyFalsy(res, 'id') && anyFalsy(res, 'personId')) {
    res = _.chain(res).sortBy('id').sortBy('personId').uniq(_.flow(omitPersonId, omitId, JSON.stringify)).value();
  }
  //merge evident duplicates btw object with 'id' and without.
  if (anyFalsy(res, 'id')) {
    res = _.chain(res).sortBy('id').uniq(_.flow(omitId, JSON.stringify)).value();
  }
  //merge evident duplicates btw object with 'personId' and without.
  if (anyFalsy(res, 'personId')) {
    res = _.chain(res).sortBy('personId').uniq(_.flow(omitPersonId, JSON.stringify)).value();
    }
  doc.contact.sourceCases = res;
  return doc;
}

function migration(doc) {
  var result = null;
  if (_.has(doc, 'contact') && _.has(doc.contact, 'sourceCases')) {
    if (hasDuplicates(doc)) {
      result = [update(doc)];
    } else {
      return false;
    }
  }
  return result;
}
module.exports = migration
