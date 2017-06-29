'use strict';

module.exports = function(Periodictable) {

  // External PeriodTable WebService operation exposed as REST APIs through LoopBack
  Periodictable.getAtomicnumber = function (elementName, cb) {
    Periodictable.GetAtomicNumber({ElementName: elementName || 'Copper'}, function (err, response) {
      var result = response;
      cb(err, result);
    });
  };

  // External PeriodTable WebService operation exposed as REST APIs through LoopBack
  Periodictable.getAtomicweight = function(elementName, callback) {
    Periodictable.GetAtomicWeight({ElementName: elementName || 'Copper'}, function (err, response) {
      var result = response;
      callback(err, result);
    });
  }

  // Map to REST/HTTP
  Periodictable.remoteMethod(
      'getAtomicnumber', {
        accepts: [
          {arg: 'elementName', type: 'string', required: true,
            http: {source: 'query'}}
        ],
        returns: {arg: 'result', type: 'object', root: true},
        http: {verb: 'get', path: '/GetAtomicNumber'}
      }
  );

  Periodictable.remoteMethod(
      'getAtomicweight', {
        accepts: [
          {arg: 'elementName', type: 'string', required: true,
            http: {source: 'query'}}
        ],
        returns: {arg: 'result', type: 'object', root: true},
        http: {verb: 'get', path: '/GetAtomicWeight'}
    }
  );

};
