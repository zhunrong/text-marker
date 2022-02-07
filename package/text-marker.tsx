import Vue, { PropType } from 'vue';
import TextSelection, { TextRange } from './selection';
import {Popover} from './popover';
import { CloseIcon, PlusIcon } from './icons';
import DropdownMenu from './dropdown-menu';
import './text-marker.scss';

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
    CloseIcon,
    PlusIcon,
    DropdownMenu,
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
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      popoverType: 'add',
      popoverText: '',
      dropdown: {
        visible: false,
        left: 0,
        top: 0,
      },
      range: undefined as unknown as TextRange | null,
      textSelection: undefined as unknown as TextSelection,
      popover: new Popover(),
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
      this.popover.hide();
      this.$nextTick(() => {
        const p = this.textSelection.getRangePosition(range);
        if (!p) return;
        this.dropdown.visible = false;
        this.popoverType = 'add';
        const index = this.textSelection.getRangeIndex(range);
        const reference = this.textSelection.getRangeElement(range);
        const color = this.getColor(index);
        this.popover.show({
          reference,
          color,
          render() {
            return <div>哈哈</div>;
          }
        });
        this.range = range;
      });
    },

    onRangeClick({ range }: { range: TextRange }) {
      this.popover.hide();
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
        const reference = this.textSelection.getRangeElement(range);
        const color = this.getColor(index);
        this.popover.show({
          reference,
          color,
          render() {
            return <div>哈哈</div>;
          }
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
      this.popover.hide();
    },

    /**
     * 添加标注
     */
    addMark() {
      if (!this.range) return;
      this.popover.hide();
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
      this.popover.hide();
      this.textSelection.removeRange(this.range);
      this.$emit('update:ranges', [...this.textSelection.ranges]);
      this.$emit('change', [...this.textSelection.ranges]);
      this.$emit('removeMark', { ...this.range });
    },

    getColor(index: number) {
      return COLORS[index % COLORS.length];
    },
  },
  render() {
    return (
      <div class="text-mark">
        <p ref="paragraph" class="paragraph"></p>
        {/* <popover ref="popover">
          {this.popoverType === 'add' && (
            <div class="add-mark" vOn:click={this.addMark}>
              <plus-icon />
              添加标注
            </div>
          )}
          {this.popoverType === 'remove' && (
            <div class="remove-mark">
              {this.popoverText}
              <close-icon vOn:click_native={this.removeMark} />
            </div>
          )}
        </popover> */}
        <dropdown-menu
          {...{props: this.dropdown}}
          options={this.options}
          vOn:select={this.onSelect}
        />
      </div>
    );
  },
});
