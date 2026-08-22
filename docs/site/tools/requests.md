---
title: Request Module
order: 2
---

# Request Module (apiTools)

This document describes the HTTP request module of antd-restful, built on [axios](https://axios-http.com/), providing a unified request instance, interceptor mechanism, error notifications, request cancellation, debouncing, and more.

**Import:**

```javascript
import antdRestful from 'antd-restful';

// request instance (axios) is available directly from the top level
const { request } = antdRestful;

// Other utility functions and Hooks are available via the apiTools namespace
const { apiTools: { useSafeRequest, makeSafeRequest, formatRequestError, getCookie } } = antdRestful;

// Interceptor IDs are also under apiTools
const { apiTools: { reqInterceptor, resInterceptor } } = antdRestful;
```

## useSafeRequest

React Hook that provides safe HTTP request functionality with request cancellation and debouncing support.

**Signature:**

```javascript
const [makeRequest] = useSafeRequest()
```

**Return Value:**

- `makeRequest` (function): Request factory function that accepts configuration options and returns an object with various HTTP methods

**Configuration Options:**

- `key` (string, optional): Request identifier. When omitted, each call automatically generates an incrementing numeric ID that is cleaned up after the request completes; when a fixed string is passed, requests with the same key automatically cancel the previous incomplete request, suitable for deduplication scenarios. **Note**: Numeric keys are not allowed; numbers are automatically prefixed with `key-` to avoid conflicts with internal auto-increment IDs
- `delay` (number): Debounce delay in milliseconds, default `0` (no debouncing). Must be used with `key` — debouncing relies on a fixed key to identify "the same type of request", thereby canceling the previous request and delaying the send. The first call sends immediately; subsequent calls within the delay window cancel the previous request and wait for delay before sending

**Supported HTTP Methods:**

- `get(url, config)`
- `head(url, config)`
- `options(url, config)`
- `post(url, data, config)`
- `put(url, data, config)`
- `patch(url, data, config)`
- `delete(url, data, config)`

**Usage Examples:**

Most common usage — omit `key`, each call gets an independent auto-assigned ID, all canceled on component unmount:

```javascript
import antdRestful from 'antd-restful';
const { apiTools: { useSafeRequest } } = antdRestful;

function MyComponent() {
  const [makeRequest] = useSafeRequest();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await makeRequest({ delay: 300, key: 'fetch-data' })
        .get('/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData) => {
    try {
      const response = await makeRequest().post('/api/items', itemData);
      console.log('Item created:', response.data);
    } catch (error) {
      console.error('Create failed:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

When debouncing or deduplication is needed, pass `delay` and `key`:

```javascript
import antdRestful from 'antd-restful';
const { apiTools: { useSafeRequest } } = antdRestful;

function SearchComponent() {
  const [makeRequest] = useSafeRequest();
  const [results, setResults] = useState([]);

  const onSearch = (keyword) => {
    makeRequest({ delay: 300, key: 'search' })
      .get('/api/search', { params: { q: keyword } })
      .then((resp) => setResults(resp.data));
  };

  return <Input.Search onChange={(e) => onSearch(e.target.value)} />;
}
```

### Debounce Behavior

When `delay > 0` is set, `makeRequest` has debouncing capability:

- The first call sends the request immediately
- Subsequent calls within the `delay` time window cancel the previous request and wait for delay before sending
- If no new request is initiated within `5 * delay`, the next call is treated as a "first call" and sends immediately

```javascript
const [makeRequest] = useSafeRequest();

// Search box debounce: send request 500ms after user stops typing
const onSearch = (keyword) => {
  makeRequest({ delay: 500, key: 'search' })
    .get('/api/search', { params: { q: keyword } })
    .then((resp) => setResults(resp.data));
};
```

### Request Deduplication

Use `key` to deduplicate requests of the same type — a new request with the same key automatically cancels the previous incomplete request:

```javascript
const [makeRequest] = useSafeRequest();

// When switching tabs, the previous tab's request is automatically canceled
const onTabChange = (tabKey) => {
  makeRequest({ key: 'tab-data' })
    .get(`/api/tab/${tabKey}`)
    .then((resp) => setTabData(resp.data));
};
```

## Axios Instance

The module exports a pre-configured axios instance by default, which can be used directly for all standard axios methods:

```javascript
import antdRestful from 'antd-restful';
const { request } = antdRestful;

const response = await request.get('/api/users');
```

**Default Configuration:**

- `timeout`: 10000ms
- `Content-Type`: `application/json`
- `paramsSerializer`: Uses `globalConfig.queryStringify` to serialize query parameters

### globalConfig

The request instance's `paramsSerializer` depends on global configuration `globalConfig`, defaulting to the [query-string](https://github.com/sindresorhus/query-string) library with `arrayFormat: "comma"` preset.

You can replace serialization and parsing logic via `setGlobalConfig`:

```javascript
import antdRestful from 'antd-restful';
const { setGlobalConfig } = antdRestful;

import Qs from 'qs';
setGlobalConfig({
  queryStringify: (params) => Qs.stringify(params, { arrayFormat: 'brackets' }),
  queryParse: (string) => Qs.parse(string, { arrayFormat: 'brackets' }),
});
```

Supported `globalConfig` fields:

| Field | Type | Default Behavior | Description |
|------|------|----------|------|
| `queryStringify` | `(params, options?) => string` | `query-string.stringify`, `arrayFormat: "comma"` | Serialize object to URL query string |
| `queryParse` | `(string, options?) => object` | `query-string.parse`, `arrayFormat: "comma"`, `parseNumbers: true`, `parseBooleans: true` | Parse URL query string to object, auto-converting numbers and booleans |

This configuration affects query parameter serialization for all requests sent via the axios instance, and is also used by components such as `RouteBaseTable` for URL parameter parsing and generation.

## Interceptors

### Built-in Request Interceptor

The module includes a built-in request interceptor that automatically attaches Django CSRF Token for write operations (POST / PUT / PATCH / DELETE):

```javascript
const { apiTools: { reqInterceptor } } = antdRestful;
```

Token retrieval order:

1. Find `<input name="csrfmiddlewaretoken">` element on the page
2. Fall back to `csrftoken` Cookie

### Built-in Response Interceptor

The module includes a built-in response interceptor that handles request errors uniformly:

```javascript
const { apiTools: { resInterceptor } } = antdRestful;
```

Default behavior:

- Non-`CanceledError` errors are displayed via `notification.error`
- 401 / 403 / 404 errors are deduplicated by `key` to avoid multiple popups
- Error notifications for individual requests can be disabled via `config.disableNotiError = true`

### Custom Interceptors

You can add custom interceptors on top of the built-in ones, or remove the built-in interceptors for full customization.

#### Adding Custom Interceptors

```javascript
import antdRestful from 'antd-restful';
const { request, apiTools: { reqInterceptor, resInterceptor } } = antdRestful;

// Add request interceptor: inject Authorization header
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor: handle 401 redirect to login
request.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      return new Promise(() => {}); // Prevent subsequent then/catch execution
    }
    return Promise.reject(error);
  }
);
```

#### Removing Built-in Interceptors

If the built-in interceptors don't meet your needs, you can remove and replace them with custom implementations:

```javascript
import antdRestful from 'antd-restful';
const { request, apiTools: { reqInterceptor, resInterceptor } } = antdRestful;

