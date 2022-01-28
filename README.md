# text-marker 划词标注组件

该组件用于对文本进行快速标注。用鼠标划取文本片段之后，再选择标注为何种类型。可用于 NLU 的意图训练数据标注。

## 安装

```js
npm install -S @chenzr/text-marker
```

## 全局注册

```js
import Vue from "vue";
import TextMarker from "@chenzr/text-marker";

Vue.use(TextMarker);
```

## 局部注册

```vue
<template>
  <div>
    <text-marker />
  </div>
</template>

<script>
import TextMarker from "@chenzr/text-marker";

export default {
  components: {
    TextMarker,
  },
};
</script>
```

## 代码演示

```vue
<template>
  <div>
    <text-marker :rawText="rawText" :ranges.sync="ranges" :options="options" />
  </div>
</template>

<script>
import TextMarker from "@chenzr/text-marker";

export default {
  components: {
    TextMarker,
  },
  data() {
    return {
      rawText: "我想订周六北京路附近的套房。",
      ranges: [
        {
          start: 3,
          end: 5,
          data: "@日期",
        },
        {
          start: 5,
          end: 8,
          data: "@地名",
        },
      ],
      options: [
        {
          label: "@日期",
          value: "@日期",
        },
        {
          label: "@地名",
          value: "@地名",
        },
        {
          label: "@房型",
          value: "@房型",
        },
      ],
    };
  },
};
</script>
```

## API

| 属性    | 说明         | 类型   | 默认值 |
| ------- | ------------ | ------ | ------ |
| rawText | 待标注原文   | string | ''     |
| ranges  | 被标注的范围 | Array  | []     |
| options | 下拉菜单选项 | Array  | []     |

### 事件

| 事件名称   | 说明                   | 回调参数       |
| ---------- | ---------------------- | -------------- |
| change     | 被标注的范围变化时触发 | ranges => void |
| addMark    | 添加标注时触发         | range => void  |
| removeMark | 删除标注时触发         | range => void  |
