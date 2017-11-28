import {Dispatcher} from 'kola-signals';
import {ProxyTableModel} from './proxy_table_model';
import {RemovingRowEvent, RowAddedEvent, RowMovedEvent, TableModel,
  ValueChangedEvent} from './table_model';

/** Base class used for polymorphically comparing two values in a TableModel. */
class Comparator {

  /** Compares the order of two values.
   * @param left - The left side of the comparison.
   * @param right - The right side of the comparison.
   * @return A negative number iff left comes before right.
   *         A positive number iff left comes after right.
   *         0 iff left is equal to right.
   * @throws {TypeError} - The parameters can not be compared to one another.
   */
  public compareValues(left: any, right: any): number {
    if(typeof(left) === 'number') {
      return (left as number) - (right as number);
    } else if(typeof(left) === 'string') {
      return (left as string).localeCompare(right as string);
    }
    throw TypeError('Comparison not supported.');
  }

  /** Compares the order of two values in a TableModel.
   * @param model - The model to lookup.
   * @param leftRow - The row of the left hand side of the comparison.
   * @param leftColumn - The column of the left hand side of the comparison.
   * @param rightRow - The row of the right hand side of the comparison.
   * @param rightColumn - The column of the right hand side of the comparison.
   * @return A negative number iff the left hand side comes before right.
   *         A positive number iff the left hand side comes after right.
   *         0 iff the left hand side is equal to the right hand side.
   * @throws {TypeError} - The parameters can not be compared to one another.
   */
  public compareCells(model: TableModel, leftRow: number, leftColumn: number,
      rightRow: number, rightColumn: number): number {
    return this.compareValues(model.getValue(leftRow, leftColumn),
      model.getValue(rightRow, rightColumn));
  }
}

/** Specifies whether to sort in ascending order or descending order. */
enum SortOrder {
  ASCENDING,
  DESCENDING
}

/** Specifies a column's sort order. */
class ColumnOrder {

  /** Constructs a ColumnOrder.
   * @param index - The column.
   * @param sortOrder - Whether the column is ordered in ascending or descending
   *        order.
   */
  constructor(index: number, sortOrder: SortOrder = SortOrder.ASCENDING) {
    this._index = index;
    this._sortOrder = sortOrder;
  }

  /** Returns the column's index. */
  public get index(): number {
    return this._index;
  }

  /** Returns the column's sort order. */
  public get sortOrder(): SortOrder {
    return this._sortOrder;
  }

  /** Returns the column's sort order direction. */
  public get direction(): number {
    if(this.sortOrder == SortOrder.ASCENDING) {
      return 1;
    }
    return -1;
  }

  private _index: number;
  private _sortOrder: SortOrder;
}

/** Implements a TableModel that maintains its rows in sorted order.
 *  A Comparator is used to test the order of individual values and a column
 *  sort order is used to break ties between two values with the same ordering.
 *  Any column not explicitly specified in the column sort order will be
 *  sorted in an indeterminant manner.
 */
class SortedTableModel extends TableModel {

  /** Constructs a SortedTableModel.
   * @param source - The underlying model to sort.
   * @param comparator - The comparator used.
   * @param columnOrder - The column sort order.
   */
  public constructor(source: TableModel, comparator?: Comparator,
      columnOrder?: Array<ColumnOrder>) {
    super();
    this.translatedModel = new ProxyTableModel(source);
    if(comparator === undefined) {
      this.comparator = new Comparator();
    } else {
      this.comparator = comparator;
    }
    if(columnOrder === undefined) {
      this.setColumnOrder([]);
    } else {
      this.setColumnOrder(columnOrder);
    }
    this.translatedModel.connectValueChangedSignal(
      this.onValueChanged.bind(this));
    this.translatedModel.connectRowAddedSignal(this.onRowAdded.bind(this));
  }

