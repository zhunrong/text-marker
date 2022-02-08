import Vue, { VNode, CreateElement } from 'vue';
import {
  computePosition,
  getScrollParents,
  hide,
  inline,
  shift,
  offset,
  arrow,
  flip,
} from '@floating-ui/dom';

type Options = {
  reference: Element;
  render?: (createElement: CreateElement) => VNode;
};

export class PopoverBase<T extends Options = Options> {
  protected wrapper = document.createElement('div');
  protected parents: ReturnType<typeof getScrollParents> = [];
  protected vm: Vue = null;
  protected options: T;

  constructor() {
    this.wrapper.onmouseup = (e) => e.stopPropagation();
    Object.assign(this.wrapper.style, {
      position: 'absolute',
      boxShadow: '0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12)'
    });
  }

  protected createVM() {
    return new Vue({
      render: this.options.render,
    });
  }

  protected observeParents() {
    const { reference } = this.options;
    this.parents = [
      ...getScrollParents(reference),
      ...getScrollParents(this.wrapper),
    ];
    this.parents.forEach((el) => {
      el.addEventListener('scroll', this.updatePosition);
      el.addEventListener('resize', this.updatePosition);
    });
  }

  protected unobserveParents() {
    while (this.parents.length) {
      const el = this.parents.pop();
      el.removeEventListener('scroll', this.updatePosition);
      el.removeEventListener('resize', this.updatePosition);
    }
  }

  protected applyOptions(options: T) {
    this.options = options;
  }

  show(options: T) {
    if (this.vm) {
      this.hide();
    }
    this.applyOptions(options);
    this.vm = this.createVM();
    const vmRoot = document.createElement('div');
    this.wrapper.appendChild(vmRoot);
    document.body.appendChild(this.wrapper);
    this.vm.$mount(vmRoot);
    this.observeParents();
    this.updatePosition();
  }

  hide() {
    if (!this.vm) return;
    this.unobserveParents();
    this.vm.$destroy();
    document.body.removeChild(this.wrapper);
    this.wrapper.removeChild(this.vm.$el);
    this.vm = null;
  }

  protected updatePosition = ()=> {
    const { reference } = this.options;
    computePosition(reference, this.wrapper, {
      placement: 'bottom-start',
      middleware: [inline(), flip(), hide()],
    }).then(({ x, y, middlewareData }) => {
      const { hide } = middlewareData;
      Object.assign(this.wrapper.style, {
        left: x + 'px',
        top: y + 'px',
        visibility: hide.referenceHidden ? 'hidden' : 'visible',
      });
    });
  };
}

type PopoverOptions = Options & {color: string};

export class Popover extends PopoverBase<PopoverOptions> {
  protected popoverArrow = document.createElement('i');
  protected options: PopoverOptions = {
    reference: null,
    render: null,
    color: '#fff',
  };

  constructor() {
    super();
    this.wrapper.appendChild(this.popoverArrow);
    Object.assign(this.popoverArrow.style, {
      position: 'absolute',
      display: 'block',
      borderTop: '4px solid #607ae3',
      borderLeft: '4px solid transparent',
      borderRight: '4px solid transparent',
      bottom: '-4px'
    });
  }

  protected applyOptions(options: PopoverOptions): void {
      this.options = options;
      this.popoverArrow.style.borderTopColor = options.color;
  }

  protected updatePosition = () => {
    const { reference } = this.options;
    computePosition(reference, this.wrapper, {
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
      Object.assign(this.wrapper.style, {
        left: x + 'px',
        top: y + 'px',
        visibility: hide.referenceHidden ? 'hidden' : 'visible',
      });
      Object.assign(this.popoverArrow.style, {
        left: typeof arrow.x === 'number' ? `${arrow.x}px` : '',
        top: typeof arrow.y === 'number' ? `${arrow.y}px` : '',
      });
    });
  };
}
