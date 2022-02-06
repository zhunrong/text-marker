<template>
  <div
    v-show="visible"
    class="dropdown-menu"
    @mouseup.stop
  >
    <ul>
      <li
        v-for="item in options"
        :key="item.value"
        class="menu-item"
        :title="item.label"
        @click="onMenuClick(item.value)"
      >
        {{ item.label }}
      </li>
      <li
        v-if="!options.length"
        key="_no_data_"
        class="no-data"
      >
        暂无数据
      </li>
    </ul>
  </div>
</template>

<script>
import {
  computePosition,
  getScrollParents,
  flip,
  hide,
  inline,
} from '@floating-ui/dom';

export default {
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    reference: {
      type: HTMLElement,
      default: null,
    },
  },
  watch: {
    visible() {
      if (this.visible) {
        this.parents = [
          ...getScrollParents(this.reference),
          ...getScrollParents(this.$refs),
        ];
        this.parents.forEach((el) => {
          el.addEventListener('scroll', this.updatePosition);
          el.addEventListener('resize', this.updatePosition);
        });
        this.updatePosition();
      } else {
        this.parents.forEach((el) => {
          el.removeEventListener('scroll', this.updatePosition);
          el.removeEventListener('resize', this.updatePosition);
        });
      }
    },
  },
  mounted() {
    document.body.appendChild(this.$el);
  },
  beforeDestroy() {
    document.body.removeChild(this.$el);
    if (this.parents) {
      this.parents.forEach((el) => {
        el.removeEventListener('scroll', this.updatePosition);
        el.removeEventListener('resize', this.updatePosition);
      });
    }
  },
  methods: {
    onMenuClick(value) {
      this.$emit('select', value);
    },
    updatePosition() {
      computePosition(this.reference, this.$el, {
        placement: 'bottom-start',
        middleware: [inline(), flip(), hide()],
      }).then(({ x, y, middlewareData }) => {
        const { referenceHidden } = middlewareData.hide;
        Object.assign(this.$el.style, {
          left: x + 'px',
          top: y + 'px',
          visibility: referenceHidden ? 'hidden' : 'visible',
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown-menu {
  position: absolute;
  width: 180px;
  max-height: 150px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  z-index: 9999;
  &[data-popper-reference-hidden] {
    visibility: hidden;
    pointer-events: none;
  }
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .menu-item:hover {
    background: rgba(96, 122, 227, 0.1);
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
  }
  .no-data {
    cursor: initial;
    text-align: center;
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
