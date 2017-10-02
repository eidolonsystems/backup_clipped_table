import {Dispatcher} from 'kola-signals';

/** Base class representing a table based data model. */
abstract class TableModel {

  /** Returns the number of rows in the model.
   * @return The number of rows in the model.
   */
  public abstract get rowCount(): number;

  /** Returns the number of columns in the model.
   * @return The number of columns in the model.
   */
  public abstract get columnCount(): number;

    /** Returns the name of a column.
   * @param column - The index of the column.
   * @return The name of the specified column.
   * @throws {RangeError} If the column is outside of the table's bounds.
   */
  public abstract getName(column: number): string;

  /** Returns the value at a specified index within the table.
   * @param row - The value's row.
   * @param column - The value's column.
   * @return The value at the specified row and column.
   * @throws {RangeError} If the row or column are outside of the table's
   *                      bounds.
   */
  public abstract getValue(row: number, column: number): any;

  /** Connects a slot to the signal indicating that a value in the table
   *  changed.
   * @param slot - A slot receiving the triple [row, column, previousValue].
   * @return The connection between the signal and the slot.
   */
  public abstract connectValueChangedSignal(
    slot: (update: [number, number, any]) => void): any;

  /** Connects a slot to the signal indicating that a row has been added.
   * @param slot - A slot receiving the index of the added row.
   * @return The connection between the signal and the slot.
   */
  public abstract connectRowAddedSignal(slot: (row: number) => void): any;

  /** Connects a slot to the signal indicating that a row is about to be
   *  removed.
   * @param slot - A slot receiving the index of the row that will be removed.
   * @return The connection between the signal and the slot.
   */
  public abstract connectRemovingRowSignal(slot: (row: number) => void): any;

  /** Connects a slot to the signal indicating that a row was moved.
   * @param slot - A slot receiving the index that the row was moved from and
   *               the index that the row was moved to.
   * @return The connection between the signal and the slot.
   */
  public abstract connectRowMovedSignal(
    slot: (update: [number, number]) => void): any;
}

export {TableModel};
