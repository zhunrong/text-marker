import Vue, { PropType } from 'vue';
import {
  computePosition,
  getScrollParents,
  flip,
  hide,
  inline,
} from '@floating-ui/dom';
import './dropdown-menu.scss';

export type Option = {
  label: string;
  value: string;
};

export default Vue.extend({
  name: 'DropdownMenu',
  props: {
    options: {
      type: Array as PropType<Option[]>,
      default(): Option[] {
        return [];
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    reference: {
      type: HTMLElement as PropType<HTMLElement>,
      default: null,
    },
  },
  data() {
    return {
      parents: undefined as unknown as ReturnType<typeof getScrollParents>,
    };
  },
  watch: {
    visible() {
      if (this.visible) {
        this.parents = [
          ...getScrollParents(this.reference),
          ...getScrollParents(this.$el),
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
    document.body.appendChild(this.$el as HTMLDivElement);
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
    onMenuClick(value: string) {
      this.$emit('select', value);
    },
    updatePosition() {
      const rootEl = this.$el as HTMLDivElement;
      computePosition(this.reference, rootEl, {
        placement: 'bottom-start',
        middleware: [inline(), flip(), hide()],
      }).then(({ x, y, middlewareData }) => {
        const { referenceHidden } = middlewareData.hide;
        Object.assign(rootEl.style, {
          left: x + 'px',
          top: y + 'px',
          visibility: referenceHidden ? 'hidden' : 'visible',
        });
      });
    },
  },
  render() {
    return (
      <div
        class="dropdown-menu"
        vShow={this.visible}
        vOn:mouseup_stop={() => 0}
      >
        <ul>
          {this.options.length ? (
            this.options.map((item) => (
              <li
                class="menu-item"
                key={item.value}
                title={item.label}
                vOn:click={() => this.onMenuClick(item.value)}
              >
                {item.label}
              </li>
            ))
          ) : (
            <li class="no-data" key="_no_data_">
              暂无数据
            </li>
          )}
        </ul>
      </div>
    );
  },
});
