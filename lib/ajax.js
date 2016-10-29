export default class Ajax {

  /**
   * request - Makes a request to a remote server
   *
   * @param  String url         Url for the request
   * @param  String method      Request method: GET, POST, etc (default: GET)
   * @param  Object data        Data payload. Set to null to not send
   *                            anything. Data is sent as raw json (default: null)
   * @param  Function callback  Called con completion with an object containing
   *                            the status code and the data. If the response
   *                            has a content-type containing json data will
   *                            be parsed, otherwise it will be the raw data.
   * @returns XMLHttpRequest    Original XMLHttpRequest object to allow further
   *                            event binding.
   */
  static request(url, ...args) {
    let [method, data, callback] = args;

    if (typeof method === 'function') {
      method = 'GET';
      callback = method;
    }

    if (typeof data === 'function') {
      data = null;
      callback = data;
    }

    const useMethod = method.toUpperCase();
    const validMethods = ['GET', 'POST', 'PUT', 'HEAD', 'DELETE', 'OPTIONS'];

    if (validMethods.indexOf(useMethod) === -1) {
      const err = new TypeError(`Method must be one of the following: ${validMethods.join(', ')}`);
      return callback(err);
    }

    const xhr = new XMLHttpRequest();

    xhr.open(useMethod, url);

    xhr.onreadystatechange = () => {
      if (xhr.readyState > 3 && xhr.status > 0) {
        const contentType = xhr.getResponseHeader('content-type').toLowerCase();
        let parsedResponse = xhr.responseText;

        if (contentType.indexOf('json')) {
          parsedResponse = JSON.parse(parsedResponse);
        }

        return callback(null, {
          statusCode: xhr.status,
          data: parsedResponse
        });
      }
    };

    if (data !== null) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }

    return xhr;
  }
}
