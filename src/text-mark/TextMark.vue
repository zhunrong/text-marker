<template>
  <div class="text-mark">
    <p ref="paragraph" class="paragraph"></p>
    <div
      ref="popover"
      class="popover"
      :style="{ backgroundColor: popoverColor }"
      @mouseup.stop
    >
      <div class="content">
        <div v-if="popoverType === 'add'" class="add-mark" @click="addMark">
          <Icon type="plus" />添加标注
        </div>
        <div v-if="popoverType === 'remove'" class="remove-mark">
          {{ popoverText }} <Icon @click="removeMark" type="close" />
        </div>
      </div>
      <i class="arrow" :style="{ borderTopColor: popoverColor }"></i>
    </div>
    <div ref="dropdown" class="dropdown-menu" @mouseup.stop>
      <ul>
        <li
          v-for="item in options"
          :key="item.value"
          @click="onMenuClick(item.value)"
        >
          {{ item.label }}
        </li>
        <li v-if="!options.length" class="no-data" key="_no_data_">暂无数据</li>
      </ul>
    </div>
  </div>
</template>

<script>
import TextSelection from "./selection";
import { Icon } from "ant-design-vue";

const COLORS = [
  "#607AE3",
  "#FD4A4A",
  "#31CCB9",
  "#FE9A35",
  "#8F68DF",
  "#45C26A",
];

export default {
  components: {
    Icon,
  },
  props: {
    rawText: {
      type: String,
      default: "",
    },
    ranges: {
      type: Array,
      default() {
        return [];
      },
    },
    options: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      popoverType: "add",
      popoverText: "",
      popoverColor: "#fff",
    };
  },
  mounted() {
    this.range = null;
    this.textSelection = new TextSelection(this.$refs.paragraph);
    this.textSelection.init(this.rawText, this.ranges);
    this.$emit("update:ranges", [...this.textSelection.ranges]);
    this.textSelection.on("range:insert", this.onRangeInsert);
    this.textSelection.on("range:click", this.onRangeClick);
    document.addEventListener("mouseup", this.onDocClick);
  },
  beforeDestroy() {
    if (this.textSelection) {
      this.textSelection.destroy();
    }
    document.removeEventListener("mouseup", this.onDocClick);
  },
  methods: {
    onRangeInsert({ range }) {
      const p = this.textSelection.getRangePosition(range);
      this.$refs.dropdown.style.display = "none";
      this.popoverType = "add";
      const index = this.textSelection.getRangeIndex(range);
      this.popoverColor = this.getColor(index);
      Object.assign(this.$refs.popover.style, {
        left: `${p.left + p.width / 2}px`,
        top: `${p.top}px`,
        display: "block",
      });
      if (this.range && !this.range.data) {
        this.textSelection.removeRange(this.range);
      }
      this.range = range;
    },
    onRangeClick({ range }) {
      this.popoverType = "remove";
      const option = this.options.find((item) => item.value === range.data);
      this.popoverText = option ? option.label : range.data;
      if (this.range && !this.range.data) {
        this.textSelection.removeRange(this.range);
      }
      this.range = range;
      const p = this.textSelection.getRangePosition(range);
      const index = this.textSelection.getRangeIndex(range);
      this.popoverColor = this.getColor(index);
      Object.assign(this.$refs.popover.style, {
        left: `${p.left + p.width / 2}px`,
        top: `${p.top}px`,
        display: "block",
      });
    },
    onMenuClick(value) {
      this.range.data = value;
      this.$refs.dropdown.style.display = "none";
      this.range = null;
      this.textSelection.renderHTML();
      this.$emit("update:ranges", [...this.textSelection.ranges]);
    },
    onDocClick() {
      if (this.range && !this.range.data) {
        this.textSelection.removeRange(this.range);
        this.range = null;
      }
      this.$refs.dropdown.style.display = "none";
      this.$refs.popover.style.display = "none";
    },
    /**
     * 添加标注
     */
    addMark() {
      const p = this.textSelection.getRangePosition(this.range);
      this.$refs.popover.style.display = "none";
      Object.assign(this.$refs.dropdown.style, {
        display: "block",
        left: `${p.left}px`,
        top: `${p.top + p.height}px`,
      });
    },
    /**
     * 删除标注
     */
    removeMark() {
      this.$refs.popover.style.display = "none";
      this.textSelection.removeRange(this.range);
      this.$emit("update:ranges", [...this.textSelection.ranges]);
    },
    getColor(index) {
      return COLORS[index % COLORS.length];
    },
  },
};
</script>

<style lang="scss" scoped>
.text-mark {
  position: relative;
  .paragraph {
    line-height: 24px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
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
  .popover {
    position: absolute;
    box-sizing: border-box;
    height: 32px;
    border-radius: 4px;
    background: #607ae3;
    padding: 5px 8px;
    transform: translate(-50%, -40px);
    display: none;
    white-space: nowrap;
    box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
      0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
    .content {
      font-size: 14px;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.85);
      line-height: 22px;
      .add-mark {
        cursor: pointer;
        display: flex;
        align-items: center;
        line-height: 16px;
        height: 22px;
        .anticon-plus {
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
        .anticon-close {
          margin-left: 6px;
          cursor: pointer;
          height: 14px;
          &:hover {
            opacity: 0.75;
          }
        }
      }
    }
    .arrow {
      display: block;
      position: absolute;
      top: 32px;
      border-top: 4px solid #607ae3;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      left: 50%;
      margin-left: -4px;
    }
  }
  .dropdown-menu {
    position: absolute;
    display: none;
    width: 200px;
    max-height: 150px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
      0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
    ul {
      margin: 0;
      padding: 4px 0;
      list-style: none;
    }
    li {
      height: 32px;
      padding: 5px 12px;
      box-sizing: border-box;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      cursor: pointer;
      &:hover {
        background: rgba(96, 122, 227, 0.1);
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
      }
    }
    .no-data {
      cursor: initial;
    }
  }
}
</style>
