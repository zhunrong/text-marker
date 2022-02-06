<template>
  <div class="text-mark">
    <p
      ref="paragraph"
      class="paragraph"
    />
    <Popover v-bind="popover">
      <div
        v-if="popoverType === 'add'"
        class="add-mark"
        @click="addMark"
      >
        <Icon type="plus" />添加标注
      </div>
      <div
        v-if="popoverType === 'remove'"
        class="remove-mark"
      >
        {{ popoverText }} <Icon
          type="close"
          @click.native="removeMark"
        />
      </div>
    </Popover>
    <Dropdown
      :options="options"
      v-bind="dropdown"
      @select="onSelect"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import TextSelection, { TextRange } from './selection';
import Popover from './Popover.vue';
import Dropdown from './Dropdown.vue';
import Icon from './Icon.vue';

const COLORS = [
  '#607AE3',
  '#FD4A4A',
  '#31CCB9',
  '#FE9A35',
  '#8F68DF',
  '#45C26A',
];

export default Vue.extend({
  name: 'TextMarker',
  components: {
    Dropdown,
    Popover,
    Icon,
  },
  props: {
    rawText: {
      type: String,
      default: '',
    },
    ranges: {
      type: Array as PropType<TextRange[]>,
      default() {
        return [];
      },
    },
    options: {
      type: Array as PropType<{ label: string; value: string }[]>,
      default(){
        return [];
      },
    },
  },
  data() {
    return {
      popoverType: 'add',
      popoverText: '',
      popover: {
        visible: false,
        color: '',
        left: 0,
        top: 0,
      },
      dropdown: {
        visible: false,
        left: 0,
        top: 0,
      },
      range: undefined as unknown as TextRange | null,
      textSelection: undefined as unknown as TextSelection,
    };
  },
  watch: {
    ranges() {
      this.textSelection.init(this.rawText, this.ranges);
    },
    rawText() {
      this.textSelection.init(this.rawText, this.ranges);
    },
  },
  mounted() {
    const paragraph = this.$refs.paragraph as HTMLParagraphElement;
    this.textSelection = new TextSelection(paragraph);
    this.textSelection.init(this.rawText, this.ranges);
    // this.$emit("update:ranges", [...this.textSelection.ranges]);
    this.textSelection.on('range:insert', this.onRangeInsert);
    this.textSelection.on('range:click', this.onRangeClick);
    document.addEventListener('mouseup', this.onDocClick);
  },
  beforeDestroy() {
    if (this.textSelection) {
      this.textSelection.destroy();
    }
    document.removeEventListener('mouseup', this.onDocClick);
  },
  methods: {
    onRangeInsert({ range }: { range: TextRange }) {
      if (this.range && !this.range.data) {
        this.textSelection.removeRange(this.range);
      }
      this.popover.visible = false;
      this.$nextTick(() => {
        const p = this.textSelection.getRangePosition(range);
        if (!p) return;
        this.dropdown.visible = false;
        this.popoverType = 'add';
        const index = this.textSelection.getRangeIndex(range);
        this.popover.color = this.getColor(index);
        this.popover.left = p.left + p.width / 2;
        this.popover.top = p.top;
        this.popover.visible = true;
        this.range = range;
      });
    },

    onRangeClick({ range }: { range: TextRange }) {
      this.popover.visible = false;
      this.$nextTick(() => {
        this.popoverType = 'remove';
        const option = this.options.find((item) => item.value === range.data);
        this.popoverText = option ? option.label : range.data;
        if (this.range && !this.range.data) {
          this.textSelection.removeRange(this.range);
        }
        this.range = range;
        const p = this.textSelection.getRangePosition(range);
        if (!p) return;
        const index = this.textSelection.getRangeIndex(range);
        Object.assign(this.popover, {
          visible: true,
          color: this.getColor(index),
          left: p.left + p.width / 2,
          top: p.top,
        });
      });
    },

    onSelect(value: string) {
      if (!this.range) return;
      this.range.data = value;
      this.dropdown.visible = false;
      this.textSelection.renderHTML();
      this.$emit('update:ranges', [...this.textSelection.ranges]);
      this.$emit('change', [...this.textSelection.ranges]);
      this.$emit('addMark', { ...this.range });
      this.range = null;
    },

    onDocClick() {
      if (this.range && !this.range.data) {
        this.textSelection.removeRange(this.range);
        this.range = null;
      }
      this.dropdown.visible = false;
      this.popover.visible = false;
    },

    /**
     * 添加标注
     */
    addMark() {
      if (!this.range) return;
      this.popover.visible = false;
      Object.assign(this.dropdown, {
        visible: true,
        reference: this.textSelection.getRangeElement(this.range),
      });
    },

    /**
     * 删除标注
     */
    removeMark() {
      if (!this.range) return;
      this.popover.visible = false;
      this.textSelection.removeRange(this.range);
      this.$emit('update:ranges', [...this.textSelection.ranges]);
      this.$emit('change', [...this.textSelection.ranges]);
      this.$emit('removeMark', { ...this.range });
    },

    getColor(index: number) {
      return COLORS[index % COLORS.length];
    },
  },
});
</script>

<style lang="scss" scoped>
.text-mark {
  position: relative;
  .paragraph {
    line-height: 24px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    margin: 0;
    white-space: pre-wrap;
    &::v-deep {
      .default {
        background-color: #cad9ff;
        cursor: pointer;
        position: relative;
        padding: 3px 0;
      }
      span:nth-child(6n + 1) {
        background-color: rgba(202, 217, 255, 1);
      }
      span:nth-child(6n + 2) {
        background-color: rgba(254, 200, 200, 1);
      }
      span:nth-child(6n + 3) {
        background-color: rgba(192, 240, 233, 1);
      }
      span:nth-child(6n + 4) {
        background-color: rgba(254, 227, 198, 1);
      }
      span:nth-child(6n + 5) {
        background-color: rgba(199, 191, 255, 1);
      }
      span:nth-child(6n + 6) {
        background-color: rgba(195, 231, 205, 1);
      }
    }
  }
  .add-mark {
    cursor: pointer;
    display: flex;
    align-items: center;
    line-height: 16px;
    height: 22px;
    .icon-plus {
      margin-right: 6px;
      height: 14px;
    }
    &:hover {
      opacity: 0.75;
    }
  }
  .remove-mark {
    display: flex;
    align-items: center;
    line-height: 16px;
    height: 22px;
    .icon-close {
      margin-left: 6px;
      cursor: pointer;
      height: 14px;
      &:hover {
        opacity: 0.75;
      }
    }
  }
}
</style>
