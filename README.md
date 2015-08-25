## Installation

Install for node.js or browserify using npm:

```
$ npm install --save-dev superagent-jsonpx
```

## Options

```javascript
request.get(uri)
  .jsonp({ timeout: 1000, callbackKey: 'cb' })
  .end(function (err, res) {
    // response handling
  });
```

**timeout**

If there is no response after a timeout, it will determine that an error has occurred.

* default: 3000ms

**callbackKey**

This will change the default query string callback parameter 

* default: callback

## Example

```javascript
var request = require('superagent');
require('superagent-jsonpx')(request);

// jsonp request
request.get(uri)
  .jsonp()
  .end((err, res) => {
    if (!err && res.body) {
      // request success
      console.log(res.body);
    } else {
      // request timeout (or error)
    }
  }

// xhr request
request.get(uri)
  .end((err, res) => {
    // do something
  }
```
