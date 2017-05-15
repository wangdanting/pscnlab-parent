# 通用组件
## 表格footer
示例位置：src/component/table-footer/Demo.jsx

```
<TableFooter visible={true}>
    <TableFooterDefaultContent data={footerData} />
</TableFooter>(显示固定样式)
或
<TableFooter visible={visible}>
    //自定义标签
</TableFooter>(显示自定义样式)
```
|参数 | 说明| 类型| 默认值|
|----|----|----|----|
|visible|是否显示|Boolean|false|

|参数 | 说明| 类型| 默认值|
|----|----|----|----|
|text|显示的内容|Object|{key:'',value:''} |
