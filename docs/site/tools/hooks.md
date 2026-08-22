---
title: Hooks
order: 3
---

# React Hooks Reference

This document describes all React Hooks provided by the antd-restful library.

## Storage Hooks

### useLocalStorage

Stores and reads data in localStorage with automatic serialization and deserialization.

**Signature:**
```javascript
const [value, setValue, removeValue] = useLocalStorage(key, initialValue)
```

**Parameters:**
- `key` (string): Storage key name
- `initialValue` (any): Initial value, defaults to `null`

**Return Value:**
- `value` (any): Currently stored value
- `setValue` (function): Function to set the value, supports functional updates
- `removeValue` (function): Function to remove the storage item

**Features:**
- Automatically handles JSON serialization and deserialization
- Supports functional updates (similar to useState)
- Synchronizes localStorage state changes within the current component
- Error handling: returns initial value on parse failure

**Usage Examples:**
```javascript
import antdRestful from 'antd-restful';
const { hooks: { useLocalStorage } } = antdRestful;

function MyComponent() {
  const [user, setUser, removeUser] = useLocalStorage('user', { name: 'John' });

  const updateUser = () => {
    setUser(prev => ({ ...prev, age: 30 }));
  };

  const clearUser = () => {
    removeUser();
  };

  return (
    <div>
      <p>User: {user?.name}</p>
      <button onClick={updateUser}>Update User</button>
      <button onClick={clearUser}>Clear User</button>
    </div>
  );
}
```

### useSessionStorage

Stores and reads data in sessionStorage with the same functionality as useLocalStorage, but data is cleared when the session ends.

**Signature:**
```javascript
const [value, setValue, removeValue] = useSessionStorage(key, initialValue)
```

**Usage Examples:**
```javascript
import antdRestful from 'antd-restful';
const { hooks: { useSessionStorage } } = antdRestful;

function MyComponent() {
  const [theme, setTheme] = useSessionStorage('theme', 'light');

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>Switch to Dark</button>
      <button onClick={() => setTheme('light')}>Switch to Light</button>
    </div>
  );
}
```

## Timer Hooks

### useInterval

Provides controllable timer functionality with manual start, stop, and reset support.

**Signature:**
```javascript
const [runInterval, setEnable] = useInterval(callback, delay, immediate)
```

**Parameters:**
- `callback` (function): Function to execute
- `delay` (number | null): Interval time in milliseconds, `null` means paused
- `immediate` (boolean): Whether to enable the timer immediately, defaults to `false`

**Return Value:**
- `runInterval` (function): Function to start the timer, accepts optional parameter `enableInterval` (default true) to control whether to keep running; executes the callback immediately when called
- `setEnable` (function): Function to set the timer enabled state

**Features:**
- Supports manual start and stop control
- Calling `runInterval()` executes the callback immediately once
- Supports dynamically modifying the delay parameter
- Automatically cleans up the timer on component unmount

**Usage Examples:**
```javascript
import antdRestful from 'antd-restful';
const { hooks: { useInterval } } = antdRestful;

function MyComponent() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const [runInterval, setEnable] = useInterval(() => {
    setCount(c => c + 1);
  }, isRunning ? 1000 : null);

  const startTimer = () => {
    setIsRunning(true);
    runInterval(); // Execute immediately once
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
}
```

## Protective Hooks

### useProtect

Protects callback functions from executing after component unmount, primarily used for async operations.

**Signature:**
```javascript
const [protect] = useProtect()
```

**Return Value:**
- `protect` (function): Protection function that accepts a callback and returns a protected callback

**Features:**
- Prevents memory leaks after component unmount
- Automatically cleans up registered callback functions
- Supports callbacks with arbitrary parameters

**Usage Examples:**
```javascript
import antdRestful from 'antd-restful';
const { hooks: { useProtect } } = antdRestful;

function MyComponent() {
  const [protect] = useProtect();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const protectedSetData = protect(setData);

    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      protectedSetData(result); // If component is unmounted, this call will be ignored
    } catch (error) {
      console.error('Fetch failed:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### useDeepCompareMemoize

Deep compares objects to avoid unnecessary re-renders.

**Signature:**
```javascript
const memoizedValue = useDeepCompareMemoize(value)
```

**Parameters:**
- `value` (any): Value to memoize

**Return Value:**
- `memoizedValue` (any): Memoized value, returns the same reference if deeply equal

**Features:**
- Uses deep comparison instead of reference comparison
- Supports nested objects and arrays
- Deep comparison implemented based on the `dequal` library

**Usage Examples:**
```javascript
import antdRestful from 'antd-restful';
const { hooks: { useDeepCompareMemoize } } = antdRestful;

