import {Dispatcher} from 'kola-signals';
import {RemovingRowEvent, RowAddedEvent, RowMovedEvent, TableModel,
  ValueChangedEvent} from './table_model';

/** Implements a TableModel that rearranges the contents of some underlying
 *  model. */
class ProxyTableModel extends TableModel {

  /** Constructs a ProxyTableModel.
   * @param source - The underlying model to proxy.
   */
  public constructor(source: TableModel) {
    super();
    this.source = source;
    this.rowToSource = new Array<number>();
    for(let i = 0; i < this.source.rowCount; ++i) {
      this.rowToSource.push(i);
    }
    this.valueChangedSignal = new Dispatcher<ValueChangedEvent>();
    this.rowAddedSignal = new Dispatcher<RowAddedEvent>();
    this.removingRowSignal = new Dispatcher<RemovingRowEvent>();
    this.rowMovedSignal = new Dispatcher<RowMovedEvent>();
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
    this.rowToSource.splice(source, 1);
    if(destination > source) {
      this.rowToSource.splice(destination - 1, 1, source);
    } else {
      this.rowToSource.splice(destination, 1, source);
    }
    this.rowMovedSignal.dispatch(new RowMovedEvent(source, destination));
  }

  public get rowCount(): number {
    return this.source.rowCount;
  }

  public get columnCount(): number {
    return this.source.columnCount;
  }

  public getName(column: number): string {
    return this.source.getName(column);
  }

  public getValue(row: number, column: number): any {
    return this.source.getValue(this.rowToSource[row], column);
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

  private source: TableModel;
  private rowToSource: Array<number>;
  private valueChangedSignal: Dispatcher<ValueChangedEvent>;
  private rowAddedSignal: Dispatcher<RowAddedEvent>;
  private removingRowSignal: Dispatcher<RemovingRowEvent>;
  private rowMovedSignal: Dispatcher<RowMovedEvent>;
}

export {ProxyTableModel};
