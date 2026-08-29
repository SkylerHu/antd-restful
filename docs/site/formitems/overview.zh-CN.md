---
title: 表单项总览
order: 0
---

# 表单项总览

| <div style="width: 20ch;">组件 (Component)</div> | 说明 |
| --- | --- |
| [RestSelect](./rest-select.zh-CN.md) | 基于 Select 的远程选择器，支持搜索防抖、数据缓存、多选、复制功能、`labelTemplate` 模板及只读模式 |
| [TableSelect](./table-select.zh-CN.md) | 基于 `RestTable` 的表格选择器，支持多行选择、折叠面板展示已选数据、取消选择及聚合统计 |
| [RestAutoComplete](./rest-auto-complete.zh-CN.md) | 基于 AutoComplete 的远程搜索自动补全，支持防抖、最小搜索字符数、自定义 `fieldNames` 映射及 `labelTemplate` |
| [RestCascader](./rest-cascader.zh-CN.md) | 基于 Cascader 的远程级联选择，支持子节点懒加载、多选、复制路径及只读展示 |
| [RestTreeSelect](./rest-tree-select.zh-CN.md) | 基于 TreeSelect 的远程树形选择，支持子节点懒加载、多选、复制功能及自定义字段映射 |
| [UploadView](./upload-view.zh-CN.md) | 文件上传组件，支持拖拽上传、自定义请求配置、进度显示、预览/下载及大小/数量限制 |
| [DateStrPicker](./date-str-picker.zh-CN.md) | 字符串格式日期选择器，自动处理字符串与 dayjs 对象转换，支持 `date/time/week/month/year` 等 `picker` 类型 |
| [RangeStrPicker](./range-str-picker.zh-CN.md) | 字符串格式日期范围选择器，支持逗号分隔字符串与数组两种输入格式，支持时间范围选择 |
| [ExpansionView](./expansion-view.zh-CN.md) | 文本扩展输入组件，支持 brace-expansion 语法扩展与远程验证，可配合 `expansionValidator` 在表单中使用 |
| [NumberRange](./number-range.zh-CN.md) | 闭区间数字范围输入，支持数组/字符串/数字多种输入格式，支持自定义只读模板及起止输入框分别配置 |
| [CompareEdit](./compare-edit.zh-CN.md) | 历史值对比编辑器，可视化展示新增/删除/未修改的差异，支持基础类型与数组对比及复制功能 |
| [MentionView](./mention-view.zh-CN.md) | 基于 Mentions 的远程 @提及输入框，支持搜索防抖、自定义 `fieldNames` 映射及 `inValue` 提及信息提取 |

### 完整示例

以下示例展示所有表单项组件在同一表单中的使用效果，支持编辑/只读/禁用三种模式切换。

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
    { value: 1, label: '选项1' },
    { value: 2, label: '选项2' },
    { value: 3, label: '选项3' },
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
        <Radio.Button value="edit">编辑</Radio.Button>
        <Radio.Button value="readOnly">只读</Radio.Button>
        <Radio.Button value="disabled">禁用</Radio.Button>
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
        <Divider orientation="left" style={{ margin: '8px 0' }}>选择类</Divider>

        <Form.Item label="单选 (select)" name="select" style={{ marginBottom: 8 }}>
          <RestSelect {...remoteProps} style={{ width: fieldWidth }} readOnly={readOnly} disabled={disabled} />
        </Form.Item>

        <Form.Item label="多选 (multiSelect)" name="multiSelect" style={{ marginBottom: 8 }}>
          <RestSelect {...remoteProps} mode="multiple" enableCopy style={{ width: fieldWidth }} readOnly={readOnly} disabled={disabled} />
        </Form.Item>

        <Form.Item label="级联选择 (cascader)" name="cascader" style={{ marginBottom: 8 }}>
          <RestCascader
            options={[{ key: 'anhui', name: '安徽', children: [{ key: 'anqing', name: '安庆' }] }]}
            fieldNames={{ label: 'name', value: 'key' }}
            fieldParent="belong"
            style={{ width: fieldWidth }}
            readOnly={readOnly}
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item label="树形选择 (tree)" name="tree" style={{ marginBottom: 8 }}>
          <RestTreeSelect
            options={[{ key: 'anhui', name: '安徽', children: [{ key: 'anqing', name: '安庆' }] }]}
            fieldNames={{ label: 'name', value: 'key' }}
            fieldParent="belong"
            style={{ width: fieldWidth }}
            readOnly={readOnly}
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item label="自动补全 (auto)" name="auto" style={{ marginBottom: 8 }}>
          <RestAutoComplete
            {...remoteProps}
            style={{ width: fieldWidth }}
            readOnly={readOnly}
            disabled={disabled}
          />
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>日期类</Divider>

        <Form.Item label="日期选择 (date)" name="date" style={{ marginBottom: 8 }}>
          <DateStrPicker readOnly={readOnly} disabled={disabled} />
        </Form.Item>

        <Form.Item label="日期范围 (dateRange)" name="dateRange" style={{ marginBottom: 8 }}>
          <RangeStrPicker readOnly={readOnly} disabled={disabled} />
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>输入类</Divider>

        <Form.Item label="数字范围 (numberRange)" name="numberRange" style={{ marginBottom: 8 }}>
          <NumberRange readOnly={readOnly} disabled={disabled} antdStartProps={{ placeholder: '最小值' }} antdEndProps={{ placeholder: '最大值' }} />
        </Form.Item>

        <Form.Item label="扩展输入 (expansion)" name="expansion" style={{ marginBottom: 8 }}>
          <ExpansionView
            enableBraceExpansion
            readOnly={readOnly}
            disabled={disabled}
            antdInputProps={{ placeholder: '输入 {a,b,c} 进行扩展', style: { width: fieldWidth } }}
          />
        </Form.Item>

        <Form.Item label="@提及 (mention)" name="mention" style={{ marginBottom: 8 }}>
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

        <Divider orientation="left" style={{ margin: '8px 0' }}>对比编辑</Divider>

        <Form.Item label="文本对比 (text)" name="text" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue="old value" enableCopy readOnly={readOnly} disabled={disabled}>
            <Input style={{ width: fieldWidth }} placeholder="输入文本并查看对比" />
          </CompareEdit>
        </Form.Item>

        <Form.Item label="多选对比 (multiSelect)" name="multiSelect" style={{ marginBottom: 8 }}>
          <CompareEdit historyValue={[1, 3]} fieldValue="value" options={selectOptions} readOnly={readOnly} disabled={disabled}>
            <RestSelect {...remoteProps} mode="multiple" style={{ width: fieldWidth }} />
          </CompareEdit>
        </Form.Item>

        <Divider orientation="left" style={{ margin: '8px 0' }}>上传</Divider>

        <Form.Item label="文件上传 (upload)" name="upload" style={{ marginBottom: 8 }}>
          <UploadView uploadUrl="/api/upload/" readOnly={readOnly} disabled={disabled} />
        </Form.Item>
        <Divider style={{ margin: '30px 0 20px' }} />

        <Form.Item label=" " colon={false} style={{ marginBottom: 0 }}>
          <Space>
            <Button type="primary" onClick={handleSubmit}>提交</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <Modal
        title="表单提交数据"
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
