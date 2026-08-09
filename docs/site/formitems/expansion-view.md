---
title: ExpansionView
order: 3
---

## ExpansionView
支持文本扩展和远程验证的输入组件，可以将用户输入进行扩展处理或远程验证，适用于需要实时处理输入内容的场景。

在表单中使用时，可结合校验 [expansionValidator](../validators.md#expansionValidator) 一起使用。

**功能特性：**
- 支持 brace-expansion 语法扩展
- 支持远程验证和处理
- 支持错误信息展示
- 支持加载状态显示
- 支持只读模式
- 支持自定义输出模板

### 参数说明
| 参数 | 说明 | 类型 | 默认值 | antd 覆盖说明 | 版本 |
| - | - | - | - | - | - |
| **通用属性** | | | | | |
| style | 自定义样式 | `object` | - | - | - |
| className | 自定义类名 | `string` | - | - | - |
| value | 当前值对象，包含 input、output、error 等字段 | `object` | - | - | - |
| onChange | 值变化时的回调函数 | `function(value)` | - | - | - |
| **扩展功能** | | | | | |
| enableBraceExpansion | 开启后，支持 brace-expansion 的语法输入 | `boolean` | `false` | - | - |
| **远程处理** | | | | | |
| restful | 远程处理接口地址 | `string` | - | - | - |
| reqConfig | axios 的配置选项 | `object` | - | - | - |
| inputKey | 输入的值作为 value，inputKey 是请求的 key | `string` | `'input'` | - | - |
| inputMinEnter | 输入最小长度；仅在 restful 有值时有效 | `number` | `1` | - | - |
| baseParams | 请求的额外参数 | `object` | - | - | - |
| valueTemplate | 输出值的模板，{value} 则是输入的值，其余 key 值从 baseParams 中获取 | `string` | - | - | - |
| **UI 配置** | | | | | |
| longTextProps | LongText 组件的属性 | `object` | - | - | - |
| longErrorProps | 错误信息 LongText 组件的属性 | `object` | - | - | - |
| **状态控制** | | | | | |
| disabled | 是否禁用 | `boolean` | `false` | 透传 Input `disabled` | - |
| readOnly | 是否只读模式 | `boolean` | `false` | 透传 Input `readOnly` | - |
| **Ant Design 原生配置** | | | | | |
| antdSpaceProps | Ant Design [Space](https://ant.design/components/space-cn) 组件的原生属性 | `object` | - | 透传 Space 属性，`direction` / `style` 有默认值 | - |
| antdInputProps | Ant Design [Input](https://ant.design/components/input-cn) 组件的原生属性 | `object` | - | 透传 Input 属性，`value` / `onChange` / `disabled` / `readOnly` 由内部管理 | - |
| antdAlertProps | Ant Design [Alert](https://ant.design/components/alert-cn) 组件的原生属性 | `object` | - | 透传 Alert 属性，`message` / `type` / `closable` 由内部管理 | - |

### 使用示例

```jsx
import React, { useState } from 'react';
import antdRestful from 'antd-restful';
const { formitems: { ExpansionView } } = antdRestful;

export default () => {
  const [basicValue, setBasicValue] = useState();
  const [templateValue, setTemplateValue] = useState();
  const [remoteValue, setRemoteValue] = useState();

  const readOnlyValue = {
    input: '{a,b,c}',
    output: ['a', 'b', 'c'],
    error: null,
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div>场景1：基础 brace-expansion 扩展</div>
      <ExpansionView
        value={basicValue}
        onChange={setBasicValue}
        enableBraceExpansion
        antdInputProps={{ placeholder: '输入 {a,b,c} 进行扩展', style: { width: 380 } }}
      />
      <div>基础扩展输出：{JSON.stringify(basicValue?.output ?? null)}</div>

      <div>场景2：模板化输出</div>
      <ExpansionView
        value={templateValue}
        onChange={setTemplateValue}
        enableBraceExpansion
        valueTemplate="processed_{value}_result"
        baseParams={{ prefix: 'custom' }}
        antdInputProps={{ placeholder: '输入后按模板输出', style: { width: 380 } }}
      />
      <div>模板输出：{JSON.stringify(templateValue?.output ?? null)}</div>

      <div>场景3：远程校验（输入至少 3 个字符）</div>
      <ExpansionView
        value={remoteValue}
        onChange={setRemoteValue}
        restful="/api/validate"
        inputKey="content"
        inputMinEnter={3}
        baseParams={{ type: 'validation' }}
        antdInputProps={{ placeholder: '输入至少 3 个字符触发远程验证', style: { width: 380 } }}
      />
      <div>远程返回：{JSON.stringify(remoteValue?.output ?? null)}</div>
      <div>远程错误：{remoteValue?.error || '-'}</div>

      <div>场景4：只读模式</div>
      <ExpansionView value={readOnlyValue} readOnly />
    </div>
  );
};
```

### 值对象结构
```javascript
{
  input: 'string',     // 用户输入的内容
  output: 'any',       // 处理后的输出结果
  error: 'string',     // 错误信息
  loading: 'boolean'   // 加载状态
}
```

### brace-expansion 语法
支持类似 bash 的大括号扩展语法：
- `{a,b,c}` → `['a', 'b', 'c']`
- `{1..3}` → `['1', '2', '3']`
- `prefix{a,b}suffix` → `['prefixa suffix', 'prefixbsuffix']`

### 注意事项
1. **表单验证**：在表单中需要配合特定的 validator，校验 `!isBlank(input) && !loading && !error`
2. **防抖处理**：远程请求有 200ms 的防抖延迟
3. **错误处理**：错误信息会以红色 Alert 形式显示
4. **输出展示**：成功结果会以绿色 Alert 形式显示
5. **模板语法**：`valueTemplate` 支持 `{value}` 和 `baseParams` 中的字段

### 相关组件
- [RestSelect](./RestSelect.md) - 远程下拉选择器
- [TableSelect](./TableSelect.md) - 表格选择器
- [CopyView](./CopyView.md) - 支持复制的文本组件
