import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import {TableModel} from './table_model';
import {ColumnResizer} from './column_resizer';

enum TableViewInitialization {
  CONTAINER,
  TABLE,
  COMPLETE
};

interface TableViewProperties {
  model: TableModel;
  viewWidth: string;
  viewHeight: string;
}

interface TableViewState {
  viewX: number;
  viewY: number;
  initialization: TableViewInitialization;
}

class TableView extends React.Component<TableViewProperties, TableViewState> {
  constructor(properties: TableViewProperties) {
    super(properties);
    this.state = {
      viewX: 0,
      viewY: 0,
      initialization: TableViewInitialization.CONTAINER
    };
    this.divStyle = {
      width: this.props.viewWidth,
      height: this.props.viewHeight,
      overflow: 'auto' as 'auto'
    };
    this.columnWidths = [];
    for(let i = 0; i < this.props.model.columnCount; ++i) {
      this.columnWidths.push(0);
    }
    this.columnResizer = new ColumnResizer(this.columnWidths,
      this.onColumnResized.bind(this));
  }

  public render(): JSX.Element {
    if(this.state.initialization == TableViewInitialization.CONTAINER) {
      return (
        <div ref={(element) => {this.container = element;}}
            style={this.divStyle}>
        </div>);
    }
    let rowHeight = 0;
    let topRow = 0;
    let bottomRow = 0;
    if(this.state.initialization == TableViewInitialization.TABLE) {
      let style = window.getComputedStyle(
        this.container, null).getPropertyValue('font-size');
      rowHeight = Math.floor(parseFloat(style));
      bottomRow = Math.min(1, this.props.model.rowCount);
      let viewWidth = Math.floor(parseFloat(window.getComputedStyle(
        this.container, null).getPropertyValue('width')));
      let initialColumnWidth = Math.floor
        (viewWidth / this.props.model.columnCount);
      for(let i = 0; i < this.props.model.columnCount; ++i) {
        this.columnWidths[i] = initialColumnWidth;
      }
    } else {
      rowHeight = this.table.rows[0].offsetHeight;
      let viewHeight = Math.floor(parseFloat(window.getComputedStyle(
        this.container, null).getPropertyValue('height')));
      let displayedRowCount = Math.ceil(viewHeight / rowHeight) + 1;
      topRow = Math.floor(this.state.viewY / rowHeight);
      bottomRow = Math.min(topRow + displayedRowCount,
        this.props.model.rowCount);
    }
    let columns: Array<JSX.Element> = [];
    let headers: Array<JSX.Element> = [];
    for(let columnIndex = 0; columnIndex < this.props.model.columnCount;
        ++columnIndex) {
      let columnStyle = {
        width: `${this.columnWidths[columnIndex]}px`
      };
      columns.push(<col style={columnStyle} />);
      headers.push(<th>{this.props.model.getName(columnIndex)}</th>);
    }
    let rows: Array<JSX.Element> = [];
    rows.push.apply(rows, columns);
    rows.push(
      <thead
          onMouseMove={this.columnResizer.onMouseMove.bind(this.columnResizer)}>
        <tr>{headers}</tr>
      </thead>);
    for(let rowIndex = topRow; rowIndex < bottomRow; ++rowIndex) {
      let row: Array<JSX.Element> = [];
      for(let columnIndex = 0; columnIndex < this.props.model.columnCount;
          ++columnIndex) {
        row.push(<td>{this.props.model.getValue(rowIndex, columnIndex)}</td>);
      }
      rows.push(<tr>{row}</tr>);
    }
    let innerStyle = {
      height: rowHeight * (this.props.model.rowCount + 3) - this.state.viewY,
      paddingTop: this.state.viewY
    };
    return (
      <div ref={(element) => {this.container = element;}}
           style={this.divStyle}
           onScroll={this.onScroll.bind(this)}>
        <div style={innerStyle}>
          <style scoped>{`
            table {
              border-collapse: collapse;
              -webkit-user-select: none;
              -khtml-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              -o-user-select: none;
              user-select: none;
              cursor: default;
            }
            table, th {
              border:1px solid black;
            }
            td {
              text-align: center;
              vertical-align: middle;
            }`}
          </style>
          <table ref={(element) => {this.table = element;}}>
            {rows}
          </table>
        </div>
      </div>);
  }

  public componentDidMount(): void {
    this.setState(
      {
        initialization: TableViewInitialization.TABLE
      });
  }

  public componentDidUpdate(): void {
    setTimeout(() => {
      window.requestAnimationFrame(() => {
        if(this.state.initialization == TableViewInitialization.TABLE) {
          if(this.props.model.rowCount > 0) {
            this.setState(
              {
                initialization: TableViewInitialization.COMPLETE
              });
          }
        }
      });
    }, 0);
  }

  private onScroll(): void {
    this.setState(
      {
        viewX: $(this.container).scrollLeft(),
        viewY: $(this.container).scrollTop()
      });
  }

  private onColumnResized(): void {
    this.forceUpdate();
  }

  private divStyle: any;
  private columnResizer: ColumnResizer;
  private columnWidths: Array<number>;
  private container: HTMLDivElement;
  private table: HTMLTableElement;
}

export {TableView};
