import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TableView} from './table_view';
import {BasicTableModel} from './basic_table_model';

let model = new BasicTableModel(['A', 'B']);
for(let row = 0; row < 10000; ++row) {
  let r = [];
  for(let column = 0; column < 2; ++column) {
    r.push(row * 2 + column);
  }
  model.addRow(r);
}

ReactDOM.render(
  <TableView
    model={model} />,
  document.getElementById('main')
);
