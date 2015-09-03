var assert = require('assert');
var request = require('superagent');
var jsonp = require('../');

describe('superagent-jsonpx', function () {
  describe('jsonp', function () {
    it('should be received body', function (done) {
      request
        .get('(use mock)')
        .use(jsonp({ mock: '{ "test": "OK" }' }))
        .end(function (err, res) {
          if (!err) {
            assert.equal(res.body.test, 'OK');
            done();
          } else {
            assert.fail(err, { test: 'OK' });
            done();
          }
        });
    });

    it('should be error', function (done) {
      request
        .get('(invalid url)')
        .use(jsonp())
        .end(function (err, res) {
          if (!err) {
            assert.fail(res.body, new Error('request timeout'));
            done();
          } else {
            assert.equal(err.message, 'request timeout');
            done();
          }
        });
    });
  });
});