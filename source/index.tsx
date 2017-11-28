import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {ArrayTableModel} from './array_table_model';
import {SortedTableModel} from './sorted_table_model';
import {TableView} from './table_view';

let model = new ArrayTableModel(['Account', 'Currency', 'Acc. Total P/L',
  'Acc. Unrealized', 'Acc. Realized', 'Acc. Fees', 'Security', 'Open Quantity',
  'Side', 'Avg. Price', 'Total P/L', 'Unrealized', 'Realized', 'Fees',
  'Cost Basis', 'Volume', 'Trades']);
for(let row = 0; row < 1000; ++row) {
  let r = [row];
  for(let column = 0; column < model.columnCount - 1; ++column) {
    r.push(row * model.columnCount + column);
  }
  model.addRow(r);
}

let sortedModel = new SortedTableModel(model);

ReactDOM.render(
  <TableView
    model={sortedModel}
    sortedModel={sortedModel}
    viewWidth='2000px'
    viewHeight='1000px' />,
  document.getElementById('main')
);
