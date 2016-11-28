# bequest
Makes a request to a remote server

Usage:

```js
import Ajax from 'bequest';

Ajax.request('https://example.com/api/test', 'PUT', { somedata: 'something' }, resp => {
  console.log(resp.statusCode);
  console.log(resp.data);
});

// Defaults to GET
Ajax.request('https://example.com/api/test', resp => {
  console.log(resp.statusCode);
  console.log(resp.data);
});

// Data is optional as well
Ajax.request('https://example.com/api/test', 'HEAD', resp => {
  console.log(resp.statusCode);
  console.log(resp.data);
});

// Custom events
const request = Ajax.request('https://example.com/api/test', resp => {
  console.log(resp.statusCode);
  console.log(resp.data);
});

request.onreadystatechange = () => {
  // do something
}
```
