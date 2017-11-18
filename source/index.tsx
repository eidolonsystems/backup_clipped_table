import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TableView} from './table_view';
import {BasicTableModel} from './basic_table_model';

let model = new BasicTableModel(['Account', 'Currency', 'Acc. Total P/L',
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

/*
window.setInterval(function() {
  let row = Math.floor(Math.random() * (model.rowCount));
  let column = Math.floor(Math.random() * (model.columnCount));
  let value = Math.floor(Math.random() * 1000000);
  model.setValue(row, column, value);
}, 10);

window.setInterval(function() {
  let source = Math.floor(Math.random() * (model.rowCount));
  let destination = Math.floor(Math.random() * (model.rowCount));
  model.moveRow(source, destination);
}, 10);
*/

ReactDOM.render(
  <TableView
    model={model}
    viewWidth='2000px'
    viewHeight='1000px' />,
  document.getElementById('main')
);
