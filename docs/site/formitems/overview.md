---
title: Form Items Overview
order: 0
---

# Form Items Overview

| <div style="width: 20ch;">Component</div> | Description |
| --- | --- |
| [RestSelect](./rest-select.md) | Remote select based on Select; supports search debouncing, data caching, multi-select, copy, `labelTemplate`, and read-only mode |
| [TableSelect](./table-select.md) | Table select based on `RestTable`; supports multi-row selection, collapsible panel for selected data, deselection, and aggregate statistics |
| [RestAutoComplete](./rest-auto-complete.md) | Remote auto-complete based on AutoComplete; supports debouncing, minimum search length, custom `fieldNames` mapping, and `labelTemplate` |
| [RestCascader](./rest-cascader.md) | Remote cascader based on Cascader; supports lazy loading of child nodes, multi-select, path copy, and read-only display |
| [RestTreeSelect](./rest-tree-select.md) | Remote tree select based on TreeSelect; supports lazy loading of child nodes, multi-select, copy, and custom field mapping |
| [UploadView](./upload-view.md) | File upload component; supports drag-and-drop upload, custom request config, progress display, preview/download, and size/count limits |
| [DateStrPicker](./date-str-picker.md) | String-format date picker; automatically converts between strings and dayjs objects; supports `date/time/week/month/year` and other `picker` types |
| [RangeStrPicker](./range-str-picker.md) | String-format date range picker; supports comma-separated strings and arrays as input formats, including time range selection |
| [ExpansionView](./expansion-view.md) | Text expansion input component; supports brace-expansion syntax and remote validation; can be used in forms with `expansionValidator` |
| [NumberRange](./number-range.md) | Closed-interval number range input; supports array/string/number input formats, custom read-only templates, and separate start/end input config |
| [CompareEdit](./compare-edit.md) | History comparison editor; visually shows added/removed/unchanged diffs; supports primitive and array comparison and copy |
| [MentionView](./mention-view.md) | Remote @-mention input based on Mentions; supports search debouncing, custom `fieldNames` mapping, and `inValue` mention extraction |

### Complete Example

The example below demonstrates all form item components in a single form, with switching between edit, read-only, and disabled modes.

