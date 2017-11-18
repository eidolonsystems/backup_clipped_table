import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import {BasicTableModel} from './basic_table_model';
import {ColumnResizer} from './column_resizer';
import {SelectionModel} from './selection_model';
import {TableModel} from './table_model';

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
    this.selectionModel = new SelectionModel(this, this.props.model);
    this.divStyle = {
      width: this.props.viewWidth,
      height: this.props.viewHeight,
      overflow: 'auto' as 'auto'
    };
    this.columnWidths = [];
    for(let i = 0; i < this.props.model.columnCount; ++i) {
      this.columnWidths.push(0);
    }
    this.topVisibleRow = 0;
    this.bottomVisibleRow = 0;
    this.columnResizer = new ColumnResizer(this.columnWidths,
      this.onColumnResized.bind(this));
    this.props.model.connectValueChangedSignal(
      this.onModelValueChanged.bind(this));
    this.props.model.connectRowAddedSignal(this.onModelRowAdded.bind(this));
    this.props.model.connectRemovingRowSignal(
      this.onModelRemovingRow.bind(this));
    this.props.model.connectRowMovedSignal(this.onModelRowMoved.bind(this));
    this.selectionModel.connectValueChangedSignal(
      this.onModelValueChanged.bind(this));
    this.selectionModel.connectRowAddedSignal(this.onModelRowAdded.bind(this));
    this.selectionModel.connectRemovingRowSignal(
      this.onModelRemovingRow.bind(this));
    this.selectionModel.connectRowMovedSignal(this.onModelRowMoved.bind(this));
  }

  public render(): JSX.Element {
    if(this.state.initialization == TableViewInitialization.CONTAINER) {
      return (
        <div ref={(element) => {this.container = element;}}
            style={this.divStyle}>
        </div>);
    }
    let rowHeight: number;
    if(this.state.initialization == TableViewInitialization.TABLE) {
      let style = window.getComputedStyle(
        this.container, null).getPropertyValue('font-size');
      rowHeight = Math.floor(parseFloat(style));
      this.bottomVisibleRow = Math.min(1, this.props.model.rowCount);
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
      this.topVisibleRow = Math.floor(this.state.viewY / rowHeight);
      this.bottomVisibleRow = Math.min(this.topVisibleRow + displayedRowCount,
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
    let body: Array<JSX.Element> = [];
    for(let rowIndex = this.topVisibleRow; rowIndex < this.bottomVisibleRow;
        ++rowIndex) {
      let backgroundColor: string;
      if(this.selectionModel.getValue(rowIndex, 0)) {
        backgroundColor = '#8d78eb';
      } else {
        if(rowIndex % 2 == 0) {
          backgroundColor = 'white';
        } else {
          backgroundColor = '#fafafa';
        }
      }
      let rowStyle = {
        backgroundColor: backgroundColor
      };
      let row: Array<JSX.Element> = [];
      for(let columnIndex = 0; columnIndex < this.props.model.columnCount;
          ++columnIndex) {
        row.push(<td>{this.props.model.getValue(rowIndex, columnIndex)}</td>);
      }
      body.push(<tr style={rowStyle}>{row}</tr>);
    }
    let table: Array<JSX.Element> = [];
    table.push.apply(table, columns);
    table.push(
      <thead
          onMouseMove={this.columnResizer.onMouseMove.bind(this.columnResizer)}>
        <tr>{headers}</tr>
      </thead>);
    table.push(
      <tbody
          onMouseMove={this.selectionModel.onMouseMove.bind(
            this.selectionModel)}
          onMouseDown={this.selectionModel.onMouseDown.bind(
            this.selectionModel)}
          onMouseUp={this.selectionModel.onMouseUp.bind(
            this.selectionModel)}>
        {body}
      </tbody>);
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
              border: 1px solid #ebebeb;
            }
            td {
              text-align: center;
              vertical-align: middle;
            }`}
          </style>
          <table
              tabIndex={0}
              ref={(element) => {this.table = element;}}
              onKeyDown={this.selectionModel.onKeyDown.bind(
                this.selectionModel)}
              onKeyUp={this.selectionModel.onKeyUp.bind(this.selectionModel)}>
            {table}
          </table>
        </div>
      </div>);
  }

  /** Returns the row index at a specified coordinate.
   * @param x - The x-coordinate in client space.
   * @param y - The y-coordinate in client space.
   * @return The index of the specified row, or -1 if the coordinate does not
   *         specify a row.
   */
  public getRowAt(x: number, y: number): number {
    if(this.table.rows.length == 0) {
      return -1;
    }
    for(let i = 0; i < this.table.rows.length; ++i) {
      if(y >= this.table.rows[i].getBoundingClientRect().top &&
          y <= this.table.rows[i].getBoundingClientRect().bottom) {
        return i + this.topVisibleRow - 1;
      }
    }
    return -1;
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

  private onModelValueChanged(update: [number, number, any]): void {
    if(update[0] < this.topVisibleRow || update[0] > this.bottomVisibleRow) {
      return;
    }
    this.forceUpdate();
  }

  private onModelRowAdded(index: number): void {
    if(index > this.bottomVisibleRow) {
      return;
    }
    this.forceUpdate();
  }

  private onModelRemovingRow(index: number): void {
    if(index > this.bottomVisibleRow) {
      return;
    }
    this.forceUpdate();
  }

  private onModelRowMoved(update: [number, number]): void {
    if(update[0] < this.topVisibleRow && update[1] < this.topVisibleRow ||
        update[0] > this.bottomVisibleRow &&
        update[1] > this.bottomVisibleRow) {
      return;
    }
    this.forceUpdate();
  }

  private selectionModel: SelectionModel;
  private divStyle: any;
  private columnResizer: ColumnResizer;
  private columnWidths: Array<number>;
  private topVisibleRow: number;
  private bottomVisibleRow: number;
  private container: HTMLDivElement;
  private table: HTMLTableElement;
}

export {TableView};
