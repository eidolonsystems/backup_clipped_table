import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TableView} from './table_view';
import {BasicTableModel} from './basic_table_model';

let model = new BasicTableModel(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
for(let row = 0; row < 10000; ++row) {
  let r = [];
  for(let column = 0; column < model.columnCount; ++column) {
    r.push(row * model.columnCount + column);
  }
  model.addRow(r);
}

ReactDOM.render(
  <TableView
    model={model}
    viewWidth='700px'
    viewHeight='12.5em' />,
  document.getElementById('main')
);
