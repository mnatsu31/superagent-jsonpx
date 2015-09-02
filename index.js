/* superagent-jsonpx */

module.exports = request;

function request(superagent) {
  if(typeof window === 'undefined' || !superagent.Request) return superagent;

  var Request = superagent.Request;
  Request.prototype.xhrEnd = Request.prototype.end;
  Request.prototype.jsonpEnd = jsonpEnd;

  Request.prototype.jsonp = jsonp;
  Request.prototype.end = end;

  return superagent;
}

function noop() {}

function addEvent(element, type, callback) {
  if (window.addEventListener) {
    element.addEventListener(type, callback, false);
  } else if (window.attachEvent) {
    element.attachEvent(type, callback);
  } else {
    throw new Exception('unsupported browser');
  }
}

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

  return this;
}

function end(callback) {
  callback = callback || noop;
  if (this.isJSONP) {
    this.jsonpEnd(callback);
  } else {
    this.xhrEnd(callback);
  }
}

function jsonpEnd(callback) {
  var self = this, retryInterval = 100;

  this._query.push(this.callbackKey + '=' + this.callbackName);
  var queryString = this._query.join('&');
  var separator = (this.url.indexOf('?') > -1) ? '&': '?';
  var url = this.url + separator + queryString;

  // create iframe for error handling
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';

  addEvent(iframe, 'load', function onload() {
    this.timeout = this.timeout || 0;
    if (iframe.contentWindow.response) {
      // request success
      var res = {
        body: iframe.contentWindow.response
      };
      callback.call(self, null, res);
      clear(iframe);
    } else if ((this.timeout += retryInterval) <= self.timeout) {
      setTimeout(onload.bind(this), retryInterval);
    } else {
      // request failed
      var err = new Error('request timeout');
      callback.call(self, err, null);
      clear(iframe);
    }
  });

  // append iframe
  document.body.appendChild(iframe);

  // create script
  var cbs = document.createElement('script');
  cbs.innerHTML = 'function ' + this.callbackName + ' (data) { window.response = data; }';
  var jsonp = document.createElement('script');
  jsonp.src = url;

  // jsonp request
  iframe.contentWindow.document.write(cbs.outerHTML + jsonp.outerHTML);
  iframe.contentWindow.close();
}
