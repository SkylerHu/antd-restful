---
title: Type Tools
order: 4
---

# TypeTools Utility Functions

`typeTools` provides a series of utility functions for type checking, helping developers perform more precise type validation.

## Function List

### isNull(value)
Returns `true` if the value is `null` or `undefined`, otherwise returns `false`

```javascript
isNull(null)        // true
isNull(undefined)   // true
isNull(0)          // false
isNull("")         // false
```

### isBlank(value)
Returns `true` if the value is `null`, `undefined`, or an empty string, otherwise returns `false`

```javascript
isBlank(null)      // true
isBlank(undefined) // true
isBlank("")        // true
isBlank(" ")       // false
isBlank(0)         // false
```

### isEmpty(value)
Returns `true` if the value is empty (null/undefined/empty string/empty array/empty object), otherwise returns `false`

```javascript
isEmpty(null)      // true
isEmpty([])        // true
isEmpty({})        // true
isEmpty([1])       // false
isEmpty({a: 1})    // false
```

### isBooleanTrue(value)
Returns `true` if the value is truthy (true/"true"/"True"/"1"/1), otherwise returns `false`

```javascript
isBooleanTrue(true)   // true
isBooleanTrue("true") // true
isBooleanTrue("1")    // true
isBooleanTrue(1)      // true
isBooleanTrue(false)  // false
```

### isBooleanFalse(value)
Returns `true` if the value is falsy (false/"false"/"False"/"0"/0), otherwise returns `false`

```javascript
isBooleanFalse(false)  // true
isBooleanFalse("false") // true
isBooleanFalse("0")     // true
isBooleanFalse(0)       // true
isBooleanFalse(true)    // false
```

### isAbsBoolean(value)
Returns `true` if the value is a strict boolean type, otherwise returns `false`

```javascript
isAbsBoolean(true)   // true
isAbsBoolean(false)  // true
isAbsBoolean("true") // false
isAbsBoolean(1)      // false
```

### isBoolean(value)
Returns `true` if the value is a boolean type or boolean string, otherwise returns `false`

```javascript
isBoolean(true)      // true
isBoolean("true")    // true
isBoolean("0")       // true
isBoolean("string")  // false
```

### isString(value)
Returns `true` if the value is a string type, otherwise returns `false`

```javascript
isString("test")     // true
isString(123)        // false
isString(null)       // false
```

### isFunction(value)
Returns `true` if the value is a function type, otherwise returns `false`

```javascript
isFunction(() => {}) // true
isFunction("function") // false
```

### isAbsNumber(value)
Returns `true` if the value is a finite number type, otherwise returns `false`

```javascript
isAbsNumber(123)     // true
isAbsNumber(Infinity) // false
isAbsNumber("123")   // false
```

### isNumber(value)
Returns `true` if the value is a number type or a string that can be converted to a number, otherwise returns `false`

```javascript
isNumber(123)        // true
isNumber("123")      // true
isNumber("abc")      // false
```

### isArray(value)
Returns `true` if the value is an array type, otherwise returns `false`

```javascript
isArray([])          // true
isArray({})          // false
```

### isDict(value)
Returns `true` if the value is a plain object type, otherwise returns `false`

```javascript
isDict({})           // true
isDict(null)         // false
isDict([])           // false
```

### isBasicType(value)
Returns `true` if the value is a basic type (null/boolean/number/string), otherwise returns `false`

```javascript
isBasicType(null)    // true
isBasicType(true)    // true
isBasicType(123)     // true
isBasicType("test")  // true
isBasicType([])      // false
isBasicType({})      // false
```

## Usage Examples

```javascript
import { isNull, isArray, isNumber } from 'src/common/typeTools';

// Type checking
if (isNull(value)) {
  console.log('Value is empty');
}

if (isArray(data)) {
  data.forEach(item => {
    // Process array elements
  });
}

if (isNumber(input)) {
  const result = input * 2;
}
```

## Notes

1. `isNull` checks both `null` and `undefined`
2. `isBlank` adds empty string checking on top of `isNull`
3. `isEmpty` is the most comprehensive empty value check, including empty arrays and empty objects
4. `isAbsNumber` only checks strict number types, excluding string numbers
5. `isNumber` includes string numbers but excludes `NaN`
6. `isDict` uses `Object.prototype.toString.call()` to accurately identify plain objects, avoiding confusion with `null` and arrays
