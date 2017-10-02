import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {TableModel} from './table_model';

interface TableViewProperties {
  model: TableModel;
}

interface TableViewState {
  viewX: number;
  viewY: number;
}

class TableView extends React.Component<TableViewProperties, TableViewState> {
  constructor(properties: TableViewProperties) {
    super(properties);
    this.state = {
      viewX: 0,
      viewY: 0
    };
  }

  public render() {
    let rows: Array<JSX.Element> = [];
    for(let rowIndex = 0; rowIndex < this.props.model.rowCount; ++rowIndex) {
      let row: Array<JSX.Element> = [];
      for(let columnIndex = 0; columnIndex < this.props.model.columnCount;
          ++columnIndex) {
        row.push(<td>{this.props.model.getValue(rowIndex, columnIndex)}</td>);
      }
      rows.push(<tr>{row}</tr>);
    }
    return (
      <div>
        <table>
          {rows}
        </table>
      </div>);
  }
}

export {TableView};
