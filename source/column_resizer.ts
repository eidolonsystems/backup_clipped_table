enum State {
  NONE,
  HOVER,
  CLICKED,
}

class ColumnResizer {
  constructor(columnWidths: Array<number>, resizeCallback: () => void) {
    this.state = State.NONE;
    this.xPosition = -1;
    this.element = null;
    this.index = -1;
    this.columnWidths = columnWidths;
    this.resizeCallback = resizeCallback;
  }

  public onMouseMove(event: MouseEvent): void {
    if(this.state == State.NONE) {
      this.handleNone(event);
    } else if(this.state == State.HOVER) {
      this.handleHover(event);
    } else if(this.state == State.CLICKED) {
      this.handleClicked(event);
    }
  }

  private isInsideResizeRange(event: MouseEvent,
      element: HTMLElement): boolean {
    let elementLeft = element.getBoundingClientRect().left;
    let elementRight = element.getBoundingClientRect().right;
    return event.clientX >= elementLeft &&
      event.clientX <= elementLeft + ColumnResizer.RESIZE_RANGE ||
      event.clientX >= elementRight - ColumnResizer.RESIZE_RANGE &&
      event.clientX <= elementRight + ColumnResizer.RESIZE_RANGE;
  }

  private handleNone(event: MouseEvent): void {
    this.state = State.NONE;
    let element = document.elementFromPoint(event.clientX, event.clientY) as
      HTMLElement;
    let elementLeft = element.getBoundingClientRect().left;
    let elementRight = element.getBoundingClientRect().right;
    if(this.isInsideResizeRange(event, element)) {
      element.style.cursor = 'ew-resize';
      this.element = element;
      let xPosition = event.clientX - 2 * ColumnResizer.RESIZE_RANGE - 1;
      let i = 0;
      for(i = 0; i < this.columnWidths.length && xPosition > 0; ++i) {
        xPosition -= this.columnWidths[i];
      }
      this.index = i - 1;
      return this.handleHover(event);
    }
  }

  private handleHover(event: MouseEvent): void {
    this.state = State.HOVER;
    let elementLeft = this.element.getBoundingClientRect().left;
    let elementRight = this.element.getBoundingClientRect().right;
    if(!this.isInsideResizeRange(event, this.element)) {
      this.element.style.cursor = 'default';
      this.element = null;
      return this.handleNone(event);
    } else if(event.buttons & 1) {
      this.xPosition = event.clientX;
      return this.handleClicked(event);
    }
  }

  private handleClicked(event: MouseEvent): void {
    this.state = State.CLICKED;
    if(!(event.buttons & 1)) {
      return this.handleHover(event);
    }
    let xDelta = event.clientX - this.xPosition;
    this.xPosition = event.clientX;
    let boundingRectangle = this.element.getBoundingClientRect();
    if(xDelta == 0 ||
        xDelta > 0 && event.clientX < boundingRectangle.left ||
        xDelta < 0 && event.clientX > boundingRectangle.right) {
      return;
    }
    if(xDelta < 0) {
      let previousWidth = this.columnWidths[this.index];
      this.columnWidths[this.index] = Math.max(
        this.columnWidths[this.index] + xDelta,
        ColumnResizer.MIN_WIDTH);
      this.columnWidths[this.index + 1] -=
        this.columnWidths[this.index] - previousWidth;
    } else {
      let previousWidth = this.columnWidths[this.index + 1];
      this.columnWidths[this.index + 1] = Math.max(
        this.columnWidths[this.index + 1] - xDelta,
        ColumnResizer.MIN_WIDTH);
      this.columnWidths[this.index] -=
        this.columnWidths[this.index + 1] - previousWidth;
    }
    this.resizeCallback();
  }

  private static RESIZE_RANGE = 5;
  private static MIN_WIDTH = 10;
  private state: number;
  private xPosition: number;
  private element: HTMLElement;
  private index: number;
  private columnWidths: Array<number>;
  private resizeCallback: () => void;
}

export {ColumnResizer};
