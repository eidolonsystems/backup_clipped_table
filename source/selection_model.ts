import {Dispatcher} from 'kola-signals';
import {BasicTableModel} from './basic_table_model';
import {TableModel} from './table_model';
import {TableView} from './table_view';

/** Implements a TableModel used to keep track of selected items. */
class SelectionModel extends TableModel {

  /** Constructs a SelectionModel.
   * @param view - The TableView displaying the selection.
   * @param source - The model to manage item selections for.
   */
  public constructor(view: TableView, source: TableModel) {
    super();
    this.view = view;
    this.source = source;
    this.selectionModel = new BasicTableModel(['Selected']);
    for(let i = 0; i < this.source.rowCount; ++i) {
      this.selectionModel.addRow([false]);
    }
    this.isContinuous = false;
    this.isControl = false;
    this.startRow = 0;
    this.source.connectRowAddedSignal(this.onRowAdded.bind(this));
    this.source.connectRemovingRowSignal(this.onRemovingRow.bind(this));
    this.source.connectRowMovedSignal(this.onRowMoved.bind(this));
    this.s0();
  }

  /** Handles moving the mouse over the selection region.
   * @param event - The event describing the mouse move.
   */
  public onMouseMove(event: MouseEvent): void {
    if(this.state == 1) {
      this.lastMouseEvent = event;
      return this.s2();
    } else if(this.state == 2) {
      this.lastMouseEvent = event;
      return this.s2();
    }
  }

  /** Handles pressing down a mouse button.
   * @param event - The event describing the button press.
   */
  public onMouseDown(event: MouseEvent): void {
    if(this.state == 0) {
      this.lastMouseEvent = event;
      return this.s1();
    }
  }

  /** Handles releasing a mouse button.
   * @param event - The event describing the button release.
   */
  public onMouseUp(event: MouseEvent): void {
    if(this.state == 1) {
      this.lastMouseEvent = event;
      return this.s0();
    } else if(this.state == 2) {
      this.lastMouseEvent = event;
      return this.s0();
    }
  }

  /** Handles pressing down a key.
   * @param event - The event describing the key press.
   */
  public onKeyDown(event: KeyboardEvent): void {
    if(event.key == 'Shift') {
      this.isContinuous = true;
    }
    if(event.key == 'Control') {
      this.isControl = true;
    }
  }

  /** Handles releasing a key.
   * @param event - The event describing the key release.
   */
  public onKeyUp(event: KeyboardEvent):void {
    if(event.key == 'Shift') {
      this.isContinuous = false;
    }
    if(event.key == 'Control') {
      this.isControl = false;
    }
  }

  public get rowCount(): number {
    return this.selectionModel.rowCount;
  }

  public get columnCount(): number {
    return this.selectionModel.columnCount;
  }

  public getName(column: number): string {
    return this.selectionModel.getName(column);
  }

  public getValue(row: number, column: number): any {
    return this.selectionModel.getValue(row, column);
  }

  public connectValueChangedSignal(
      slot: (update: [number, number, any]) => void): any {
    return this.selectionModel.connectValueChangedSignal(slot);
  }

  public connectRowAddedSignal(slot: (row: number) => void): any {
    return this.selectionModel.connectRowAddedSignal(slot);
  }

  public connectRemovingRowSignal(slot: (row: number) => void): any {
    return this.selectionModel.connectRemovingRowSignal(slot);
  }

  public connectRowMovedSignal(slot: (update: [number, number]) => void): any {
    return this.selectionModel.connectRowMovedSignal(slot);
  }

  private onRowAdded(row: number): void {
    this.selectionModel.addRow([false]);
  }

  private onRemovingRow(row: number): void {
    this.selectionModel.removeRow(row);
  }

  private onRowMoved(update: [number, number]): void {
    this.selectionModel.moveRow(update[0], update[1]);
  }

  private continuousSelect(row: number): void {
    if(row >= this.endRow) {
      if(this.endRow >= this.startRow) {
        for(let i = this.endRow; i <= row; ++i) {
          this.selectionModel.setValue(i, 0, true);
        }
      } else {
        for(let i = this.endRow; i < Math.min(row, this.startRow); ++i) {
          this.selectionModel.setValue(i, 0, false);
        }
        for(let i = this.startRow; i <= row; ++i) {
          this.selectionModel.setValue(i, 0, true);
        }
      }
    } else {
      if(this.endRow <= this.startRow) {
        for(let i = this.endRow; i >= row; --i) {
          this.selectionModel.setValue(i, 0, true);
        }
      } else {
        for(let i = this.endRow; i > Math.max(row, this.startRow); --i) {
          this.selectionModel.setValue(i, 0, false);
        }
        for(let i = this.startRow; i >= row; --i) {
          this.selectionModel.setValue(i, 0, true);
        }
      }
    }
    this.endRow = row;
  }

  private s0(): void {
    this.state = 0;
  }

  private s1(): void {
    this.state = 1;
    if(!this.isContinuous && !this.isControl) {
      for(let i = 0; i < this.selectionModel.rowCount; ++i) {
        if(this.selectionModel.getValue(i, 0)) {
          this.selectionModel.setValue(i, 0, false);
        }
      }
    }
    let row = this.view.getRowAt(this.lastMouseEvent.clientX,
      this.lastMouseEvent.clientY);
    if(row == -1) {
      return;
    }
    if(this.isContinuous) {
      this.continuousSelect(row);
    } else if(this.isControl) {
      if(this.selectionModel.getValue(row, 0)) {
        this.selectionModel.setValue(row, 0, false);
      } else {
        this.selectionModel.setValue(row, 0, true);
      }
      this.startRow = row;
      this.endRow = row;
    } else {
      this.startRow = row;
      this.endRow = row;
      this.selectionModel.setValue(row, 0, true);
    }
  }

  private s2(): void {
    this.state = 2;
    let row = this.view.getRowAt(this.lastMouseEvent.clientX,
      this.lastMouseEvent.clientY);
    if(row == -1) {
      return this.s1();
    }
    this.continuousSelect(row);
  }

  private view: TableView;
  private source: TableModel;
  private state: number;
  private isContinuous: boolean;
  private isControl: boolean;
  private startRow: number;
  private endRow: number;
  private lastMouseEvent: MouseEvent;
  private selectionModel: BasicTableModel;
}

export {SelectionModel};
