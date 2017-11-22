import {TableView} from './table_view';

/** Provides the functionality needed to resize a TableView's columns. */
class ColumnResizer {

  /** Constructs a ColumnResizer.
   * @param view - The TableView to resize.
   * @param columnWidths - The list of column widths to resize.
   * @param resizeCallback - The callback used to indicate a change in a
   *        column's width.
   */
  constructor(view: TableView, columnWidths: Array<number>,
      resizeCallback: () => void) {
    this.view = view;
    this.columnWidths = columnWidths;
    this.resizeCallback = resizeCallback;
    this.columnIndex = -1;
    this.s0();
  }

  /** Handles moving the mouse over the table's header region.
   * @param event - The event describing the mouse move.
   */
  public onMouseMove(event: MouseEvent): void {
    if(this.state == 0) {
      this.lastMouseEvent = event;
      this.s0();
    } else if(this.state == 1) {
      this.lastMouseEvent = event;
      this.s1();
    } else if(this.state == 3) {
      this.lastMouseEvent = event;
      this.s3();
    } else if(this.state == 4) {
      this.lastMouseEvent = event;
      this.s5();
    }
  }

  /** Handles the mouse leaving the region.
   * @param event - The event describing the mouse leaving.
   */
  public onMouseLeave(event: MouseEvent): void {
    return this.s0();
  }

  /** Handles pressing down a mouse button.
   * @param event - The event describing the button press.
   */
  public onMouseDown(event: MouseEvent): void {
    if(event.button != 0) {
      return;
    }
    if(this.state == 3) {
      this.lastMouseEvent = event;
      return this.s4();
    }
  }

  /** Handles releasing a mouse button.
   * @param event - The event describing the button release.
   */
  public onMouseUp(event: MouseEvent): void {
    if(event.button != 0) {
      return;
    }
    if(this.state == 4) {
      this.lastMouseEvent = event;
      return this.s0();
    }
  }

  private c0(): boolean {
    let column = this.view.getColumnHeaderElement(this.columnIndex);
    if(column == null) {
      return false;
    }
    let boundingBox = column.getBoundingClientRect();
    return this.lastMouseEvent.clientX >=
      boundingBox.right - ColumnResizer.RESIZE_RANGE &&
      this.lastMouseEvent.clientX <=
      boundingBox.right + ColumnResizer.RESIZE_RANGE;
  }

  private s0(): void {
    this.state = 0;
    if(this.lastMouseEvent == null) {
      return;
    }
    if(this.columnIndex != -1) {
      let column = this.view.getColumnHeaderElement(this.columnIndex);
      if(column != null) {
        column.style.cursor = 'default';
      }
      let nextColumn = this.view.getColumnHeaderElement(this.columnIndex + 1);
      if(nextColumn != null) {
        nextColumn.style.cursor = 'default';
      }
    }
    this.columnIndex = -1;
    return this.s1();
  }

  private s1(): void {
    this.state = 1;
    let index = this.view.getColumnHeaderAt(this.lastMouseEvent.clientX,
      this.lastMouseEvent.clientY);
    if(index != -1) {
      let column = this.view.getColumnHeaderElement(index);
      let boundingBox = column.getBoundingClientRect();
      if(this.lastMouseEvent.clientX >=
          boundingBox.right - ColumnResizer.RESIZE_RANGE &&
          this.lastMouseEvent.clientX <= boundingBox.right) {
        this.columnIndex = index;
      } else if(this.lastMouseEvent.clientX >= boundingBox.left &&
          this.lastMouseEvent.clientX <=
          boundingBox.left + ColumnResizer.RESIZE_RANGE) {
        this.columnIndex = index - 1;
      }
      if(this.columnIndex != -1) {
        return this.s2();
      }
    }
  }

  private s2(): void {
    this.state = 2;
    let column = this.view.getColumnHeaderElement(this.columnIndex);
    if(column != null) {
      column.style.cursor = 'col-resize';
    }
    let nextColumn = this.view.getColumnHeaderElement(this.columnIndex + 1);
    if(nextColumn != null) {
      nextColumn.style.cursor = 'col-resize';
    }
    return this.s3();
  }

  private s3(): void {
    this.state = 3;
    if(!this.c0()) {
      return this.s0();
    }
  }

  private s4(): void {
    this.state = 4;
    this.xPosition = this.lastMouseEvent.clientX;
  }

  private s5(): void {
    this.state = 5;
    let xDelta = this.lastMouseEvent.clientX - this.xPosition;
    let column = this.view.getColumnHeaderElement(this.columnIndex);
    if(column == null) {
      return;
    }
    let boundingRectangle = column.getBoundingClientRect();
    if(xDelta == 0 ||
        xDelta > 0 && this.lastMouseEvent.clientX < boundingRectangle.right ||
        xDelta < 0 && this.lastMouseEvent.clientX > boundingRectangle.right) {
      return this.s4();
    }
    if(xDelta < 0) {
      let previousWidth = this.columnWidths[this.columnIndex];
      this.columnWidths[this.columnIndex] = Math.max(
        this.columnWidths[this.columnIndex] + xDelta,
        ColumnResizer.MIN_WIDTH);
      this.columnWidths[this.columnIndex + 1] -=
        this.columnWidths[this.columnIndex] - previousWidth;
    } else {
      let previousWidth = this.columnWidths[this.columnIndex + 1];
      this.columnWidths[this.columnIndex + 1] = Math.max(
        this.columnWidths[this.columnIndex + 1] - xDelta,
        ColumnResizer.MIN_WIDTH);
      this.columnWidths[this.columnIndex] -=
        this.columnWidths[this.columnIndex + 1] - previousWidth;
    }
    this.resizeCallback();
    this.s4();
  }

  private static RESIZE_RANGE = 5;
  private static MIN_WIDTH = 30;
  private view: TableView;
  private state: number;
  private lastMouseEvent: MouseEvent;
  private xPosition: number;
  private columnIndex: number;
  private columnWidths: Array<number>;
  private resizeCallback: () => void;
}

export {ColumnResizer};
