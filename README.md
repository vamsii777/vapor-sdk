# Vapor SDK Wrapper

This SDK provides a simplified, high-level interface to the Vapor 4 API. It abstracts away the details of the HTTP protocol and provides a JavaScript interface that's easy to use.

## Why use this SDK?

While you could use an HTTP client library like Axios directly, there are several advantages to using this SDK:

- **Simplicity**: You don't need to know about HTTP methods or status codes. Just call a method on the SDK and get the data you need.

- **Consistency**: The SDK ensures that every request to the API is made in a consistent way, with the same headers, error handling, etc. This makes your code more reliable and easier to debug.

- **Centralized configuration**: Configure the base URL, authentication, and retry logic in one place, rather than for each request.

- **Abstraction**: The SDK abstracts away the details of the API. If the API changes, you can update the SDK without changing the code that uses it.

- **Custom logic**: The SDK can include custom logic specific to your application, like methods that combine multiple API requests or transform the data returned by the API.

## Installation

```bash
npm install vapor-sdk
```

## Instantiating VaporWrapper
You can instantiate the `VaporWrapper` with a base URL, max retries, a logger and a token like so:

```typescript
// Create a new instance of the VaporWrapper class with the required options
const vapor = new VaporWrapper({
    baseURL: 'https://api.vapor.com',
    maxRetries: 5,
    logger: console,
    token: 'my-auth-token',
});
```

If you don't want to use any logger or don't have a token, you can pass null for the logger and omit the token:

```typescript
const vapor = new VaporWrapper({
    baseURL: 'https://api.example.com',
    maxRetries: 5,
    logger: null
});

```

## Using VaporWrapper.route

Once you have an instance of `VaporWrapper`, you can use the `.route()` method to send requests. The `.route()` method takes three arguments:

1. The HTTP method as a string (`'get'`, `'post'`, `'put'`, or `'delete'`).
2. The route to which to send the request.
3. The data to send with the request (only necessary for `'post'` and `'put'` requests).

For example, to send a `GET` request to the '/users' endpoint:
const users = await vapor.route('get', '/users');

```typescript
vapor.route('get', '/users')
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
```

To send a `POST` request to the '/users' endpoint:

```typescript 
const data = {
    name: 'John Doe',
    email: 'john.doe@example.com'
};

vapor.route('post', '/users', data)
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error(error);
    });
```