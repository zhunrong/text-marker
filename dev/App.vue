<template>
  <div id="app">
    <scroll-view style="height: 200px">
      <div style="padding: 40px 5px">
        <text-marker
          :raw-text="rawText"
          :ranges.sync="ranges"
          :options="options"
        />
      </div>
    </scroll-view>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      rawText:
        '用户可能从左到右（与文档方向相同）连续空格start         连续空格end（与文档方向相反）选择文本。anchor 指向用户开始选择的地方，而 focus 指向用户结束选择的地方。如果你使用鼠标选择文本的话，anchor 就指向你按下鼠标键的地方，而 focus 就指向你松开鼠标键的地方。anchor 和 focus 的概念不能与选区的起始位置和终止位置混淆，因为 anchor 指向的位置可能在 focus 指向的位置的前面，也可能在 focus 指向位置的后面，这取决于你选择文本时鼠标移动的方向（也就是按下鼠标键和松开鼠标键的位置）。',
      ranges: [
        {
          start: 5,
          end: 15,
          data: '@日期',
        },
        {
          start: 20,
          end: 32,
          data: '@日期',
        },
      ],
      options: [
        {
          label: '@日期123123123',
          value: '@日期',
        },
        {
          label: '@时间',
          value: '@时间',
        },
        {
          label: '@地名',
          value: '@地名',
        },
      ],
    };
  },
});
</script>
