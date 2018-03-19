const flatten = require('flat');
const mapValues = require('lodash.mapvalues');
const isEmpty = require('lodash.isempty');

const flattenCleanEmptyObjs = (nestedObj => (
  mapValues(flatten(nestedObj), val => {
    if (isEmpty(val)) {
      return String();
    } else {
      return String(val).toLowerCase();
    }
  })
));

module.exports = flattenCleanEmptyObjs;
