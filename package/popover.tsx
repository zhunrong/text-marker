import Vue, { VNode, CreateElement } from 'vue';
import {
  computePosition,
  getScrollParents,
  hide,
  inline,
  shift,
  offset,
  arrow,
} from '@floating-ui/dom';
import './popover.scss';

type Options = {
  reference: Element;
  color?: string;
  render: (createElement: CreateElement) => VNode;
};

export class Popover {
  private popoverContainer = document.createElement('div');
  private popoverContent = document.createElement('div');
  private popoverArrow = document.createElement('i');
  private vm: Vue = null;
  private reference: Element = null;
  private color = '#fff';
  private parents: ReturnType<typeof getScrollParents> = [];

  constructor() {
    this.popoverContainer.className = 'popover';
    this.popoverContent.className = 'popover-content';
    this.popoverArrow.className = 'popover-arrow';
    this.popoverContainer.appendChild(this.popoverContent);
    this.popoverContainer.appendChild(this.popoverArrow);
  }

  show({ reference, color, render }: Options) {
    this.hide();
    this.reference = reference;
    this.color = color;
    this.vm = new Vue({
      render(h) {
        return <div class="popover-content">{render(h)}</div>;
      },
    });
    this.vm.$mount(this.popoverContent);
    document.body.appendChild(this.popoverContainer);
    this.parents = [
      ...getScrollParents(this.reference),
      ...getScrollParents(this.popoverContainer),
    ];
    this.parents.forEach((el) => {
      el.addEventListener('scroll', this.updatePosition);
      el.addEventListener('resize', this.updatePosition);
    });
    this.updatePosition();
  }

  hide() {
    this.parents.forEach((el) => {
      el.removeEventListener('scroll', this.updatePosition);
      el.removeEventListener('resize', this.updatePosition);
    });
    this.parents = [];
    if (this.vm) {
      document.body.removeChild(this.popoverContainer);
      this.vm.$destroy();
      this.vm = null;
    }
  }

  destroy() {
    this.hide();
  }

  private updatePosition() {
    computePosition(this.reference, this.popoverContainer, {
      placement: 'top',
      middleware: [
        offset(5),
        inline(),
        shift({ padding: 5 }),
        arrow({ element: this.popoverArrow }),
        hide(),
      ],
    }).then(({ x, y, middlewareData }) => {
      const { hide, arrow } = middlewareData;
      Object.assign(this.popoverContainer.style, {
        left: x + 'px',
        top: y + 'px',
        visibility: hide.referenceHidden ? 'hidden' : 'visible',
      });
      Object.assign(this.popoverArrow.style, {
        left: typeof arrow.x === 'number' ? `${arrow.x}px` : '',
        top: typeof arrow.y === 'number' ? `${arrow.y}px` : '',
      });
    });
  }
}

export default Vue.extend({
  data() {
    return {
      visible: false,
      color: '#fff',
      reference: undefined as unknown as HTMLElement,
      parents: undefined as unknown as ReturnType<typeof getScrollParents>,
    };
  },
  computed: {
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
  mounted() {
    document.body.appendChild(this.$el as HTMLDivElement);
  },
  beforeDestroy() {
    document.body.removeChild(this.$el);
  },
  methods: {
    show(reference: HTMLElement, color: string) {
      this.reference = reference;
      this.color = color;
      this.visible = true;
      this.parents = [
        ...getScrollParents(this.reference),
        ...getScrollParents(this.$el),
      ];
      this.parents.forEach((el) => {
        el.addEventListener('scroll', this.updatePosition);
        el.addEventListener('resize', this.updatePosition);
      });
      this.updatePosition();
    },
    hide() {
      this.visible = false;
      if (this.parents) {
        this.parents.forEach((el) => {
          el.removeEventListener('scroll', this.updatePosition);
          el.removeEventListener('resize', this.updatePosition);
        });
      }
    },
    updatePosition() {
      const rootEl = this.$el as HTMLDivElement;
      const arrowEl = this.$refs.arrow as HTMLElement;
      computePosition(this.reference, rootEl, {
        placement: 'top',
        middleware: [
          offset(5),
          inline(),
          shift({ padding: 5 }),
          arrow({ element: arrowEl }),
          hide(),
        ],
      }).then(({ x, y, middlewareData }) => {
        const { hide, arrow } = middlewareData;
        Object.assign(rootEl.style, {
          left: x + 'px',
          top: y + 'px',
          visibility: hide.referenceHidden ? 'hidden' : 'visible',
        });
        Object.assign(arrowEl.style, {
          left: typeof arrow.x === 'number' ? `${arrow.x}px` : '',
          top: typeof arrow.y === 'number' ? `${arrow.y}px` : '',
        });
      });
    },
  },
  render() {
    return (
      <div class="popover" vShow={this.visible} vOn:mouseup_stop={() => 0}>
        <div ref="content" class="popover-content" style={this.contentStyle}>
          {this.$slots.default}
        </div>
        <i ref="arrow" class="popover-arrow" style={this.arrowStyle} />
      </div>
    );
  },
});
