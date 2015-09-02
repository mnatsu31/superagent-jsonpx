var assert = require('assert');
var request = require('superagent');
require('../')(request);

describe('superagent-jsonpx', function () {
  describe('jsonp', function () {
    it('should be received body', function (done) {
      request
        .get('(use mock)')
        .jsonp({ mock: '{ "test": "OK" }' })
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
        .jsonp()
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

  describe('xhr', function () {
    it('should be able to used xhr even if it wrapped by superagent-jsonpx', function () {
      request
        .get('http://echo.jsontest.com/key/value')
        .end(function (err, res) {
          if (!err) {
            // assert.ok(res.body);
            done();
          } else {
            assert.fail(err);
            done();
          }
        });
    });
  });
});