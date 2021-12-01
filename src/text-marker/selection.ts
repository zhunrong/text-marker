import EventEmitter from "./eventEmitter";

function isSpan(node: any): node is HTMLSpanElement {
  return node && node.nodeType === 1 && node.nodeName === "SPAN";
}

function isEqual(a: TextRange[], b: TextRange[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const t1 = a[i];
    const t2 = b[i];
    if (t1 === t2) continue;
    const k1 = Object.keys(t1) as (keyof TextRange)[];
    const k2 = Object.keys(t2) as (keyof TextRange)[];
    if (k1.length !== k2.length) return false;
    for (let j = 0; j < k1.length; j++) {
      const key = k1[j];
      if (t1[key] !== t2[key]) return false;
    }
  }
  return true;
}

export interface TextRange {
  /**
   * 文本开始位置
   */
  start: number;
  /**
   * 文本结束位置
   */
  end: number;
  /**
   * 文本片段
   */
  text: string;
  data: string;
}

export interface Position {
  left: number;
  top: number;
  width: number;
  height: number;
}

class TextSelection extends EventEmitter {
  ranges: TextRange[] = [];
  rawText = "";

  constructor(public container: HTMLElement) {
    super();
    this.container.addEventListener("mouseup", this.onMouseUp);
    this.container.addEventListener("click", this.onClick);
  }

  init(rawText: string, ranges: TextRange[] = []) {
    if (isEqual(this.ranges, ranges) && rawText === this.rawText) return;
    this.rawText = rawText;
    this.ranges = ranges.map(({ start, end, data }) => {
      if (typeof start !== "number" || typeof end !== "number") {
        throw new Error("start、end字段必须是数字");
      }
      return {
        start,
        end,
        data,
        text: rawText.slice(start, end),
      };
    });
    this.emit("ranges:update", this.ranges);
    this.renderHTML();
  }

  /**
   * 根据起始位置插入range
   */
  insertRange(start: number, end: number) {
    let i = this.ranges.length;
    while (i > 0) {
      i--;
      const range = this.ranges[i];
      if (range.end <= start) {
        i++;
        break;
      }
    }
    this.ranges.splice(i, 0, {
      start,
      end,
      text: this.rawText.slice(start, end),
      data: "",
    });
    this.emit("ranges:update", this.ranges);
    this.renderHTML();
    return i;
  }

  getRangeIndex(range: TextRange): number {
    return this.ranges.findIndex((item) => item === range);
  }

  removeRange(range: TextRange): number;
  removeRange(index: number): TextRange;
  removeRange(param: TextRange | number) {
    if (typeof param === "number") {
      const result = this.ranges.splice(param, 1)[0];
      this.emit("ranges:update", this.ranges);
      if (result) {
        this.renderHTML();
      }
      return result;
    }
    const index = this.getRangeIndex(param);
    if (index > -1) {
      this.ranges.splice(index, 1);
      this.emit("ranges:update", this.ranges);
      this.renderHTML();
    }
    return index;
  }

  renderHTML() {
    let offset = 0;
    let html = "";
    this.ranges.forEach((range, index) => {
      html += this.rawText.slice(offset, range.start);
      /* eslint-disable */
      html += `<span class="default"
                     data-data="${range.data}"
                     data-index="${index}"
                     data-start="${range.start}" 
                     data-end="${range.end}">${this.rawText.slice(
        range.start,
        range.end
      )}</span>`;
      /* eslint-enable */
      offset = range.end;
    });
    html += this.rawText.slice(offset);
    this.container.innerHTML = html;
  }

  onMouseUp = (e: MouseEvent) => {
    const selection = window.getSelection();
    if (!selection) return;
    const range = selection.getRangeAt(0);
    const { startContainer, endContainer } = range;
    let { startOffset, endOffset } = range;
    if (startOffset === endOffset) return;
    if (startContainer !== endContainer) return;
    if (startContainer.parentNode !== this.container) return;
    const prevNode = startContainer.previousSibling;
    if (prevNode && isSpan(prevNode)) {
      const prevNodeEnd = Number(prevNode.getAttribute("data-end"));
      startOffset += prevNodeEnd;
      endOffset += prevNodeEnd;
    }
    const insertIndex = this.insertRange(startOffset, endOffset);
    setTimeout(() => {
      const range = this.ranges[insertIndex];
      this.emit("range:insert", {
        index: insertIndex,
        range,
      });
    });
    e.stopPropagation();
  };

  onClick = (e: MouseEvent) => {
    if (e.target && isSpan(e.target)) {
      e.stopPropagation();
      const spanEl = e.target;
      const index = Number(spanEl.getAttribute("data-index"));
      const range = this.ranges[index];
      this.emit("range:click", {
        index,
        range,
      });
    }
  };

  /**
   * 根据range索引获取边界盒
   */
  getRangeBBox(range: TextRange): DOMRect | null;
  getRangeBBox(index: number): DOMRect | null;
  getRangeBBox(param: any) {
    let index = -1;
    if (typeof param === "number") {
      index = param;
    } else {
      index = this.getRangeIndex(param);
    }
    const selector = `span[data-index='${index}']`;
    const spanEl = this.container.querySelector(selector);
    if (!spanEl) {
      console.warn(`不存在：${selector}`);
      return null;
    }
    return spanEl.getBoundingClientRect();
  }

  /**
   * 获取容器边界盒
   * @returns
   */
  getBBox() {
    return this.container.getBoundingClientRect();
  }

  /**
   * 获取range相对于容器的位置
   * @param range
   */
  getRangePosition(range: TextRange): Position | null;
  getRangePosition(index: number): Position | null;
  getRangePosition(param: any) {
    const rangeBbox = this.getRangeBBox(param);
    if (!rangeBbox) return null;
    const bbox = this.getBBox();
    return {
      left: rangeBbox.left - bbox.left,
      top: rangeBbox.top - bbox.top,
      width: rangeBbox.width,
      height: rangeBbox.height,
    };
  }

  getRangeElement(range: TextRange) {
    const index = this.getRangeIndex(range);
    const selector = `span[data-index='${index}']`;
    const spanEl = this.container.querySelector(selector);
    if (!spanEl) {
      console.warn(`不存在：${selector}`);
      return null;
    }
    return spanEl;
  }

  /**
   * 销毁
   */
  destroy() {
    this.container.removeEventListener("mouseup", this.onMouseUp);
    this.container.removeEventListener("click", this.onClick);
    this.clear();
  }
}

export default TextSelection;
