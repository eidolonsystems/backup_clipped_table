import {Dispatcher} from 'kola-signals';
import {TableModel} from './table_model';

/** Implements a TableModel programmatically. */
class BasicTableModel extends TableModel {

  /** Creates an empty BasicTableModel. */
  public constructor(columnNames: Array<string>) {
    super();
    this.columnNames = columnNames.slice();
    this.values = new Array<Array<any>>();
    this.valueChangedSignal = new Dispatcher<[number, number, any]>();
    this.rowAddedSignal = new Dispatcher<number>();
    this.removingRowSignal = new Dispatcher<number>();
    this.rowMovedSignal = new Dispatcher<[number, number]>();
  }

  /** Sets a value
   * @param row - The value's row.
   * @param column - The value's column.
   * @param value - The value to set.
   * @throws RangeError - The row or column is not within this table's range.
   */
  public setValue(row: number, column: number, value: any): void {
    if(row < 0 || row >= this.rowCount || column < 0 ||
        column >= this.columnCount) {
      throw new RangeError();
    }
    let previousValue = this.values[row][column];
    this.values[row][column] = value;
    this.valueChangedSignal.dispatch([row, column, previousValue]);
  }

  /** Adds a row to the table.
   * @param row - The row to add.
   * @param index - The index to add the row to.
   */
  public addRow(row: Array<any>, index: number = -1): void {
    if(index >= this.values.length || index < 0) {
      let index = this.values.push(row.slice());
      this.rowAddedSignal.dispatch(index);
    } else {
      this.values.splice(index, 0, row.slice());
      this.rowAddedSignal.dispatch(index);
    }
  }

  /** Removes a row from the table.
   * @param index - The index of the row to remove.
   * @throws RangeError - The index is not within this table's range.
   */
  public removeRow(index: number): void {
    if(index >= 0 && index < this.values.length) {
      this.removingRowSignal.dispatch(index);
      this.values.splice(index, 1);
    } else {
      throw new RangeError();
    }
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
    this.values.splice(destination, 0, sourceRow);
    this.values.splice(source, 1);
    this.rowMovedSignal.dispatch([source, destination]);
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
      slot: (update: [number, number, any]) => void): any {
    return this.valueChangedSignal.listen(slot);
  }

  public connectRowAddedSignal(slot: (row: number) => void): any {
    return this.rowAddedSignal.listen(slot);
  }

  public connectRemovingRowSignal(slot: (row: number) => void): any {
    return this.removingRowSignal.listen(slot);
  }

  public connectRowMovedSignal(
      slot: (update: [number, number]) => void): any {
    return this.rowMovedSignal.listen(slot);
  }

  private columnNames: Array<string>;
  private values: Array<Array<any>>;
  private valueChangedSignal: Dispatcher<[number, number, any]>;
  private rowAddedSignal: Dispatcher<number>;
  private removingRowSignal: Dispatcher<number>;
  private rowMovedSignal: Dispatcher<[number, number]>;
}

export {BasicTableModel};
