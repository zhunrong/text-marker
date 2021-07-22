<template>
  <div
    v-show="visible"
    class="popover"
    :style="{
      backgroundColor: color,
      left: `${left}px`,
      top: `${top}px`,
      transform,
      opacity,
    }"
    @mouseup.stop
  >
    <div class="popover-content">
      <slot />
    </div>
    <i class="popover-arrow" :style="{ borderTopColor: color }"></i>
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
    return {
      transform: "translate(-50%, -40px)",
      opacity: 1,
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this.transform = "translate(-50%, -30px)";
        this.opacity = 0.5;
        this.$nextTick(() => {
          this.transform = "translate(-50%, -40px)";
          this.opacity = 1;
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.popover {
  position: absolute;
  box-sizing: border-box;
  height: 32px;
  border-radius: 4px;
  background: #607ae3;
  padding: 5px 8px;
  transform: translate(-50%, -40px);
  transition: transform 0.2s, opacity 0.2s;
  white-space: nowrap;
  box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05),
    0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12);
  .popover-content {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);
    line-height: 22px;
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
