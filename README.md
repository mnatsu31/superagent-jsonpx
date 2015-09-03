# superagent-jsonpx

[![npm version](https://badge.fury.io/js/superagent-jsonpx.svg)](http://badge.fury.io/js/superagent-jsonpx) 
[![Coverage Status](https://coveralls.io/repos/mnatsu31/superagent-jsonpx/badge.svg?branch=master&service=github)](https://coveralls.io/github/mnatsu31/superagent-jsonpx?branch=master)

## Installation

Install for node.js or browserify using npm:

```
$ npm install --save-dev superagent-jsonpx
```

## Example

```javascript
var request = require('superagent');
var jsonp = require('superagent-jsonpx');

var options = { timeout: 3000, callbackKey: 'cb' };

request.get(uri)
  .use(jsonp(options))
  .end(function (err, res) {
    if (!err && res.body) {
      // request success
      console.log(res.body);
    } else {
      // request timeout (or error)
    }
  });
```

## Options

**timeout**

If there is no response after a timeout, it will determine that an error has occurred.

* default: 1000ms

**callbackKey**

This will change the default query string callback parameter.

* default: callback

