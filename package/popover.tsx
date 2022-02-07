import Vue from 'vue';
import './popover.scss';

export default Vue.extend({
  props: {
    color: {
      type: String,
      default: '#fff',
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
    containerStyle(): Record<string, string> {
      return {
        left: `${this.left}px`,
        top: `${this.top}px`,
      };
    },
    contentStyle(): Record<string, string> {
      return {
        backgroundColor: this.color,
      };
    },
    arrowStyle(): Record<string, string> {
      return {
        borderTopColor: this.color,
      };
    },
  },
  watch: {
    visible() {
      if (this.visible) {
        const container = this.$el as HTMLDivElement;
        const outer = container.parentElement;
        const content = this.$refs.content as HTMLDivElement;
        Object.assign(container.style, {
          transform: 'translate3d(0, -30px, 0)',
          opacity: 0.5,
        });
        Object.assign(content.style, {
          transform: 'translate(-50%, 0)',
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
            transform: 'translate3d(0, -40px, 0)',
            opacity: 1,
          });
        });
      }
    },
  },
  render() {
    return (
      <div
        class="popover"
        vShow={this.visible}
        style={this.containerStyle}
        vOn:mouseup_stop={() => 0}
      >
        <div ref="content" class="popover-content" style={this.contentStyle}>
          {this.$slots.default}
        </div>
        <i class="popover-arrow" style={this.arrowStyle} />
      </div>
    );
  },
});
