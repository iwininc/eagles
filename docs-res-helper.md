# About Eagles
Eagles is a HTTP server API that aims to provide shortcuts in creating server responses.

# Installation

```
npm install eagles
```

# Getting Started
The backbone of Eagles is comprised of a HTTP server creator and a router. Here is the simplest way to implement Eagles:

```
const eagles = require('eagles');

var router = new eagles.Router();
eagles.createServer(router.route());
```

This segment of code sets up a HTTP server listening at port 3000, and a router for you to add routes to. For customization of the server and methods to add routes, refer to the sections below.

# API Reference
## HTTP Server
### Creating a Server
Eagles provides an easy way to create an up-and-running server:

```
eagles.createServer(requestListener[, port])
```

`.createServer()` returns a `http.Server` object. Like the Node.js HTTP interface, the method takes a `requestListener` function which takes the following form:

```
function (request, response) { }
```

The `requestListener` is automatically added to the HTTP `request` event. To dynamically generate the listener, we recommend using the Eagles' router function.

`.createServer()` also takes an optional parameter for the hosting `port` number. It is defaulted to 3000 if left unspecified.

## Router
### Initiate Router
Create an instance of Eagles' router by calling the constructor:

```
var router = new eagles.Router();
```

Saving the instance allows you to add routes and referencing it in your server's `requestListener`.

### Set Up Routes
Five different methods (`.get()`, `.post()`, `.put()`, `.patch()`, `.delete()`), corresponding to five different REST verbs, are available for each router instance. Each method takes a URL and a request listener function as its parameters. The request listener follows the same format as a HTTP server `requestListener`, with the same [list of methods](https://nodejs.org/api/http.html) available for the request and response objects.

Here is a simple example of routing a `GET` request to `/hello`:

```
var router = new eagles.Router();
router.get('/hello', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('world');
  res.end();
});
```

See below for Eagles' helper methods for writing server response.

#### Params & Query String

### Dynamic Routing
Any routes you have or will set up are available in your router instance. Calling `router.route()` will search for and run the function you've set up for that instance.


## Response Helper
Typing out `res.writeHead()` with status code and content type over and over again can be hideous.

Here is a list of response helper functions available with Eagles. By passing in the `res` object as reference and parameters for status code and content type, Eagles provides an easy way to do the same task. There are also helpers for writing body contents.


### Status Code: `.status()`
`.status()` sets the response status code:

```
eagles.status(res, code);
```

where `code` should be a 3-digit HTTP status code.


### Content Type: `.contentType()`
`.contentType()` sets the type of the response body:

```
eagles.contentType(res, type);
```
`type` should correspond to the MIME type of the content. Use full MIME type identifier (e.g. `text/html`) or Eagles' shortcut for common content types:

| Shortcut | MIME Type |
| -------- | --------- |
| `'plain'`| `'text/plain'` |
| `'html'` | `'text/html'` |
| `'xml'`  | `'text/xml'` |
| `'json'` | `'application/json'` |
| `'octet'`| `'application/octet-stream'` |
| `'form'` | `'multipart/form-data'` |
| `'jpg'`  | `'image/jpeg'` |
| `'png'`  | `'image/png'` |

**Use both `.status()` and `.contentType()` to write the header:**

```
router.get('/hello', function(req, res) {
  eagles.status(res, 200);
  eagles.contentType(res, 'plain');
  ...
});
```

Both methods are **chainable**, this code does the same things as above:

```
router.get('/hello', function(req, res) {
  eagles.status(res, 200).contentType(res, 'plain');
  ...
});
```


### Writing the Header in One Go: `.resHead()`
Combining `.status()` and `.contentType()`, `.resHead()` is an even faster way to write header and it takes the following format:

```
eagles.resHead(res, code, type);
```

where `type` takes the same shortcuts as described in the content type section above.


### Writing Response Body Data: `.resBody()`
Writing the response content is straightforward.
```
eagles.resBody(res, content);
```

**Here are `.resHead()` and `.resBody()` in action:**

```
router.get('/hello', function(req, res) {
  eagles.resHead(res, 200, 'plain');
  eagles.resBody(res, 'world');
  res.end();
});
```

Both methods are again **chainable**, so this snippet is equivalent to the one above:
```
router.get('/hello', function(req, res) {
  eagles.resHead(res, 200, 'plain').resBody(res, 'world');
  res.end();
});
```


### Sending File: `.sendFile()`
```
eagles.sendFile(res, filepath);
```

Nothing will get through as the response if `filepath` is invalid. Be sure to specify in the header a correctly content type before calling `.sendFile()`:

```
router.get('/helloFile', function(req, res) {
  eagles.resHead(res, 200, 'html');
  eagles.sendFile(res, 'path/to/file.html');
});
```
Note that `res.end()` is not needed when using `.sendFile()`, as the read stream will close after all the data has been piped through.


### Sending JSON: `.sendJSON()`
```
eagles.sendJSON(res, input);
```
`input` can be a **JavaScript object, array, or string**, and will be stringified as when it passes through to response. `input` can also be a **filepath**. If the path leads to a JSON file, the content of that file will be used to populate the response. If the path does not lead to a file or if the file does not have the JSON extension, the filepath will be used as the response.

Unlike other response helper methods, `.sendJSON()` defaults to send a 200 status code, set the content type to `application/json`, and automatically end the response once the data is through. So when using `.sendJSON`, this is all you need within the request listener:

```
router.get('/helloJSON', function(req, res) {
  eagles.sendJSON(res, {msg: 'hello world'});
});

router.get('/helloJSON2', function(req, res) {
  eagles.sendJSON(res, '/some/filepath.json');
});

```

Note that you can overwrite the status code with a header method (e.g. `.status()`).
