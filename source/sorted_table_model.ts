import {Dispatcher} from 'kola-signals';
import {Comparator} from './comparator';
import {ProxyTableModel} from './proxy_table_model';
import {RemovingRowEvent, RowAddedEvent, RowMovedEvent, TableModel,
  ValueChangedEvent} from './table_model';

/** Implements a TableModel that maintains its rows in sorted order. */
class SortedTableModel extends TableModel {

  /** Constructs a SortedTableModel.
   * @param source - The underlying model to sort.
   * @param columnOrder - The column sort order.
   * @param comparator - The comparator used.
   */
  public constructor(source: TableModel, columnOrder: Array<number>,
      comparator?: Comparator) {
    super();
    this.translatedModel = new ProxyTableModel(source);
    this.columnOrder = columnOrder.slice();
    if(comparator === undefined) {
      this.comparator = new Comparator();
    } else {
      this.comparator = comparator;
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

  private translatedModel: ProxyTableModel;
  private columnOrder: Array<number>;
  private comparator: Comparator;
}

export {ProxyTableModel};