function MyComponent({ config }) {
  const memoizedConfig = useDeepCompareMemoize(config);

  useEffect(() => {
    // Only executes when config actually changes
    console.log('Config changed:', memoizedConfig);
  }, [memoizedConfig]);

  return <div>Config: {JSON.stringify(memoizedConfig)}</div>;
}
```

### useDictState

Centralized state management for multiple state values.

**Signature:**
```javascript
const [state, setState] = useDictState(initialData)
```

**Parameters:**
- `initialData` (object): Initial state object

**Return Value:**
- `state` (object): Current state
- `setState` (function): Function to update state, supports partial updates

**Features:**
- Supports partial state updates
- Automatically merges new state with existing state
- Implemented based on useReducer
- Built-in deep equality check: if merged state is deeply equal to current state, no re-render is triggered

**Usage Examples:**
```javascript
import antdRestful from 'antd-restful';
const { hooks: { useDictState } } = antdRestful;

function MyComponent() {
  const [user, setUser] = useDictState({
    name: 'John',
    age: 30,
    email: 'john@example.com'
  });

  const updateName = () => {
    setUser({ name: 'Jane' }); // Only update name, other fields remain unchanged
  };

  const updateAge = () => {
    setUser({ age: 31 }); // Only update age
  };

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
      <p>Email: {user.email}</p>
      <button onClick={updateName}>Update Name</button>
      <button onClick={updateAge}>Update Age</button>
    </div>
  );
}
```

## Settings Management Hooks

### useSettingsStorage

Manages table column visibility configuration, persisting user column display preferences to localStorage. Automatically handles configuration compatibility when column definitions change.

**Signature:**
```javascript
const { allKeys, keys, setKeys } = useSettingsStorage(key, columns)
```

**Parameters:**
- `key` (string): localStorage storage key name
- `columns` (Array): Column configuration array, each item contains:
  - `key` (string, required): Column identifier
  - `label` (string, optional): Column display name
  - `hidden` (boolean, optional): Whether hidden by default

**Return Value:**
- `allKeys` (Array): List of all column keys
- `keys` (Array): List of currently visible column keys
- `setKeys` (function): Function to update visible columns

**Features:**
- Persists user column display preferences to localStorage
- Automatically compatible when column definitions change (only keeps configurations for columns that still exist)
- Uses default visible columns when no configuration is set (columns where `hidden` is not true)
- Avoids unnecessary re-renders based on deep comparison

**Usage Examples:**
```javascript
import antdRestful from 'antd-restful';
const { hooks: { useSettingsStorage } } = antdRestful;

function TableSettings() {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'createdAt', label: 'Created At', hidden: true },
  ];

  const { allKeys, keys, setKeys } = useSettingsStorage('user-table-columns', columns);

  return (
    <Checkbox.Group
      options={allKeys.map(k => ({ label: columns.find(c => c.key === k)?.label, value: k }))}
      value={keys}
      onChange={setKeys}
    />
  );
}
```

## Non-Hook Storage Utilities

### myLocalStorage / mySessionStorage

Non-Hook version of storage managers, suitable for non-React component scenarios (such as utility functions and initialization logic).

**Signature:**
```javascript
const { value, getValue, setValue, removeValue } = myLocalStorage(key, defaultValue)
const { value, getValue, setValue, removeValue } = mySessionStorage(key, defaultValue)
```

**Parameters:**
- `key` (string): Storage key name
- `defaultValue` (any): Default value, defaults to `null`

**Return Value:**
- `value` (any): Current value at call time (snapshot, not reactively updated)
- `getValue` (function): Function to get the latest value
- `setValue` (function): Function to set the value
- `removeValue` (function): Function to remove the storage item

**Usage Examples:**
```javascript
import antdRestful from 'antd-restful';
const { hooks: { myLocalStorage } } = antdRestful;

const tokenStorage = myLocalStorage('access_token', null);

// Get current value
const token = tokenStorage.getValue();

// Set value
tokenStorage.setValue('new-token-value');

// Remove value
tokenStorage.removeValue();
```

## Request Hooks

### useSafeRequest

> Moved to [Request Module documentation](./requests.md#usesaferequest), including complete API description, debounce behavior, request deduplication, and interceptor usage.

## Best Practices

### 1. Storage Hooks Recommendations
- Use `useLocalStorage` for persistent data such as user preference settings
- Use `useSessionStorage` for temporary session data
- Be aware of serialization limitations for stored data; avoid storing non-serializable values such as functions

### 2. Timer Hooks Recommendations
- Use `useInterval` instead of native `setInterval` to ensure proper cleanup on component unmount
- Set delay parameters reasonably to avoid overly frequent execution
- Use the `runInterval` function to manually control when the timer starts

### 3. Protective Hooks Recommendations
- Use `useProtect` in async operations to prevent memory leaks
- Use `useDeepCompareMemoize` to optimize useEffect dependencies on complex objects
- Use `useDictState` to manage multiple related state values

### 4. Request Hooks Recommendations
- See [Request Module documentation](./requests.md) for details

## Notes

1. **Storage limits**: localStorage and sessionStorage have storage size limits (typically 5-10MB)
2. **Serialization**: Storage Hooks automatically perform JSON serialization; special types such as functions are not supported
3. **Performance**: Deep comparison in `useDeepCompareMemoize` may affect performance; avoid using in frequently updated scenarios
4. **Request cancellation**: See [Request Module documentation](./requests.md) for details
5. **Timer cleanup**: Although Hooks automatically clean up timers, manual control of timer lifecycle is recommended in complex scenarios
