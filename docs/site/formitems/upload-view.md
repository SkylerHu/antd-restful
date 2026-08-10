---
title: UploadView
order: 6
---

## UploadView
基于 Ant Design Upload 组件扩展的文件上传器，支持拖拽上传、进度显示、文件预览等功能。

**功能特性：**
- 支持文件上传和拖拽上传
- 支持上传进度显示
- 支持文件预览和下载
- 支持只读模式展示
- 支持文件大小和数量限制
- 支持自定义上传参数

### 参数说明
| <div style="width: 19ch;">参数 (Property)</div> | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | - | - |
| className | 自定义类名 | `string` | - | - | - |
| children | 自定义上传触发内容 | `ReactNode` | - | - | - |
| value | 当前文件列表 | `FileObject \| FileObject[]` | - | 覆盖 Upload `fileList`，由内部管理 | - |
| onChange | 文件变化时的回调函数 | `function(fileList)` | - | 覆盖 Upload `onChange`，输出标准化的文件对象 | - |
| **上传配置** | | | | | |
| method | 上传请求方法 | `string` | `'post'` | - | - |
| uploadUrl | 上传接口地址（必需） | `string` | - | - | - |
| timeout | 上传超时时间，单位毫秒 | `number` | `10000` | - | - |
| name | 表单中文件字段名 | `string` | `'file'` | 透传 Upload `name` | - |
| reqConfig | axios 的配置选项 | `object` | - | - | - |
| baseParams | 上传请求的额外参数 | `object` | - | - | - |
| enableDragger | 是否支持拖拽文件 | `boolean` | `false` | - | - |
| maxSize | 限制文件大小（字节） | `number` | `104857600` | - | - |
| preserveResponse | 是否在文件对象中保留服务端返回的完整 `response` 数据 | `boolean` | `false` | - | - |
| **原生组件支持** | | | | | |
| listType | 文件列表类型 | `string` | `'picture'` | 透传 Upload `listType` | - |
| maxCount | 限制文件个数；0 表示不限制 | `number` | `1` | 透传 Upload `maxCount` | - |
| disabled | 是否禁用 | `boolean` | `false` | 透传 Upload `disabled` | - |
| readOnly | 是否只读模式 | `boolean` | `false` | - | - |
| **Ant Design 原生配置** | | | | | |
| antdUploadProps | Ant Design [Upload](https://ant.design/components/upload-cn) 组件的原生属性 | `object` | - | 透传 Upload 属性，`fileList` / `onChange` / `customRequest` 由内部管理 | - |
| antdButtonConfig | 上传按钮的配置 | `object` | - | - | - |
| antdSpaceProps | Ant Design [Space](https://ant.design/components/space-cn) 组件的原生属性 | `object` | - | 透传 Space 属性 | - |
| antdReadonlyItemProps | 只读模式下文件项的属性 | `object` | - | - | - |

### 文件对象类型定义
组件的 value 支持单个文件对象或文件对象数组。每个文件对象包含以下属性：

| 属性 | 说明 | 类型 | 必需 |
| - | - | - | - |
| uid | 文件唯一标识符 | `string` | ✅ |
| name | 文件名 | `string` | ❌ |
| url | 文件访问地址 | `string` | ❌ |
| thumbUrl | 文件缩略图地址 | `string` | ❌ |
| size | 文件大小（字节） | `number` | ❌ |
| type | 文件MIME类型，如 `image/png` | `string` | ❌ |
| status | 上传状态 | `string` | ❌ |
| response | 服务端返回的完整响应数据（仅 `preserveResponse=true` 时存在） | `object` | ❌ |

### 文件值格式示例
组件支持两种文件值格式：

#### 单文件格式
```javascript
{
  uid: "rc-upload-1748693175705-3", // 必需字段
  status: "done",
  type: "image/png",
  size: 227310,
  name: "example.png",
  url: "http://example.com/uploaded.png",
  thumbUrl: "http://example.com/thumb.png"
}
```

#### 单文件格式（preserveResponse=true）
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

#### 多文件格式
```javascript
[
  {
    uid: "rc-upload-1748693175705-3", // 必需字段
    status: "done",
    type: "image/png",
    size: 227310,
    name: "example1.png",
    url: "http://example.com/uploaded1.png",
    thumbUrl: "http://example.com/thumb1.png"
  }
]
```

### 上传状态
组件定义了以下上传状态：
- `uploading`: 上传中
- `error`: 上传失败
- `done`: 上传成功
- `removed`: 已删除

### 使用示例

```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { UploadView } } = antdRestful;

export default () => {
  // 演示地址：这里故意使用不可达接口，示例仅用于展示 UploadView JSX 用法。
  const demoUploadUrl = 'https://example.invalid/api/upload';
  const [basicFiles, setBasicFiles] = useState([]);
  const [draggerFiles, setDraggerFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [responseFiles, setResponseFiles] = useState([]);

  const files = [
    { uid: '1', url: '/files/document.pdf', name: 'document.pdf' },
    { uid: '2', url: '/files/image.jpg', name: 'image.jpg' },
  ];

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div>场景说明：以下 uploadUrl 为不可达演示地址，仅用于展示 UploadView 用法。</div>

      <div>场景1：基础上传（限制数量和大小）</div>
      <UploadView
        uploadUrl={demoUploadUrl}
        value={basicFiles}
        onChange={setBasicFiles}
        maxCount={3}
        maxSize={10 * 1024 * 1024}
      />
      <div>基础上传文件数：{Array.isArray(basicFiles) ? basicFiles.length : basicFiles ? 1 : 0}</div>

      <div>场景2：拖拽上传</div>
      <UploadView
        uploadUrl={demoUploadUrl}
        value={draggerFiles}
        onChange={setDraggerFiles}
        enableDragger
        maxCount={5}
        listType="text"
      />
      <div>拖拽上传文件数：{Array.isArray(draggerFiles) ? draggerFiles.length : draggerFiles ? 1 : 0}</div>

      <div>场景3：图片卡片上传</div>
      <UploadView
        uploadUrl={demoUploadUrl}
        value={imageFiles}
        onChange={setImageFiles}
        listType="picture-card"
        maxCount={6}
        baseParams={{ type: 'image' }}
      />
      <div>图片上传文件数：{Array.isArray(imageFiles) ? imageFiles.length : imageFiles ? 1 : 0}</div>

      <div>场景4：保留服务端响应</div>
      <UploadView
        uploadUrl={demoUploadUrl}
        value={responseFiles}
        onChange={setResponseFiles}
        preserveResponse
      />
      <div>保留响应示例值：{JSON.stringify(responseFiles ?? null)}</div>

      <div>场景5：只读模式</div>
      <UploadView value={files} readOnly listType="picture" />
    </div>
  );
};
```

### 远程接口要求
- **请求方式**：默认 `POST`，可通过 `method` 切换；请求体使用 `multipart/form-data`。
- **文件字段名**：默认字段名为 `file`，可通过 `name` 自定义（如 `attachment`）。
- **附加参数**：`baseParams` 会作为额外字段一并提交；可用于业务类型、目录、租户等标识。
- **成功响应**：建议返回至少包含 `url`；若希望上传列表直接显示缩略图，建议同时返回 `thumbUrl`。
- **响应透传**：开启 `preserveResponse` 后，组件会把服务端完整响应挂到文件对象 `response` 字段。
- **失败语义**：接口返回 4xx/5xx 或网络错误会进入失败状态，组件展示“上传失败”并保留失败项。

### 注意事项
1. **uploadUrl 必需**：必须提供有效的上传接口地址
2. **文件对象结构**：文件对象必须包含 `uid` 字段，其他字段（name、url、thumbUrl、size、type、status）均为可选
3. **文件格式**：组件返回包含 url、name 等信息的文件对象或文件对象数组
4. **大小限制**：通过 `maxSize` 控制单个文件大小限制
5. **数量限制**：通过 `maxCount` 控制文件上传数量
6. **拖拽功能**：启用 `enableDragger` 后支持拖拽文件上传

### 相关组件
- [GridForm](../GridForm.md) - 网格表单，支持 UploadView 作为表单字段类型
