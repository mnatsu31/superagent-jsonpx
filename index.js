/* superagent-jsonpx */

module.exports = function (options) {
  options = options || {};
  return function (request) {
    if(typeof window === 'undefined' || !request) return request;

    request.timeout = options.timeout || 1000;
    request.callbackKey = options.callbackKey || 'callback';
    request.callbackName = 'superagentCallback' + new Date().valueOf() + parseInt(Math.random() * 1000);
    request.mock = typeof options.mock !== 'undefined' ? options.mock : null;
    request.end = end;

    return request;
  };
};

// Noop.
function noop() {}

function end(callback) {
  callback = callback || noop;

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
  iframe.contentWindow.document.write(cbs.outerHTML + jsonp.outerHTML);
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

function clear(element) {
  try {
    element.parentNode.removeChild(iframe);
  } catch (e) {}
}
