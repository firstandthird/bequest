/* eslint-env browser */
export default class Ajax {
  static serialize(data) {
    let queryString = '';

    const formatValue = (k, v) => `&${encodeURIComponent(k)}=${encodeURIComponent(v)}`;

    Object.keys(data).forEach(key => {
      const value = data[key];

      if (Array.isArray(value)) {
        value.forEach(k => {
          queryString += formatValue(key, k);
        });
      } else {
        queryString += formatValue(key, value);
      }
    });

    return queryString.substring(1);
  }

  static get(url, ...args) {
    const [data, headers, callback] = args;
    let serializedData = data;

    if (typeof data === 'object' && data !== null) {
      serializedData = Ajax.serialize(data);
    }

    Ajax.request(url, 'GET', serializedData, headers, callback);
  }

  static post(url, ...args) {
    Ajax.request(url, 'POST', ...args);
  }

  static put(url, ...args) {
    Ajax.request(url, 'PUT', ...args);
  }

  static head(url, ...args) {
    Ajax.request(url, 'HEAD', ...args);
  }

  static del(url, ...args) {
    Ajax.request(url, 'DELETE', ...args);
  }

  static options(url, ...args) {
    Ajax.request(url, 'OPTIONS', ...args);
  }

  /**
   * request - Makes a request to a remote server
   *
   * @param {String} url         Url for the request
   * @param {String} method      Request method: GET, POST, etc (default: GET)
   * @param {Object} data        Data payload. Set to null to not send
   *                             anything. Data is sent as raw json (default: null)
   * @param {Function} callback  Called con completion with an object containing
   *                             the status code and the data. If the response
   *                             has a content-type containing json data will
   *                             be parsed, otherwise it will be the raw data.
   * @return XMLHttpRequest      Original XMLHttpRequest object to allow further
   *                             event binding.
   */
  static request(url, ...args) {
    let [method, data, headers, callback] = args;

    if (typeof method === 'function') {
      method = 'GET';
      callback = method;
      data = null;
      headers = {};
    }

    if (typeof data === 'function') {
      callback = data;
      data = null;
      headers = {};
    }

    if (typeof headers === 'function') {
      callback = headers;
      headers = {};
    }

    if (headers === null) {
      headers = {};
    }

    const useMethod = method.toUpperCase();
    const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'DELETE', 'OPTIONS'];

    if (validMethods.indexOf(useMethod) === -1) {
      const err = new TypeError(`Method must be one of the following: ${validMethods.join(', ')}`);
      return callback(err);
    }

    const xhr = new XMLHttpRequest();

    xhr.open(useMethod, url);

    xhr.onreadystatechange = () => {
      if (xhr.readyState > 3 && xhr.status > 0) {
        const contentType = xhr.getResponseHeader('content-type');
        let parsedResponse = xhr.responseText;

        if (contentType && contentType.toLowerCase().indexOf('json') > -1) {
          parsedResponse = JSON.parse(parsedResponse);
        }

        return callback(null, {
          statusCode: xhr.status,
          data: parsedResponse
        });
      }
    };

    Object.keys(headers).forEach(header => {
      xhr.setRequestHeader(header, headers[header]);
    });

    if (data !== null) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }

    return xhr;
  }
}
