<template>
  <div v-show="visible" class="popover" :style="containerStyle" @mouseup.stop>
    <div ref="content" class="popover-content" :style="contentStyle">
      <slot />
    </div>
    <i class="popover-arrow" :style="arrowStyle"></i>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "#fff",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  computed: {
    containerStyle() {
      return {
        left: `${this.left}px`,
        top: `${this.top}px`,
      };
    },
    contentStyle() {
      return {
        backgroundColor: this.color,
      };
    },
    arrowStyle() {
      return {
        borderTopColor: this.color,
      };
    },
  },
  watch: {
    visible() {
      if (this.visible) {
        const container = this.$el;
        const outer = container.parentElement;
        const content = this.$refs.content;
        Object.assign(container.style, {
          transform: "translate3d(0, -30px, 0)",
          opacity: 0.5,
        });
        Object.assign(content.style, {
          transform: "translate(-50%, 0)",
        });
        requestAnimationFrame(() => {
          const outerRect = outer.getBoundingClientRect();
          const contentRect = content.getBoundingClientRect();
          let offsetX = -contentRect.width / 2;
          // 避免 popover 超出外层元素
          if (contentRect.left < outerRect.left) {
            offsetX += outerRect.left - contentRect.left;
          } else if (contentRect.right > outerRect.right) {
            offsetX += outerRect.right - contentRect.right;
          }
          Object.assign(content.style, {
            transform: `translate(${offsetX}px, 0)`,
          });
          Object.assign(container.style, {
            transform: "translate3d(0, -40px, 0)",
            opacity: 1,
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.popover {
  position: absolute;
  transform: translate3d(0, -40px, 0);
  transition: transform 0.2s, opacity 0.2s;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  .popover-content {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);
    line-height: 22px;
    position: absolute;
    box-sizing: border-box;
    height: 32px;
    border-radius: 4px;
    background: #607ae3;
    padding: 5px 8px;
    white-space: nowrap;
    transform: translate(-50%, 0);
  }
  .popover-arrow {
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
</style>
