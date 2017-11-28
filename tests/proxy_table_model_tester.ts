import {Expect, Test} from "alsatian";
import {ArrayTableModel} from '../source/array_table_model';
import {ProxyTableModel} from '../source/proxy_table_model';
import {RemovingRowEvent, RowAddedEvent, RowMovedEvent, TableModel,
  ValueChangedEvent} from '../source/table_model';

/** Tests the ProxyTableModel. */
class ProxyTableModelTester {

  /** Tests moving a row.
   * Construct an ArrayTableModel with rows [0, 1, 2].
   * Construct a ProxyTableModel over the ArrayTableModel.
   * Expect a row count of 3 and a column count of 1.
   * Validate the column names.
   * Move row 0 to row 1.
   * Expect rows [1, 0, 2].
   * Update the ArrayTableModel with values [3, 4, 5].
   * Expect ValueChangedEvents to rows [1, 0, 2] respectively.
   */
  @Test()
  public testMoveRow(): void {
    let sourceModel = new ArrayTableModel(['A']);
    sourceModel.addRow([0]);
    sourceModel.addRow([1]);
    sourceModel.addRow([2]);
    let model = new ProxyTableModel(sourceModel);
    Expect(model.rowCount).toEqual(3);
    Expect(model.columnCount).toEqual(1);
    model.moveRow(0, 1);
    Expect(model.getValue(0, 0)).toEqual(1);
    Expect(model.getValue(1, 0)).toEqual(0);
    Expect(model.getValue(2, 0)).toEqual(2);
    let expectedEvent: ValueChangedEvent;
    model.connectValueChangedSignal(
      function (event: ValueChangedEvent) {
        expectedEvent = event;
      });
    sourceModel.setValue(0, 0, 3);
    Expect(expectedEvent.row).toEqual(1);
    Expect(expectedEvent.column).toEqual(0);
    Expect(expectedEvent.previousValue).toEqual(0);
    sourceModel.setValue(1, 0, 4);
    Expect(expectedEvent.row).toEqual(0);
    Expect(expectedEvent.column).toEqual(0);
    Expect(expectedEvent.previousValue).toEqual(1);
    sourceModel.setValue(2, 0, 5);
    Expect(expectedEvent.row).toEqual(2);
    Expect(expectedEvent.column).toEqual(0);
    Expect(expectedEvent.previousValue).toEqual(2);
  }
}

export {ProxyTableModelTester};
