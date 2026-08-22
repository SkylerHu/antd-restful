---
title: GridForm
order: 4
---

## GridForm
A grid layout form component based on Ant Design, supporting multiple field types and responsive layout.

**Features:**
- Supports 12 form field types (input, select, date picker, etc.)
- Built on Ant Design Form and List components, inheriting all their features
- Built-in responsive grid layout that adapts to different screen sizes
- Supports form validation and custom validation rules
- Built-in submit and reset buttons with customizable button labels
- Supports custom render functions for flexible extension
- Supports initial values and form value change listeners
- Automatically handles Enter key form submission
- Supports switching between single-field mode and advanced search mode
- Smart field activation strategy for better single-field mode UX
- Supports automatic placeholder fields to avoid toolbar overlap

### API

| <div style="width: 23ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | Pass-through Form `style` | - |
| className | Custom class name | `string` | - | Pass-through Form `className` | - |
| **Form Config** | | | | | |
| fields | Form field configuration array | `array` | - | - | - |
| advancedSearch | Whether to enable advanced search mode; single-field mode when `false` | `boolean` | `true` | - | - |
| initialValues | Form initial values | `object` | - | Pass-through Form `initialValues` | - |
| enablePlaceholder | Whether to enable placeholder fields; automatically adds a placeholder when field count + 1 is exactly a multiple of column, to prevent buttons from being blocked | `boolean` | `false` | - | - |
| **Callbacks** | | | | | |
| onSubmit | Form submit callback | `function(values)` | - | - | - |
| onReset | Form reset callback | `function(values)` | - | - | - |
| onValuesChange | Form value change callback | `function(changedValues, allValues)` | - | - | - |
| **Button Config** | | | | | |
| submitTitle | Submit button label | `node` | `textOptions.btnSubmitTitle` (default `'Search'`) | - | - |
| resetTitle | Reset button label (advanced search mode only) | `node` | `textOptions.btnResetTitle` (default `'Reset'`) | - | - |
| **Ant Design Native Config** | | | | | |
| antdFormProps | Ant Design [Form](https://ant.design/components/form-cn) props | `object` | - | Pass-through Form props; `form` / `initialValues` / `onFinish` managed internally | - |
| antdListProps | Ant Design [List](https://ant.design/components/list-cn) props for grid layout in advanced search mode | `object` | `{ grid: { gutter: 10, column: 3 } }` | Pass-through List props; `dataSource` / `renderItem` managed internally | - |

**fields options:**

| <div style="width: 23ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| key | Unique field identifier; also used as the form field name | `string` | - | Pass-through Form.Item `name` | - |
| label | Field label; uses key value when not set | `string` | `key` | Pass-through Form.Item `label` | - |
| type | Field type; see supported field types below | `string` | `'input'` | - | - |
| tip | Tooltip shown when configuring display columns | `string` | - | - | - |
| hidden | Set to `true` to hide field; set to `false` to make it non-hideable in settings | `bool` | undefined | - | - |
| antdFormItemProps | Ant Design Form.Item props, such as validation rules | `object` | - | Pass-through Form.Item props | - |
| antdFieldProps | Props for the corresponding field component | `object` | - | Pass-through corresponding field component props | - |
| antdSingleProps | Special field component props merged with antdFieldProps (higher priority; more common in single-field mode) | `object` | - | - | - |
| render | Custom render function returning a complete Form.Item | `function(item)` | - | - | - |

**Supported field types:**

| Type | Description | Component | Notes |
| - | - | - | - |
| `input` | Input | Ant Design Input | Default type; supports Enter key submit |
| `select` | Select | RestSelect | Supports remote data loading |
| `radio` | Radio | Ant Design Radio.Group | Configure options in antdFieldProps |
| `checkbox` | Checkbox | Ant Design Checkbox.Group | Configure options in antdFieldProps |
| `number` | Number input | Ant Design InputNumber | Supports number formatting |
| `date-picker` | Date picker | DateStrPicker | String-format date picker |
| `date-range-picker` | Date range picker | RangeStrPicker | String-format date range picker |
| `number-range` | Number range | NumberRange | Number range input component |
| `auto-complete` | Auto complete | RestAutoComplete | Supports remote search |
| `cascader` | Cascader | RestCascader | Cascader with remote data loading |
| `tree-select` | Tree select | RestTreeSelect | Tree select with remote data loading |
| `upload` | File upload | UploadView | File upload component |

**Ref methods:**

| Method | Description | Parameters | Return Value |
| - | - | - | - |
| getFormInstance | Get Ant Design form instance (extended with `setFieldsValueAndActiveKey` method) | - | `FormInstance` |

### Mode Details

**Advanced search mode (default):**
- Displays all configured fields
- Uses grid layout with responsive arrangement
- Suitable for complex forms with many fields

**Single-field mode:**
- Shows only one field and a dropdown selector at a time
- Users can switch fields via the dropdown
- Smart activation strategy: activates fields with values first, otherwise the first field
- Suitable for simple search or mobile scenarios
- Shows submit button in single-field mode (defaults to `textOptions.btnSubmitTitle`); reset button is not shown

### Examples

**Basic usage (advanced search mode):**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { GridForm, constants: { FieldType } } = antdRestful;

const BasicForm = () => {
  const fields = [
    {
      key: 'username',
      label: 'Username',
      type: FieldType.INPUT,
      antdFormItemProps: {
        rules: [{ required: true, message: 'Please enter username' }]
      },
      antdFieldProps: {
        placeholder: 'Please enter username'
      }
    },
    {
      key: 'password',
      label: 'Password',
      type: FieldType.INPUT,
      antdFormItemProps: {
        rules: [
          { required: true, message: 'Please enter password' },
          { min: 6, message: 'Password must be at least 6 characters' }
        ]
      },
      antdFieldProps: {
        type: 'password',
        placeholder: 'Please enter password'
      }
    },
    {
      key: 'gender',
      label: 'Gender',
      type: FieldType.RADIO,
      antdFormItemProps: {
        rules: [{ required: true, message: 'Please select gender' }]
      },
      antdFieldProps: {
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' }
        ]
      }
    }
  ];

  const handleSubmit = (values) => {
    console.log('Form submitted:', values);
    // Handle form submission
  };

  const handleReset = (values) => {
    console.log('Form reset:', values);
  };

  return (
    <GridForm
      fields={fields}
      onSubmit={handleSubmit}
      onReset={handleReset}
      initialValues={{
        gender: 'male'
      }}
    />
  );
};
export default BasicForm;
```

**Single-field mode:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { GridForm, constants: { FieldType } } = antdRestful;

const SingleModeForm = () => {
  const fields = [
    {
      key: 'keyword',
      label: 'Keyword',
      type: FieldType.INPUT,
      antdFieldProps: {
        placeholder: 'Please enter search keyword'
      }
    },
    {
      key: 'category',
      label: 'Category',
      type: FieldType.SELECT,
      antdFieldProps: {
        restful: 'https://dummyjson.com/users',
        parseRowsPath: 'users',
        fieldPageSize: 'limit',
        baseParams: { limit: 10 },
        fieldNames: { label: 'firstName', value: 'id' },
        placeholder: 'Please select category'
      }
    },
    {
      key: 'status',
      label: 'Status',
      type: FieldType.SELECT,
      antdFieldProps: {
        options: [
          { label: 'All', value: '' },
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' }
        ]
      }
    }
  ];

  return (
    <GridForm
      fields={fields}
      advancedSearch={false}  // Key config: enable single-field mode
      onSubmit={(values) => {
        console.log('Search conditions:', values);
        // Execute search logic
      }}
      initialValues={{
        status: ''
      }}
    />
  );
};
export default SingleModeForm;
```

**Advanced usage — remote data and custom layout:**

```jsx
import React, { useRef } from 'react';
import antdRestful from 'antd-restful';
const { GridForm, constants: { FieldType } } = antdRestful;
import { Button, message } from 'antd';

const AdvancedForm = () => {
  const formRef = useRef();

  const fields = [
    {
      key: 'category',
      label: 'Product Category',
      type: FieldType.SELECT,
      antdFormItemProps: {
        rules: [{ required: true, message: 'Please select product category' }]
      },
      antdFieldProps: {
        restful: 'https://dummyjson.com/users',
        parseRowsPath: 'users',
        fieldPageSize: 'limit',
        baseParams: { limit: 10 },
        fieldNames: { label: 'firstName', value: 'id' },
        placeholder: 'Please select category'
      }
    },
    {
      key: 'tags',
      label: 'Tags',
      type: FieldType.CHECKBOX,
      antdFieldProps: {
        options: [
          { label: 'Hot', value: 'hot' },
          { label: 'Recommended', value: 'recommend' },
          { label: 'New', value: 'new' }
        ]
      }
    },
    {
      key: 'price',
      label: 'Price',
      type: FieldType.NUMBER,
      antdFormItemProps: {
        rules: [{ required: true, message: 'Please enter price' }]
      },
      antdFieldProps: {
        min: 0,
        precision: 2,
        formatter: (value) => `¥ ${value}`,
        parser: (value) => value.replace(/¥\s?|(,*)/g, '')
      }
    },
    {
      key: 'dateRange',
      label: 'Sales Period',
      type: FieldType.DATE_RANGE_PICKER,
      antdFieldProps: {
        format: 'YYYY-MM-DD'
      }
    },
    {
      key: 'location',
      label: 'Sales Region',
      type: FieldType.CASCADER,
      antdFieldProps: {
        restful: 'https://dummyjson.com/users',
        parseRowsPath: 'users',
        fieldPageSize: 'limit',
        baseParams: { limit: 10 },
        fieldNames: {
          label: 'firstName',
          value: 'id',
          children: 'children'
        }
      }
    }
  ];

  const handleSubmit = async (values) => {
    try {
      // Simulate API call
      console.log('Submit data:', values);
      message.success('Saved successfully');
    } catch (error) {
      message.error('Save failed');
    }
  };

  const handleGetValues = () => {
    const form = formRef.current?.getFormInstance();
    const values = form?.getFieldsValue();
    console.log('Current form values:', values);
  };

  const handleValidate = async () => {
    const form = formRef.current?.getFormInstance();
    try {
      const values = await form?.validateFields();
      console.log('Validation passed:', values);
      message.success('Validation passed');
    } catch (error) {
      console.log('Validation failed:', error);
      message.error('Please check form input');
    }
  };

  return (
    <div>
      <GridForm
        ref={formRef}
        fields={fields}
        onSubmit={handleSubmit}
        onValuesChange={(changed, all) => {
          console.log('Form values changed:', { changed, all });
        }}
        antdListProps={{
          grid: { gutter: 16, xs: 1, sm: 1, md: 2, lg: 3 }
        }}
      />

      <div style={{ marginTop: 16 }}>
        <Button onClick={handleGetValues} style={{ marginRight: 8 }}>
          Get Form Values
        </Button>
        <Button onClick={handleValidate}>
          Validate Form
        </Button>
      </div>
    </div>
  );
};
export default AdvancedForm;
```

**Custom rendering:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { GridForm } = antdRestful;
import { Form, Input, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';

const CustomRenderForm = () => {
  const fields = [
    {
      key: 'email',
      label: 'Email Address',
      render: (item) => (
        <Form.Item
          {...item.antdFormItemProps}
          name={item.key}
          label={item.label}
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Please enter email address"
            size="large"
          />
        </Form.Item>
      )
    },
    {
      key: 'verification',
      label: 'Verification Code',
      render: (item) => (
        <Form.Item {...item.antdFormItemProps} name={item.key} label={item.label}>
          <Input.Group compact>
            <Input style={{ width: '70%' }} placeholder="Please enter verification code" />
            <Button style={{ width: '30%' }}>Send Code</Button>
          </Input.Group>
        </Form.Item>
      )
    }
  ];

  return (
    <GridForm
      fields={fields}
      onSubmit={(values) => console.log(values)}
    />
  );
};
export default CustomRenderForm;
```

**Form linkage:**

```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { GridForm, constants: { FieldType } } = antdRestful;

const LinkedForm = () => {
  const [formValues, setFormValues] = useState({});

  const fields = [
    {
      key: 'userType',
      label: 'User Type',
      type: FieldType.RADIO,
      antdFieldProps: {
        options: [
          { label: 'Individual', value: 'individual' },
          { label: 'Company', value: 'company' }
        ]
      }
    },
    // Show different fields based on user type
    ...(formValues.userType === 'company' ? [
      {
        key: 'companyName',
        label: 'Company Name',
        type: FieldType.INPUT,
        antdFormItemProps: {
          rules: [{ required: true, message: 'Please enter company name' }]
        }
      },
      {
        key: 'taxNumber',
        label: 'Tax ID',
        type: FieldType.INPUT,
        antdFormItemProps: {
          rules: [{ required: true, message: 'Please enter tax ID' }]
        }
      }
    ] : []),
    {
      key: 'contactPhone',
      label: 'Contact Phone',
      type: FieldType.INPUT,
      antdFormItemProps: {
        rules: [
          { required: true, message: 'Please enter contact phone' },
          { pattern: /^1[3-9]\d{9}$/, message: 'Please enter a valid mobile number' }
        ]
      }
    }
  ];

  return (
    <GridForm
      fields={fields}
      onSubmit={(values) => console.log('Submit:', values)}
      onValuesChange={(changed, all) => {
        setFormValues(all);
      }}
      initialValues={{
        userType: 'individual'
      }}
    />
  );
};
export default LinkedForm;
```

**Special configuration in single-field mode:**

```jsx
import React from 'react';
import antdRestful from 'antd-restful';
const { GridForm, constants: { FieldType } } = antdRestful;

const SingleModeAdvanced = () => {
  const fields = [
    {
      key: 'keyword',
      label: 'Keyword',
      type: FieldType.INPUT,
      antdFieldProps: {
        placeholder: 'Input in advanced search mode'
      },
      // Special configuration for single-field mode
      antdSingleProps: {
        placeholder: 'Input in single-field mode',
        size: 'large'
      }
    },
    {
      key: 'category',
      label: 'Category',
      type: FieldType.SELECT,
      antdFieldProps: {
        restful: 'https://dummyjson.com/users',
        parseRowsPath: 'users',
        fieldPageSize: 'limit',
        baseParams: { limit: 10 },
        fieldNames: { label: 'firstName', value: 'id' }
      }
    }
  ];

  return (
    <GridForm
      fields={fields}
      advancedSearch={false}
      onSubmit={(values) => console.log('Search:', values)}
    />
  );
};
export default SingleModeAdvanced;
```

### Best Practices

1. **Mode selection**:
   - For few fields (≤3) or mobile scenarios, use single-field mode
   - For complex forms or desktop scenarios, use advanced search mode

2. **Field type selection**: Choose appropriate field types based on data type to improve UX

3. **Validation rules**: Configure validation rules appropriately with clear error messages

4. **Layout optimization**: Adjust grid layout based on field count and importance

5. **Performance optimization**: For forms with many fields, consider step-by-step or grouped approaches

6. **Accessibility**: Ensure all fields have appropriate labels and placeholders

7. **Single-field mode optimization**:
   - Set initial values appropriately so the smart activation strategy works better
   - Use `antdSingleProps` to provide special configuration for single-field mode
