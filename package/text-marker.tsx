import Vue, { PropType } from 'vue';
import TextSelection, { TextRange } from './selection';
import { Popover, PopoverBase } from './popover';
import { CloseIcon, PlusIcon } from './icons';
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
      range: undefined as unknown as TextRange | null,
      textSelection: undefined as unknown as TextSelection,
      popover: undefined as unknown as Popover,
      dropdown: undefined as unknown as PopoverBase,
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
    this.textSelection.on('range:insert', this.onRangeInsert);
    this.textSelection.on('range:click', this.onRangeClick);
    this.popover = new Popover();
    this.dropdown = new PopoverBase();
    document.addEventListener('mouseup', this.onDocClick);
  },
  beforeDestroy() {
    if (this.textSelection) {
      this.textSelection.destroy();
      this.popover.destroy();
      this.dropdown.destroy();
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
        this.dropdown.hide();
        this.popoverType = 'add';
        const index = this.textSelection.getRangeIndex(range);
        const reference = this.textSelection.getRangeElement(range);
        const color = this.getColor(index);
        this.popover.show({
          reference,
          color,
          render: () => {
            return (
              <div class="text-marker__popover" style={{ background: color }}>
                <div class="add-mark" vOn:click={this.addMark}>
                  <plus-icon />
                  添加标注
                </div>
              </div>
            );
          },
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
          render: () => {
            return (
              <div class="text-marker__popover" style={{ background: color }}>
                <div class="remove-mark">
                  {this.popoverText}
                  <close-icon vOn:click_native={this.removeMark} />
                </div>
              </div>
            );
          },
        });
      });
    },

    onSelect(value: string) {
      if (!this.range) return;
      this.dropdown.hide();
      this.range.data = value;
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
      this.dropdown.hide();
      this.popover.hide();
    },

    /**
     * 添加标注
     */
    addMark() {
      if (!this.range) return;
      this.popover.hide();
      this.dropdown.show({
        reference: this.textSelection.getRangeElement(this.range),
        render: () => {
          return (
            <div class="text-marker__dropdown">
              <ul>
                {this.options.length ? (
                  this.options.map((item) => (
                    <li
                      class="menu-item"
                      key={item.value}
                      title={item.label}
                      vOn:click={() => this.onSelect(item.value)}
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
      <div class="text-marker">
        <p ref="paragraph" class="paragraph"></p>
      </div>
    );
  },
});
