---
title: UploadView
order: 6
---

## UploadView
A file uploader built on Ant Design Upload, supporting drag-and-drop upload, progress display, file preview, and more.

**Features:**
- File upload and drag-and-drop upload
- Upload progress display
- File preview and download
- Read-only display
- File size and count limits
- Custom upload parameters

### Props
| <div style="width: 19ch;">Property</div> | Description | Type | Default | antd Override Notes | Version |
| - | - | - | - | - | - |
| **General** | | | | | |
| style | Custom style | `object` | - | - | - |
| className | Custom class name | `string` | - | - | - |
| children | Custom upload trigger content | `ReactNode` | - | - | - |
| value | Current file list | `FileObject \| FileObject[]` | - | Overrides Upload `fileList`; managed internally | - |
| onChange | Callback when files change | `function(fileList)` | - | Overrides Upload `onChange`; outputs standardized file objects | - |
| **Upload Config** | | | | | |
| method | Upload request method | `string` | `'post'` | - | - |
| uploadUrl | Upload API URL (required) | `string` | - | - | - |
| timeout | Upload timeout in milliseconds | `number` | `10000` | - | - |
| name | File field name in form | `string` | `'file'` | Pass-through Upload `name` | - |
| reqConfig | axios config options | `object` | - | - | - |
| baseParams | Extra parameters for upload request | `object` | - | - | - |
| enableDragger | Whether to support drag-and-drop | `boolean` | `false` | - | - |
| maxSize | File size limit in bytes | `number` | `104857600` | - | - |
| preserveResponse | Whether to keep full server `response` in file object | `boolean` | `false` | - | - |
| **Native Component Support** | | | | | |
| listType | File list type | `string` | `'picture'` | Pass-through Upload `listType` | - |
| maxCount | File count limit; 0 means unlimited | `number` | `1` | Pass-through Upload `maxCount` | - |
| disabled | Whether disabled | `boolean` | `false` | Pass-through Upload `disabled` | - |
| readOnly | Whether read-only mode | `boolean` | `false` | - | - |
| **Ant Design Native Config** | | | | | |
| antdUploadProps | Native props for Ant Design [Upload](https://ant.design/components/upload) | `object` | - | Pass-through Upload props; `fileList` / `onChange` / `customRequest` managed internally | - |
| antdButtonConfig | Upload button config | `object` | - | - | - |
| antdSpaceProps | Native props for Ant Design [Space](https://ant.design/components/space) | `object` | - | Pass-through Space props | - |
| antdReadonlyItemProps | File item props in read-only mode | `object` | - | - | - |

### File Object Type Definition
The component value supports a single file object or an array of file objects. Each file object includes:

| Property | Description | Type | Required |
| - | - | - | - |
| uid | Unique file identifier | `string` | ✅ |
| name | File name | `string` | ❌ |
| url | File access URL | `string` | ❌ |
| thumbUrl | File thumbnail URL | `string` | ❌ |
| size | File size in bytes | `number` | ❌ |
| type | File MIME type, e.g. `image/png` | `string` | ❌ |
| status | Upload status | `string` | ❌ |
| response | Full server response (only when `preserveResponse=true`) | `object` | ❌ |

### File Value Format Examples
The component supports two file value formats:

#### Single File Format
```javascript
{
  uid: "rc-upload-1748693175705-3", // Required field
  status: "done",
  type: "image/png",
  size: 227310,
  name: "example.png",
  url: "http://example.com/uploaded.png",
  thumbUrl: "http://example.com/thumb.png"
}
```

#### Single File Format (preserveResponse=true)
```javascript
{
  uid: "rc-upload-1748693175705-3",
  status: "done",
  type: "image/png",
  size: 227310,
  name: "example.png",
  url: "http://example.com/uploaded.png",
  thumbUrl: "http://example.com/thumb.png",
  response: {
    url: "http://example.com/uploaded.png",
    thumbUrl: "http://example.com/thumb.png",
    id: 123,
    path: "/uploads/example.png"
  }
}
```

#### Multi File Format
```javascript
[
  {
    uid: "rc-upload-1748693175705-3", // Required field
    status: "done",
    type: "image/png",
    size: 227310,
    name: "example1.png",
    url: "http://example.com/uploaded1.png",
    thumbUrl: "http://example.com/thumb1.png"
  }
]
```

### Upload Status
The component defines the following upload statuses:
- `uploading`: Uploading
- `error`: Upload failed
- `done`: Upload succeeded
- `removed`: Removed

### Usage Examples

```jsx
import React, { useState } from 'react';
import { Divider, Form, Radio } from 'antd';
import antdRestful from 'antd-restful';
const { formitems: { UploadView } } = antdRestful;

const valueStyle = { color: '#999', fontSize: 12, marginTop: 2 };

export default () => {
  // Demo URL: intentionally unreachable; example shows UploadView JSX usage only.
  const demoUploadUrl = 'https://example.invalid/api/upload';
  const [mode, setMode] = useState('edit');
  const [basicFiles, setBasicFiles] = useState([]);
  const [draggerFiles, setDraggerFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [responseFiles, setResponseFiles] = useState([]);

  const readOnly = mode === 'readOnly';
  const disabled = mode === 'disabled';

  return (
    <div>
      <Radio.Group value={mode} onChange={e => setMode(e.target.value)} style={{ marginBottom: 16 }}>
        <Radio.Button value="edit">Edit</Radio.Button>
        <Radio.Button value="readOnly">Read-only</Radio.Button>
        <Radio.Button value="disabled">Disabled</Radio.Button>
      </Radio.Group>

      <div style={valueStyle}>Note: uploadUrl below is an unreachable demo address for UploadView usage only.</div>

      <Form layout="horizontal" labelCol={{ flex: '100px' }}>
        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 1: Basic Upload (Count and Size Limits)</Divider>
        <Form.Item label="Upload files" style={{ marginBottom: 8 }}>
          <UploadView
            uploadUrl={demoUploadUrl}
            value={basicFiles}
            onChange={setBasicFiles}
            maxCount={3}
            maxSize={10 * 1024 * 1024}
            readOnly={readOnly}
            disabled={disabled}
          />
          <div style={valueStyle}>Form value: {basicFiles.length} file(s)</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 2: Drag-and-Drop Upload</Divider>
        <Form.Item label="Upload files" style={{ marginBottom: 8 }}>
          <UploadView
            uploadUrl={demoUploadUrl}
            value={draggerFiles}
            onChange={setDraggerFiles}
            enableDragger
            maxCount={5}
            listType="text"
            readOnly={readOnly}
            disabled={disabled}
          />
          <div style={valueStyle}>Form value: {draggerFiles.length} file(s)</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 3: Picture Card Upload</Divider>
        <Form.Item label="Upload images" style={{ marginBottom: 8 }}>
          <UploadView
            uploadUrl={demoUploadUrl}
            value={imageFiles}
            onChange={setImageFiles}
            listType="picture-card"
            maxCount={6}
            baseParams={{ type: 'image' }}
            readOnly={readOnly}
            disabled={disabled}
          />
          <div style={valueStyle}>Form value: {imageFiles.length} file(s)</div>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>Scenario 4: Preserve Server Response</Divider>
        <Form.Item label="Upload files" style={{ marginBottom: 8 }}>
          <UploadView
            uploadUrl={demoUploadUrl}
            value={responseFiles}
            onChange={setResponseFiles}
            preserveResponse
            readOnly={readOnly}
            disabled={disabled}
          />
          <div style={valueStyle}>Form value: {responseFiles.length} file(s)</div>
        </Form.Item>
      </Form>
    </div>
  );
};
```

### Remote API Requirements
- **Request method**: Default `POST`; switch via `method`; request body uses `multipart/form-data`.
- **File field name**: Default `file`; customize via `name` (e.g. `attachment`).
- **Extra parameters**: `baseParams` submitted as additional fields; useful for business type, directory, tenant, etc.
- **Success response**: Should return at least `url`; include `thumbUrl` for thumbnail display in upload list.
- **Response passthrough**: With `preserveResponse`, full server response attached to file object `response` field.
- **Failure semantics**: 4xx/5xx or network errors enter failed state; component shows "Upload failed" and keeps failed items.

### Notes
1. **uploadUrl required**: Must provide a valid upload API URL
2. **File object structure**: Must include `uid` field; other fields (name, url, thumbUrl, size, type, status) are optional
3. **File format**: Component returns file object(s) with url, name, etc.
4. **Size limit**: Control single file size via `maxSize`
5. **Count limit**: Control upload count via `maxCount`
6. **Drag-and-drop**: Enable via `enableDragger` for drag-and-drop upload

### Related Components
- [GridForm](../components/grid-form.md) - Grid form supporting UploadView as a form field type
