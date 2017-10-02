import {Expect, Test} from "alsatian";
import {BasicTableModel} from '../source/basic_table_model';

/** Tests the BasicTableModel. */
class BasicTableModelTester {

  /** Tests adding rows.
   * Construct a BasicTableModel with two columns 'A' and 'B'.
   * Expect a row count of 0 and column count of 2.
   * Expect the column names to be 'A' and 'B'.
   * Add a row with three values at index 0.
   * Expect the model to throw an error.
   * Add a row with 2 values at index 0.
   * Expect the operation to succeed.
   * Expect the row count to equal 1.
   * Expect a row added signal to be emitted with an index of 0.
   * Add a row with 2 values at index 1.
   * Expect the operation to succeed with the proper values.
   * Expect a row added signal to be emitted with an index of 1.
   * Add a row with 2 values at index 1.
   * Expect the operation to succeed
   */
  @Test()
  public testAddRow(): void {
    let model = new BasicTableModel(['A', 'B']);
    let receivedIndex = undefined;
    let rowAddedSlot = (index: number) => {
      receivedIndex = index;
    };
    model.connectRowAddedSignal(rowAddedSlot);
    Expect(model.rowCount).toEqual(0);
    Expect(model.columnCount).toEqual(2);
    Expect(model.getName(0)).toEqual('A');
    Expect(model.getName(1)).toEqual('B');
    Expect(() => model.addRow([1, 2, 3], 0)).toThrow();
    Expect(receivedIndex).toEqual(undefined);
    Expect(() => model.addRow([1, 2], 0)).not.toThrow();
    Expect(model.getValue(0, 0)).toEqual(1);
    Expect(model.getValue(0, 1)).toEqual(2);
    Expect(receivedIndex).toEqual(0);
  }
}

export {BasicTableModelTester};
