# bequest
Makes a request to a remote server

## Installation

```sh
npm install --save bequest
```

## Usage

```js
import Ajax from 'bequest';

Ajax.request('https://example.com/api/test', 'PUT', { somedata: 'something' }, (err, resp) => {
  console.log(resp.statusCode);
  console.log(resp.data);
});

// Defaults to GET
Ajax.request('https://example.com/api/test', (err, resp) => {
  console.log(resp.statusCode);
  console.log(resp.data);
});

// Data is optional as well
Ajax.request('https://example.com/api/test', 'HEAD', (err, resp) => {
  console.log(resp.statusCode);
  console.log(resp.data);
});

// Custom events
const request = Ajax.request('https://example.com/api/test', (err, resp) => {
  console.log(resp.statusCode);
  console.log(resp.data);
});

request.onreadystatechange = () => {
  // do something
}
```
