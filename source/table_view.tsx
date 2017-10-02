import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import {TableModel} from './table_model';

interface TableViewProperties {
  model: TableModel;
}

interface TableViewState {
  viewX: number;
  viewY: number;
  containerId: string;
}

class TableView extends React.Component<TableViewProperties, TableViewState> {
  constructor(properties: TableViewProperties) {
    super(properties);
    this.state = {
      viewX: 0,
      viewY: 0,
      containerId: null
    };
  }

  public render(): JSX.Element {
    if(this.state.containerId == null) {
      return <div></div>;
    }
    let element = document.getElementById(this.state.containerId);
    let style = window.getComputedStyle(element, null).getPropertyValue(
      'font-size');
    let fontSize = Math.floor(parseFloat(style));
    let height = element.scrollHeight;
    if(height == 0) {
      height = $(window).height();
    }
    let displayedRowCount = (2 * height) / fontSize;
    let topRow = Math.floor(this.state.viewY / fontSize);
    let bottomRow = Math.min(topRow + displayedRowCount,
      this.props.model.rowCount);
    let rows: Array<JSX.Element> = [];
    for(let rowIndex = topRow; rowIndex < bottomRow; ++rowIndex) {
      let row: Array<JSX.Element> = [];
      for(let columnIndex = 0; columnIndex < this.props.model.columnCount;
          ++columnIndex) {
        row.push(<td>{this.props.model.getValue(rowIndex, columnIndex)}</td>);
      }
      rows.push(<tr>{row}</tr>);
    }
    let divStyle = {
      height: fontSize * this.props.model.rowCount + 'px'
    };
    return (
      <div style={divStyle} onScroll={this.onScroll}>
        <table>
          {rows}
        </table>
      </div>);
  }

  public componentDidMount(): void {
    let containerId = ReactDOM.findDOMNode(
      this as React.ReactInstance).parentNode.attributes.getNamedItem(
      'id').value;
    this.setState(
      {
        containerId: containerId
      });
  }

  private onScroll(): void {
    console.log('scrolled');
  }
}

export {TableView};
