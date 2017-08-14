import Ajax from '../index';
import test from 'tape-rollup';

let xhr = null;

// Mock up
class XHR {
  constructor(method, url) {
    this.headers = {};
    this.responseheader = '';

    xhr = this;
  }

  open(method, url) {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(header, value) {
    this.headers[header] = value;
  }

  getResponseHeader() {
    return this.responseheader;
  }

  teardown() {
    this.method = null;
    this.url = null;
    this.headers = {};
    xhr = null;
  }

  send(data) {
    this.data = data;
  }
}

window.XMLHttpRequest = XHR;

test('API is correct', assert => {
  assert.equal(typeof Ajax.serialize, 'function', 'serialize exists');
  assert.equal(typeof Ajax.get, 'function', 'get exists');
  assert.equal(typeof Ajax.post, 'function', 'post exists');
  assert.equal(typeof Ajax.put, 'function', 'put exists');
  assert.equal(typeof Ajax.head, 'function', 'head exists');
  assert.equal(typeof Ajax.del, 'function', 'del exists');
  assert.equal(typeof Ajax.options, 'function', 'options exists');
  assert.equal(typeof Ajax.request, 'function', 'request exists');
  assert.end();
});

test('Is possible to serialize data to be passed on the URL', assert => {
  assert.equal(Ajax.serialize({ a: 'b', foo: 3, bar: false }), 'a=b&foo=3&bar=false');
  assert.end();
});

// Shortcuts
test('Generic', assert => {
  const methods = ['get', 'post', 'put', 'head', 'del', 'options'];
  let response = null;
  const callback = (e, a) => { response = a; };

  methods.forEach(method => {
    const req = Ajax[method]('/dummy', { a: 'b' }, callback);
    const verb = (method !== 'del' ? method : 'delete').toUpperCase();

    assert.ok(req instanceof XHR, `${verb}: Creates a XMLHttpRequest`);
    assert.equal(typeof xhr.onreadystatechange, 'function', `${verb}: onreadystatechange should be listened to`);

    if (verb !== 'GET') {
      assert.equal(xhr.data, '{"a":"b"}', `${verb}: Data was given to the request`);
      assert.equal(xhr.headers['Content-Type'], 'application/json', `${verb}: Data header was given to the request`);
    }

    assert.equal(xhr.method, verb, `${verb}: Method should be correct`);

    xhr.readyState = 1;
    xhr.status = 0;
    xhr.onreadystatechange();

    assert.equal(response, null, `${verb}: Callback not called if states aren't correct`);

    xhr.readyState = 4;
    xhr.status = 200;
    xhr.onreadystatechange();

    assert.notEqual(response, null, `${verb}: Callback called if states are correct`);
    assert.equal(response.statusCode, 200, `${verb}: Contains correct status`);

    xhr.responseText = '{"a":"b"}';
    xhr.responseheader = 'json';
    xhr.onreadystatechange();

    assert.equal(response.data.a, 'b', `${verb}: JSON is parsed if response is adequate`);

    xhr.teardown();
    response = null;
  });

  assert.end();
});

test('GET', assert => {
  Ajax.get('/dummy', { a: 'b', foo: 3 });

  assert.equal(xhr.method, 'GET', 'Method should be correct');
  assert.equal(xhr.url, '/dummy?a=b&foo=3', 'URL should be correct');
  assert.equal(xhr.data, undefined, 'GET request should not send data');

  xhr.teardown();

  Ajax.get('/?token=123', { a: 'b', foo: 3 });
  assert.equal(xhr.url, '/?token=123&a=b&foo=3', 'Should respect existing parameters');

  assert.end();
});