```jsx
import React, { useState } from 'react';
import { Button, Divider, Form, Input, Modal, Radio, Space } from 'antd';
import antdRestful from 'antd-restful';
const {
  formitems: {
    CompareEdit,
    RestSelect,
    RestCascader,
    RestTreeSelect,
    RestAutoComplete,
    TableSelect,
    UploadView,
    DateStrPicker,
    RangeStrPicker,
    ExpansionView,
    NumberRange,
    MentionView,
  },
} = antdRestful;

export default () => {
  const [mode, setMode] = useState('edit');
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitValues, setSubmitValues] = useState(null);

  const readOnly = mode === 'readOnly';
  const disabled = mode === 'disabled';

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      setSubmitValues(values);
      setModalOpen(true);
    });
  };

  const handleReset = () => {
    form.resetFields();
  };

  const selectOptions = [
    { value: 1, label: 'Option 1' },
    { value: 2, label: 'Option 2' },
    { value: 3, label: 'Option 3' },
  ];

  const remoteProps = {
    restful: 'https://dummyjson.com/users/search',
    searchKey: 'q',
    parseRowsPath: 'users',
    fieldNames: { label: 'firstName', value: 'id' },
    labelTemplate: '{firstName} {lastName}',
    searchMinEnter: 0,
  };

  const fieldWidth = 400;

  return (
    <div>
      <Radio.Group value={mode} onChange={e => setMode(e.target.value)} style={{ marginBottom: 16 }}>
        <Radio.Button value="edit">Edit</Radio.Button>
        <Radio.Button value="readOnly">Read-only</Radio.Button>
        <Radio.Button value="disabled">Disabled</Radio.Button>
      </Radio.Group>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{ flex: '180px' }}
        initialValues={{
          select: 1,
          multiSelect: [1, 2],
          cascader: ['anhui', 'anqing'],
          tree: 'anqing',
          auto: 'Emily',
          date: '2025-05-25',
          dateRange: '2025-05-01,2025-05-31',
          numberRange: [100, 500],
          text: 'new value',
        }}
      >
        <Divider orientation="left" style={{ margin: '8px 0' }}>Selection</Divider>

        <Form.Item label="Single select (select)" name="select" style={{ marginBottom: 8 }}>
          <RestSelect {...remoteProps} style={{ width: fieldWidth }} readOnly={readOnly} disabled={disabled} />
        </Form.Item>

        <Form.Item label="Multi select (multiSelect)" name="multiSelect" style={{ marginBottom: 8 }}>
          <RestSelect {...remoteProps} mode="multiple" enableCopy style={{ width: fieldWidth }} readOnly={readOnly} disabled={disabled} />
        </Form.Item>

        <Form.Item label="Cascader (cascader)" name="cascader" style={{ marginBottom: 8 }}>
          <RestCascader
            options={[{ key: 'anhui', name: 'Anhui', children: [{ key: 'anqing', name: 'Anqing' }] }]}
            fieldNames={{ label: 'name', value: 'key' }}
            fieldParent="belong"
            style={{ width: fieldWidth }}
            readOnly={readOnly}
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item label="Tree select (tree)" name="tree" style={{ marginBottom: 8 }}>
          <RestTreeSelect
            options={[{ key: 'anhui', name: 'Anhui', children: [{ key: 'anqing', name: 'Anqing' }] }]}
            fieldNames={{ label: 'name', value: 'key' }}
            fieldParent="belong"
            style={{ width: fieldWidth }}
            readOnly={readOnly}
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item label="Auto complete (auto)" name="auto" style={{ marginBottom: 8 }}>
          <RestAutoComplete
            {...remoteProps}
            style={{ width: fieldWidth }}
            readOnly={readOnly}
            disabled={disabled}
          />
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Date</Divider>

        <Form.Item label="Date picker (date)" name="date" style={{ marginBottom: 8 }}>
          <DateStrPicker readOnly={readOnly} disabled={disabled} />
        </Form.Item>

        <Form.Item label="Date range (dateRange)" name="dateRange" style={{ marginBottom: 8 }}>
          <RangeStrPicker readOnly={readOnly} disabled={disabled} />
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Input</Divider>

        <Form.Item label="Number range (numberRange)" name="numberRange" style={{ marginBottom: 8 }}>
          <NumberRange readOnly={readOnly} disabled={disabled} antdStartProps={{ placeholder: 'Min' }} antdEndProps={{ placeholder: 'Max' }} />
        </Form.Item>

        <Form.Item label="Expansion input (expansion)" name="expansion" style={{ marginBottom: 8 }}>
          <ExpansionView
            enableBraceExpansion
            readOnly={readOnly}
            disabled={disabled}
            antdInputProps={{ placeholder: 'Enter {a,b,c} to expand', style: { width: fieldWidth } }}
          />
        </Form.Item>

        <Form.Item label="@ Mention (mention)" name="mention" style={{ marginBottom: 8 }}>
          <MentionView
            restful="https://dummyjson.com/users/search"
            searchKey="q"
            parseRowsPath="users"
            fieldNames={{ label: 'firstName', value: 'username' }}
            labelTemplate="{firstName} {lastName}"
            readOnly={readOnly}
            disabled={disabled}
            antdMentionsProps={{ rows: 2, style: { width: fieldWidth } }}
          />
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Compare Edit</Divider>

        <Form.Item label="Text compare (text)" name="text" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue="old value" enableCopy readOnly={readOnly} disabled={disabled}>
            <Input style={{ width: fieldWidth }} placeholder="Enter text and view comparison" />
          </CompareEdit>
        </Form.Item>

        <Form.Item label="Multi select compare (multiSelect)" name="multiSelect" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue={[1, 3]} fieldValue="value" options={selectOptions} readOnly={readOnly} disabled={disabled}>
            <RestSelect {...remoteProps} mode="multiple" style={{ width: fieldWidth }} />
          </CompareEdit>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Upload</Divider>

        <Form.Item label="File upload (upload)" name="upload" style={{ marginBottom: 8 }}>
          <UploadView uploadUrl="/api/upload/" readOnly={readOnly} disabled={disabled} />
        </Form.Item>
        <Divider style={{ margin: '30px 0 20px' }} />

        <Form.Item label=" " colon={false} style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" onClick={handleSubmit}>Submit</Button>
            <Button onClick={handleReset}>Reset</Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal
        title="Form Submission Data"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <pre style={{ maxHeight: 400, overflow: 'auto', background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
          {JSON.stringify(submitValues, null, 2)}
        </pre>
      </Modal>
    </div>
  );
};
```
