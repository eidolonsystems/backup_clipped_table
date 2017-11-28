import {Expect, Test} from "alsatian";
import {ArrayTableModel} from '../source/array_table_model';
import {ColumnOrder, SortedTableModel} from '../source/sorted_table_model';
import {RemovingRowEvent, RowAddedEvent, RowMovedEvent, TableModel,
  ValueChangedEvent} from '../source/table_model';

/** Tests the SortedTableModel. */
class SortedTableModelTester {

  @Test()
  public testSingleColumnSort(): void {
    let sourceModel = new ArrayTableModel(['A']);
    sourceModel.addRow([2]);
    sourceModel.addRow([1]);
    sourceModel.addRow([0]);
    let model = new SortedTableModel(sourceModel);
    Expect(model.rowCount).toEqual(3);
    Expect(model.columnCount).toEqual(1);
    Expect(model.getValue(0, 0)).toEqual(0);
    Expect(model.getValue(1, 0)).toEqual(1);
    Expect(model.getValue(2, 0)).toEqual(2);
  }

  @Test()
  public testMultiColumnSort(): void {
    let sourceModel = new ArrayTableModel(['A', 'B']);
    sourceModel.addRow([1, 0]);
    sourceModel.addRow([0, 1]);
    sourceModel.addRow([2, 0]);
    let model = new SortedTableModel(sourceModel, undefined,
      [new ColumnOrder(1)]);
    Expect(model.rowCount).toEqual(3);
    Expect(model.columnCount).toEqual(2);
    Expect(model.getValue(0, 0)).toEqual(1);
    Expect(model.getValue(0, 1)).toEqual(0);
    Expect(model.getValue(1, 0)).toEqual(2);
    Expect(model.getValue(1, 1)).toEqual(0);
    Expect(model.getValue(2, 0)).toEqual(0);
    Expect(model.getValue(2, 1)).toEqual(1);
  }

  @Test()
  public testValueChanges(): void {
    let sourceModel = new ArrayTableModel(['A']);
    sourceModel.addRow([0]);
    sourceModel.addRow([1]);
    sourceModel.addRow([2]);
    let model = new SortedTableModel(sourceModel);
    sourceModel.setValue(0, 0, 0);
    Expect(model.getValue(0, 0)).toEqual(0);
    Expect(model.getValue(1, 0)).toEqual(1);
    Expect(model.getValue(2, 0)).toEqual(2);
    sourceModel.setValue(0, 0, 3);
    Expect(model.getValue(0, 0)).toEqual(1);
    Expect(model.getValue(1, 0)).toEqual(2);
    Expect(model.getValue(2, 0)).toEqual(3);
    sourceModel.setValue(0, 0, 5);
    Expect(model.getValue(0, 0)).toEqual(1);
    Expect(model.getValue(1, 0)).toEqual(2);
    Expect(model.getValue(2, 0)).toEqual(5);
    sourceModel.setValue(0, 0, -1);
    Expect(model.getValue(0, 0)).toEqual(-1);
    Expect(model.getValue(1, 0)).toEqual(1);
    Expect(model.getValue(2, 0)).toEqual(2);
  }
}

export {SortedTableModelTester};
