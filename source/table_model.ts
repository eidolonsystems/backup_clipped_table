import {Dispatcher} from 'kola-signals';

/** Indicates that the value in a TableModel changed. */
class ValueChangedEvent {

  /** Constructs a ValueChangedEvent.
   * @param row - The changed value's row.
   * @param column - The changed value's column.
   * @param previousValue - The value before the change was made.
   */
  constructor(row: number, column: number, previousValue: any) {
    this._row = row;
    this._column = column;
    this._previousValue = previousValue;
  }

  /** Returns the changed value's row. */
  public get row(): number {
    return this._row;
  }

  /** Returns the changed value's column. */
  public get column(): number {
    return this._column;
  }

  /** Returns the value stored before the change. */
  public get previousValue(): any {
    return this._previousValue;
  }

  private _row: number;
  private _column: number;
  private _previousValue: number;
};

/** Indicates that a row was added to a TableModel. */
class RowAddedEvent {

  /** Constructs a RowAddedEvent.
   * @param index - The index of the row that was added.
   */
  constructor(index: number) {
    this._index = index;
  }

  /** Returns the index of the row that was added. */
  public get index(): number {
    return this._index;
  }

  private _index: number;
};

/** Indicates that a row is about to be removed. */
class RemovingRowEvent {

  /** Constructs a RemovingRowEvent.
   * @param index - The index of the row that is about to be removed.
   */
  constructor(index: number) {
    this._index = index;
  }

  /** Returns the index of the row that is about to be removed. */
  public get index(): number {
    return this._index;
  }

  private _index: number;
};

/** Indicates that a row has been moved. */
class RowMovedEvent {

  /** Constructs a RowMovedEvent.
   * @param source - The index of the row that was moved.
   * @param destination - The index that the row was moved to.
   */
  constructor(source: number, destination: number) {
    this._source = source;
    this._destination = destination;
  }

  /** Returns the index of the row that was moved. */
  public get source(): number {
    return this._source;
  }

  /** Returns the index that the row was moved to. */
  public get destination(): number {
    return this._destination;
  }

  private _source: number;
  private _destination: number;
};

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
   * @param slot - A slot receiving the ValueChangedEvent.
   * @return The connection between the signal and the slot.
   */
  public abstract connectValueChangedSignal(
    slot: (event: ValueChangedEvent) => void): any;

  /** Connects a slot to the signal indicating that a row has been added.
   * @param slot - A slot receiving the RowAddedEvent.
   * @return The connection between the signal and the slot.
   */
  public abstract connectRowAddedSignal(
    slot: (event: RowAddedEvent) => void): any;

  /** Connects a slot to the signal indicating that a row is about to be
   *  removed.
   * @param slot - A slot receiving the RemovingRowEvent.
   * @return The connection between the signal and the slot.
   */
  public abstract connectRemovingRowSignal(
    slot: (event: RemovingRowEvent) => void): any;

  /** Connects a slot to the signal indicating that a row was moved.
   * @param slot - A slot receiving the RowMovedEvent.
   * @return The connection between the signal and the slot.
   */
  public abstract connectRowMovedSignal(
    slot: (event: RowMovedEvent) => void): any;
}

export {ValueChangedEvent, RowAddedEvent, RemovingRowEvent, RowMovedEvent,
  TableModel};