  /** Sets the order that the columns are sorted by.
   * @param columnOrder - The list of columns in their sort order.
   */
  public setColumnOrder(columnOrder: Array<ColumnOrder>): void {
    for(let i = 0; i != columnOrder.length; ++i) {
      for(let j = 0; j != i; ++j) {
        if(columnOrder[j].index == columnOrder[i].index) {
          throw Error('Duplicate columns provided.');
        }
      }
      if(columnOrder[i].index < 0 || columnOrder[i].index >= this.columnCount) {
        throw RangeError('Column out of range.');
      }
    }
    this.columnOrder = columnOrder.slice();
    for(let i = 0; i != this.columnCount; ++i) {
      let hasColumn = false;
      for(let j = 0; j != this.columnOrder.length; ++j) {
        if(this.columnOrder[j].index == i) {
          hasColumn = true;
          break;
        }
      }
      if(!hasColumn) {
        this.columnOrder.push(new ColumnOrder(i));
      }
    }
    for(let i = 0; i < this.rowCount; ++i) {
      let index = this.findInsertionIndex(0, i, i);
      this.translatedModel.moveRow(i, index);
    }
  }

  public get rowCount(): number {
    return this.translatedModel.rowCount;
  }

  public get columnCount(): number {
    return this.translatedModel.columnCount;
  }

  public getName(column: number): string {
    return this.translatedModel.getName(column);
  }

  public getValue(row: number, column: number): any {
    return this.translatedModel.getValue(row, column);
  }

  public connectValueChangedSignal(
      slot: (event: ValueChangedEvent) => void): any {
    return this.translatedModel.connectValueChangedSignal(slot);
  }

  public connectRowAddedSignal(slot: (event: RowAddedEvent) => void): any {
    return this.translatedModel.connectRowAddedSignal(slot);
  }

  public connectRemovingRowSignal(
      slot: (event: RemovingRowEvent) => void): any {
    return this.translatedModel.connectRemovingRowSignal(slot);
  }

  public connectRowMovedSignal(slot: (event: RowMovedEvent) => void): any {
    return this.translatedModel.connectRowMovedSignal(slot);
  }

  private compareRows(leftRow: number, rightRow: number): number {
    for(let column of this.columnOrder) {
      let order = column.direction * this.comparator.compareCells(
        this.translatedModel, leftRow, column.index, rightRow, column.index);
      if(order != 0) {
        return order;
      }
    }
    return 0;
  }

  private findInsertionIndex(lower: number, upper: number,
      row: number): number {
    if(lower >= upper) {
      return Math.max(0, upper);
    }
    let midPoint = Math.floor((upper - lower) / 2) + lower;
    let order = this.compareRows(row, midPoint);
    if(order < 0) {
      return this.findInsertionIndex(lower, midPoint, row);
    } else if(order > 0) {
      return this.findInsertionIndex(midPoint + 1, upper, row);
    }
    return midPoint;
  }

  private reorderBisection(row: number): void {
    let preIndex = this.findInsertionIndex(0, row, row);
    if(preIndex < row) {
      this.translatedModel.moveRow(row, preIndex);
      return;
    }
    let postIndex = this.findInsertionIndex(row + 1, this.rowCount, row);
    if(postIndex == this.rowCount) {
      this.translatedModel.moveRow(row, this.rowCount - 1);
      return;
    } else if(postIndex > row + 1) {
      this.translatedModel.moveRow(row, postIndex);
      return;
    }
    let order = this.compareRows(row, row + 1);
    if(order == 1) {
      this.translatedModel.moveRow(row, row + 1);
    }
  }

  private onValueChanged(event: ValueChangedEvent): void {
    this.reorderBisection(event.row);
  }

  private onRowAdded(event: RowAddedEvent): void {
    this.reorderBisection(event.index);
  }

  private translatedModel: ProxyTableModel;
  private columnOrder: Array<ColumnOrder>;
  private comparator: Comparator;
}

export {Comparator, SortOrder, ColumnOrder, SortedTableModel};
