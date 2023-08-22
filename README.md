# Vapor SDK Wrapper

Vapor SDK Wrapper is a flexible and robust library for interacting with APIs. It provides support for JWT authentication, dynamic routing, response transformation, enhanced logging, and more.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [Session Login](#session-login)
  - [Fetching Data](#fetching-data)
  - [Custom Routes](#custom-routes)
- [Examples](#examples)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install the package using NPM:

```bash
npm install vapor-sdk
```

## Features

- **JWT Authentication**: Secure your API requests with JSON Web Token (JWT) authentication.
- **Dynamic Routing**: Define endpoints dynamically based on your use cases.
- **Response Transformation**: Handle common data manipulation tasks with built-in transformation functions.
- **Enhanced Logging**: Get detailed insights into requests and responses, including headers, body, and timing information.
- **Session Login**: Authenticate and manage sessions with a dedicated login method.

## Usage

### Initialization

Create a new instance of VaporWrapper:

```typescript
import VaporWrapper from 'vapor-sdk';

const vapor = new VaporWrapper({
    baseURL: 'https://api.example.com',
    maxRetries: 5,
    logger: console,
    timeout: 1000,
});
```

### Session Login

Authenticate using the session login method:

```typescript
vapor.login('/login', 'username', 'password');
```

### Fetching Data

Fetch data with optional JWT authentication and response transformation:

```typescript
vapor.fetchData('/data', 'your-jwt-token', (data) => data.map(item => item.value));
```

### Custom Routes

Make custom API requests with optional JWT authentication:

```typescript
vapor.route({
    method: 'get',
    route: '/users',
    token: 'your-jwt-token',
});
```

## Examples

See the [examples](./examples) directory for more detailed examples and use cases.

## Changelog

See the [changelog](./CHANGELOG.md) for a detailed history of changes and updates.

## Contributing

We welcome contributions! See the [contributing guide](./CONTRIBUTING.md) for details on how to contribute.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
