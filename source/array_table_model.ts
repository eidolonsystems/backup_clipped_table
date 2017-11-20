import {Dispatcher} from 'kola-signals';
import {RemovingRowEvent, RowAddedEvent, RowMovedEvent, TableModel,
  ValueChangedEvent} from './table_model';

/** Implements a TableModel using an 2-dimensional array. */
class ArrayTableModel extends TableModel {

  /** Creates an empty ArrayTableModel.
   * @param columnNames - A names of this model's columns.
   */
  public constructor(columnNames: Array<string>) {
    super();
    this.columnNames = columnNames.slice();
    this.values = new Array<Array<any>>();
    this.valueChangedSignal = new Dispatcher<ValueChangedEvent>();
    this.rowAddedSignal = new Dispatcher<RowAddedEvent>();
    this.removingRowSignal = new Dispatcher<RemovingRowEvent>();
    this.rowMovedSignal = new Dispatcher<RowMovedEvent>();
  }

  /** Sets a value at a specified row and column.
   * @param row - The row to set.
   * @param column - The column to set.
   * @param value - The value to set at the specified row and column.
   * @throws RangeError - The row or column is not within this table's range.
   */
  public setValue(row: number, column: number, value: any): void {
    if(row < 0 || row >= this.rowCount || column < 0 ||
        column >= this.columnCount) {
      throw new RangeError();
    }
    let previousValue = this.values[row][column];
    if(previousValue === value) {
      return;
    }
    this.values[row][column] = value;
    this.valueChangedSignal.dispatch(
      new ValueChangedEvent(row, column, previousValue));
  }

  /** Adds a row to the table.
   * @param row - The row to add.
   * @param index - The index to add the row to.
   * @throws RangeError - The length of the row being added is not exactly equal
   *                      to this table's columnCount.
   * @throws RangeError - The index specified is not within range.
   */
  public addRow(row: Array<any>, index?: number): void {
    if(row.length != this.columnCount) {
      throw new RangeError();
    }
    if(!index) {
      index = this.values.length;
    }
    if(index > this.values.length || index < 0) {
      throw new RangeError();
    }
    this.values.splice(index, 0, row.slice());
    this.rowAddedSignal.dispatch(new RowAddedEvent(index));
  }

  /** Removes a row from the table.
   * @param index - The index of the row to remove.
   * @throws RangeError - The index is not within this table's range.
   */
  public removeRow(index: number): void {
    if(index < 0 || index >= this.values.length) {
      throw new RangeError();
    }
    this.removingRowSignal.dispatch(new RemovingRowEvent(index));
    this.values.splice(index, 1);
  }

  /** Moves a row.
   * @param source - The index of the row to move.
   * @param destination - The index to move the row to.
   * @throws RangeError - The source or destination are not within this table's
   *                      range.
   */
  public moveRow(source: number, destination: number): void {
    if(source < 0 || source >= this.rowCount || destination < 0 ||
        destination >= this.rowCount) {
      throw new RangeError();
    }
    if(source == destination) {
      return;
    }
    let sourceRow = this.values[source];
    this.values.splice(source, 1);
    if(destination > source) {
      this.values.splice(destination - 1, 0, sourceRow);
    } else {
      this.values.splice(destination, 0, sourceRow);
    }
    this.rowMovedSignal.dispatch(new RowMovedEvent(source, destination));
  }

  public get rowCount(): number {
    return this.values.length;
  }

  public get columnCount(): number {
    return this.columnNames.length;
  }

  public getName(column: number): string {
    return this.columnNames[column];
  }

  public getValue(row: number, column: number): any {
    return this.values[row][column];
  }

  public connectValueChangedSignal(
      slot: (event: ValueChangedEvent) => void): any {
    return this.valueChangedSignal.listen(slot);
  }

  public connectRowAddedSignal(slot: (event: RowAddedEvent) => void): any {
    return this.rowAddedSignal.listen(slot);
  }

  public connectRemovingRowSignal(
      slot: (event: RemovingRowEvent) => void): any {
    return this.removingRowSignal.listen(slot);
  }

  public connectRowMovedSignal(slot: (event: RowMovedEvent) => void): any {
    return this.rowMovedSignal.listen(slot);
  }

  private columnNames: Array<string>;
  private values: Array<Array<any>>;
  private valueChangedSignal: Dispatcher<ValueChangedEvent>;
  private rowAddedSignal: Dispatcher<RowAddedEvent>;
  private removingRowSignal: Dispatcher<RemovingRowEvent>;
  private rowMovedSignal: Dispatcher<RowMovedEvent>;
}

export {ArrayTableModel};
