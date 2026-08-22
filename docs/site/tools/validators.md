---
title: Validators
order: 5
---

# Validators

`validators` provides a series of custom validation functions for form validation and data processing. These validators are particularly suitable for ExpansionView components and remote validation scenarios.

## Table of Contents

- [expansionValidator](#expansionvalidator) - Expansion Validator
- [remoteValidator](#remotevalidator) - Remote Validator
- [Use Cases](#use-cases)
- [Best Practices](#best-practices)
- [Notes](#notes)

---

## expansionValidator

Expansion validator for the ExpansionView component, supporting length limits and error checking.

### Function Signature

```javascript
expansionValidator(value, rule) => Promise
```

### Parameters

- `value` - Value to validate, typically containing `output` and `error` properties
- `rule` - Validation rule configuration object
  - `rule.expansionValidator` - Expansion validation config, can be a boolean or object
  - `rule.expansionValidator.required` - `value.output` cannot be empty (optional)
  - `rule.expansionValidator.min` - Minimum length limit (optional)
  - `rule.expansionValidator.max` - Maximum length limit (optional)
  - `rule.message` - Error message when validation fails (optional)

### Return Value

- `Promise` - Validation result
  - **Success**: Returns resolved promise (no return value)
  - **Failure**: Returns rejected promise with error message string
  - **Error message priority**: `value.error` > `rule.message` > default error message

### Configuration Options

- `expansionValidator` - Validation config, can be a boolean or object
  - `required` - `value.output` cannot be empty (optional)
  - `min` - Minimum length limit (optional)
  - `max` - Maximum length limit (optional)
- `message` - Custom error message (optional)

### Usage Examples

#### Basic Usage

```javascript
const rule = {
  required: true,
  expansionValidator: true,
  message: "Please enter data as required"
};
```

#### With Length Limits

```javascript
const rule = {
  expansionValidator: {
    required: true,
    min: 1,
    max: 10
  },
  message: "Please enter data as required"
};
```

#### Full Configuration Example

```javascript
// Basic configuration
{
  required: true,  // Can be used with this rule for required fields
  expansionValidator: true,
  message: "Please enter data as required",
}

// Configuration with length limits
{
  expansionValidator: {
    min: 1,
    max: 10,
  },
  message: "Please enter data as required",
}
```

### Validation Logic

1. **Empty value check**: If config is empty or value is empty, validation passes directly
2. **Error check**: If value contains an `error` property, return that error message
3. **Length validation**: If `min`/`max` is configured, check length limits of `value.output` (`output` can be an array or string)
4. **Error return**: Return corresponding error message when length exceeds limits
5. **Success return**: Return resolved promise when validation passes
6. **Failure return**: Return rejected promise with error message when validation fails

### Complete Example

```javascript
import antdRestful from 'antd-restful';
const { validators: { expansionValidator } } = antdRestful;

// Use in form rules
const formRules = {
  description: [
    { required: true, message: 'Please enter a description' },
    {
      expansionValidator: {
        min: 10,
        max: 500
      },
      message: 'Description length should be between 10-500 characters'
    }
  ]
};
```

---

## remoteValidator

Remote validator that performs server-side validation via API requests.

### Function Signature

```javascript
remoteValidator(value, rule, ctx) => Promise
```

### Parameters

- `value` - Value to validate
- `rule` - Validation rule configuration object
  - `rule.remoteValidator` - Remote validation config object
  - `rule.remoteValidator.withForm` - Whether to include all form data, defaults to false (optional)
  - `rule.remoteValidator.extraParams` - Additional request parameters (optional)
  - `rule.remoteValidator.restful` - API endpoint for remote validation (required)
  - `rule.remoteValidator.reqConfig` - Request configuration, merged into request options (optional)
  - `rule.remoteValidator.makeRequestOptions` - makeRequest configuration options (optional)
    - `rule.remoteValidator.makeRequestOptions.delay` - Debounce delay time, default 200ms (optional)
    - `rule.remoteValidator.makeRequestOptions.key` - Debounce identifier key, must be globally unique, otherwise validators will cancel each other's requests (optional, defaults to `${fieldName}-${restful}`)
  - `rule.message` - Error message when validation fails (optional)
- `ctx` - Context object containing current field and form information
  - `ctx.fieldName` - Current validation field name (string)
  - `ctx.formValues` - All form field values (object, sent to server when withForm=true)

### Return Value

- `Promise` - Validation result
  - **Success**: Returns resolved promise (no return value)
  - **Failure**: Returns rejected promise with error message string
- **Error message priority**: Server returned `message` > `rule.message` > default message

### Configuration Options

- `restful` - Validation API endpoint (required)
- `withForm` - Whether to include all form data, defaults to false (optional)
- `extraParams` - Additional request parameters (optional)
- `reqConfig` - Request configuration, merged into request options (optional)
- `makeRequestOptions` - makeRequest configuration options (optional)
  - `makeRequestOptions.delay` - Debounce delay time, default 200ms (optional)
  - `makeRequestOptions.key` - Debounce identifier key, must be globally unique, otherwise validators will cancel each other's requests (optional, defaults to `${fieldName}-${restful}`)

### Usage Examples

#### Basic Remote Validation

```javascript
const rule = {
  remoteValidator: {
    restful: "api/validate/remote/",
  },
  message: "Validation failed"
};
```

#### Remote Validation with Form Data

```javascript
const rule = {
  remoteValidator: {
    withForm: true,
    extraParams: { type: "user" },
    restful: "api/validate/remote/",
    reqConfig: { timeout: 5000 }
  },
  message: "Validation failed"
};

// ctx parameter format
const ctx = {
  fieldName: "username",       // Current validation field name
  formValues: { username: "test", email: "test@example.com" }  // All form values (used when withForm=true)
};
```

#### Remote Validation with Debounce Configuration

```javascript
const rule = {
  remoteValidator: {
    withForm: true,
    extraParams: { type: "user" },
    restful: "api/validate/remote/",
    reqConfig: { timeout: 5000 },
    makeRequestOptions: {
      delay: 300,
      key: "remote-validator"
    }
  }
};
```

#### Full Configuration Example

```javascript
{
  remoteValidator: {
    withForm: true,  // Whether to include all form data
    extraParams: {},  // Request parameters
    restful: "api/validate/remote/",
    reqConfig: {},  // Request configuration
    makeRequestOptions: { delay: 200, key: "remote-validator" },  // Debounce configuration
  }
}
```

### Validation Logic

1. **Empty value check**: If value is empty or config is incomplete, validation passes directly
2. **Data construction**: Construct request data including field value, field name, and extra parameters
3. **Form data**: If `withForm` is true, also include the entire form data
4. **Request sending**: Send POST request to the specified validation endpoint
5. **Result judgment**: Determine validation result based on returned `validated` field
6. **Error handling**: Return server message or custom message on validation failure
7. **Network errors**: Handle network request errors, return formatted error message
8. **Success return**: Return resolved promise when validation passes
9. **Failure return**: Return rejected promise with error message when validation fails

### Complete Example

```javascript
import antdRestful from 'antd-restful';
const { validators: { remoteValidator } } = antdRestful;

// Username uniqueness validation
const usernameRules = [
  { required: true, message: 'Please enter a username' },
  {
    remoteValidator: {
      restful: '/api/validate/username/',
      withForm: false,
      extraParams: { excludeId: currentUserId }
    },
    message: 'Username already exists'
  }
];

// Email format and uniqueness validation
const emailRules = [
  { required: true, message: 'Please enter an email' },
  { type: 'email', message: 'Please enter a valid email address' },
  {
    remoteValidator: {
      restful: '/api/validate/email/',
      withForm: true,
      extraParams: { type: 'registration' }
    },
    message: 'Email is already registered'
  }
];
```

---

## Use Cases

### ExpansionView Component Validation

```javascript
import antdRestful from 'antd-restful';
const { validators: { expansionValidator } } = antdRestful;

// Use in form rules
const formRules = {
  description: [
    { required: true, message: 'Please enter a description' },
    {
      expansionValidator: {
        min: 10,
        max: 500
      },
      message: 'Description length should be between 10-500 characters'
    }
  ]
};
```

### Remote Validation

```javascript
import antdRestful from 'antd-restful';
const { validators: { remoteValidator } } = antdRestful;

// Username uniqueness validation
const usernameRules = [
  { required: true, message: 'Please enter a username' },
  {
    remoteValidator: {
      restful: '/api/validate/username/',
      withForm: false,
      extraParams: { excludeId: currentUserId }
    },
    message: 'Username already exists'
  }
];

// Email format and uniqueness validation
const emailRules = [
  { required: true, message: 'Please enter an email' },
  { type: 'email', message: 'Please enter a valid email address' },
  {
    remoteValidator: {
      restful: '/api/validate/email/',
      withForm: true,
      extraParams: { type: 'registration' }
    },
    message: 'Email is already registered'
  }
];
```

### Complex Validation Scenarios

```javascript
// Product code validation
const productCodeRules = [
  { required: true, message: 'Please enter a product code' },
  { pattern: /^[A-Z]{2}\d{6}$/, message: 'Code format is 2 letters + 6 digits' },
  {
    remoteValidator: {
      restful: '/api/validate/product-code/',
      withForm: true,
      extraParams: {
        category: formValues.category,
        brand: formValues.brand
      },
      reqConfig: {
        timeout: 10000,
        headers: { 'X-Validation-Source': 'form' }
      }
    },
    message: 'Product code already exists or does not meet specifications'
  }
];

// Dynamic validation rules
const getDynamicRules = (formValues) => [
  { required: true, message: 'Please enter content' },
  {
    expansionValidator: {
      min: formValues.minLength || 1,
      max: formValues.maxLength || 100
    },
    message: `Content length should be between ${formValues.minLength || 1}-${formValues.maxLength || 100} characters`
  },
  {
    remoteValidator: {
      restful: '/api/validate/content/',
      withForm: true,
      extraParams: {
        contentType: formValues.type,
        sensitivity: formValues.sensitivity
      }
    },
    message: 'Content does not meet requirements'
  }
];
```

---

## Integration with Ant Design Form

```javascript
import { Form } from 'antd';
import antdRestful from 'antd-restful';
const { validators: { expansionValidator, remoteValidator } } = antdRestful;

const CustomForm = () => {
  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <Form.Item
        name="content"
        label="Content"
        rules={[
          { required: true, message: 'Please enter content' },
          {
            validator: (_, value) => expansionValidator(value, {
              expansionValidator: { min: 10, max: 1000 },
              message: 'Content length should be between 10-1000 characters'
            }),
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="username"
        label="Username"
        rules={[
          { required: true, message: 'Please enter a username' },
          {
            validator: (_, value) => remoteValidator(value, {
              remoteValidator: {
                restful: '/api/validate/username/',
                withForm: true
              },
              message: 'Username already exists'
            }, {
              fieldName: 'username',
              formValues: form.getFieldsValue()
            }),
          },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};
```

---

## Integration with Formily

```javascript
import { registerValidateRules } from "@formily/core";
import antdRestful from 'antd-restful';
const { validators: { expansionValidator, remoteValidator } } = antdRestful;

registerValidateRules({
  expansionValidator,
  remoteValidator,
});
```

---

## Best Practices

### 1. Error Message Handling

```javascript
// Provide clear error messages
const rule = {
  expansionValidator: { min: 5, max: 100 },
  message: 'Content length should be between 5-100 characters; current length does not meet requirements'
};
```

### 2. Error Handling

```javascript
// Handle network errors
const rule = {
  remoteValidator: {
    restful: '/api/validate/',
    reqConfig: {
      timeout: 10000
    }
  },
  message: 'Validation service is temporarily unavailable, please try again later'
};
```

---

## Notes

1. **expansionValidator** is primarily used for the ExpansionView component to validate its output
2. **remoteValidator** requires server-side cooperation; response format should be `{ validated: boolean, message?: string }`
3. Remote validation sends POST requests; ensure the endpoint supports this request method
4. Validators return Promises; async validation results must be handled correctly
5. It is recommended to set reasonable timeout values for remote validation to avoid long user waits
6. In production, consider caching or debouncing remote validation
7. On validation failure, prefer server-returned error messages, then custom messages
8. When `withForm` is true, the entire form data is sent; be mindful of data security and privacy

## Server Response Format

### Success Response

```javascript
{
  "validated": true,
  "message": "Validation passed"  // optional
}
```

### Failure Response

```javascript
{
  "validated": false,
  "message": "Specific reason for validation failure"  // optional, returned as error message
}
```

### Network Error Handling

When network requests fail, formatted error messages are returned:

```javascript
// Error message format
"Network Error: Failed to connect"
"Request Timeout: 5000ms"
"Server Error: 500 Internal Server Error"
```
