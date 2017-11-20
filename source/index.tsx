import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TableView} from './table_view';
import {ArrayTableModel} from './array_table_model';

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

ReactDOM.render(
  <TableView
    model={model}
    viewWidth='2000px'
    viewHeight='1000px' />,
  document.getElementById('main')
);
