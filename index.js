/* superagent-jsonpx */

module.exports = function (superagent) {
  if(typeof window === 'undefined' || !superagent.Request) return superagent;

  if (__xhrEnd === noop) {
    var Request = superagent.Request;
    __xhrEnd = Request.prototype.end;
    __jsonpEnd = jsonpEnd;

    Request.prototype.jsonp = jsonp;
    Request.prototype.end = end;
  }

  return superagent;
};

// Noop.
function noop() {}

var __xhrEnd = noop;
var __jsonpEnd = noop;

function clear(element) {
  try {
    element.parentNode.removeChild(iframe);
  } catch (e) {};
}

function jsonp(options) {
  options = options || {};

  this.isJSONP = true;
  this.timeout = options.timeout || 1000;
  this.callbackKey = options.callbackKey || 'callback'
  this.callbackName = 'superagentCallback' + new Date().valueOf() + parseInt(Math.random() * 1000);
  this.mock = typeof options.mock !== 'undefined' ? options.mock : null;

  return this;
}

function end(callback) {
  callback = callback || noop;
  if (this.isJSONP) {
    __jsonpEnd.call(this, callback);
  } else {
    __xhrEnd.call(this, callback);
  }
}

function jsonpEnd(callback) {
  this._query.push(this.callbackKey + '=' + this.callbackName);
  var queryString = this._query.join('&');
  var separator = (this.url.indexOf('?') > -1) ? '&': '?';
  var url = this.url + separator + queryString;

  // create iframe for error handling
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // create script
  var cbs = document.createElement('script');
  if (this.mock !== null) {
    cbs.innerHTML = 'window.response = ' + this.mock + ';';
  } else {
    cbs.innerHTML = 'function ' + this.callbackName + ' (data) { window.response = data; }';
  }
  var jsonp = document.createElement('script');
  jsonp.src = url;

  // jsonp request
  iframe.contentWindow.document.write('<body>' + cbs.outerHTML + jsonp.outerHTML + '</body>');
  iframe.contentWindow.close();

  // onload is manually called,
  // Because there is the browser that "iframe.onload" is not called.
  setTimeout(onloadWrapper(this, callback).bind(iframe), 100);
}

function onloadWrapper(superagentJSONP, callback) {
  var RETRY_INTERVAL = 100;
  return function onload() {
    this.timeout = this.timeout || 0;
    if (typeof this.contentWindow.response !== 'undefined') {
      // request success
      var res = {
        body: this.contentWindow.response
      };
      callback.call(superagentJSONP, null, res);
      clear(this);
    } else if ((this.timeout += RETRY_INTERVAL) <= superagentJSONP.timeout) {
      setTimeout(onload.bind(this), RETRY_INTERVAL);
    } else {
      // request failed
      var err = new Error('request timeout');
      callback.call(superagentJSONP, err, null);
      clear(this);
    }
  };
}