// Remove built-in interceptors
request.interceptors.request.eject(reqInterceptor);
request.interceptors.response.eject(resInterceptor);

// Register custom interceptors
request.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    switch (status) {
      case 401:
        window.location.href = '/login';
        return new Promise(() => {});
      case 403:
        window.location.href = '/403';
        return new Promise(() => {});
      default:
        return Promise.reject(error);
    }
  }
);
```

#### Disabling Error Notification for Individual Requests

```javascript
const { request } = antdRestful;

// disableNotiError prevents the built-in response interceptor from showing notifications
request.get('/api/silent', { disableNotiError: true });
```

## makeSafeRequest

Non-Hook version of the safe request factory, suitable for non-React component scenarios. Usage is the same as the `makeRequest` returned by `useSafeRequest`, but requires manually calling `unmount()` to release resources.

```javascript
import antdRestful from 'antd-restful';
const { apiTools: { makeSafeRequest } } = antdRestful;

const makeRequest = makeSafeRequest();

// Make a request
makeRequest({ key: 'my-request' }).get('/api/data');

// Manually release when no longer needed
makeRequest.unmount();
```

## Utility Functions

### formatRequestError

Formats axios error objects into notification-friendly format.

```javascript
const { apiTools: { formatRequestError } } = antdRestful;

const { message, description } = formatRequestError(error);
// message: "HttpError(404)" or "Unknown Error"
// description: Detailed information including request method, URL, and response content
```

### getCookie

Reads a Cookie value by name from `document.cookie`.

```javascript
const { apiTools: { getCookie } } = antdRestful;

const token = getCookie('csrftoken');
```

## Export Overview

| Access Path | Type | Description |
|------|------|------|
| `antdRestful.request` | axios instance | Pre-configured axios instance |
| `antdRestful.apiTools.reqInterceptor` | number | Built-in request interceptor ID, can be used with `eject` |
| `antdRestful.apiTools.resInterceptor` | number | Built-in response interceptor ID, can be used with `eject` |
| `antdRestful.apiTools.useSafeRequest` | Hook | React Hook for component-level safe requests |
| `antdRestful.apiTools.makeSafeRequest` | function | Non-Hook safe request factory |
| `antdRestful.apiTools.formatRequestError` | function | Error formatting utility |
| `antdRestful.apiTools.getCookie` | function | Cookie reading utility |
| `antdRestful.apiTools.AbortablePromise` | class | Abortable Promise implementation |

