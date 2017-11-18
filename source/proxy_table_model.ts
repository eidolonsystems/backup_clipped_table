import {Dispatcher} from 'kola-signals';
import {TableModel} from './table_model';

/** Implements a TableModel that rearranges the contents of some underlying
 * model. */
class ProxyTableModel extends TableModel {

  /** Creates a ProxyTableModel.
   * @param source - The underlying model to proxy.
   */
  public constructor(source: TableModel) {
    super();
    this.source = source;
    this.rowToSource = new Array<number>();
    this.rowFromSource = new Array<number>();
    for(let i = 0; i < this.source.rowCount; ++i) {
      this.rowToSource.push(i);
      this.rowFromSource.push(i);
    }
    this.valueChangedSignal = new Dispatcher<[number, number, any]>();
    this.rowAddedSignal = new Dispatcher<number>();
    this.removingRowSignal = new Dispatcher<number>();
    this.rowMovedSignal = new Dispatcher<[number, number]>();
  }

  public moveRow(source: number, destination: number): void {
    this.rowToSource[source] = destination;
    this.rowFromSource[destination] = source;
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

  private source: TableModel;
  private rowToSource: Array<number>;
  private rowFromSource: Array<number>;
  private valueChangedSignal: Dispatcher<[number, number, any]>;
  private rowAddedSignal: Dispatcher<number>;
  private removingRowSignal: Dispatcher<number>;
  private rowMovedSignal: Dispatcher<[number, number]>;
}

export {ProxyTableModel};
