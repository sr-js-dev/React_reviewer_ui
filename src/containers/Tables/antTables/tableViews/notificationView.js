import React, { Component } from 'react';
import TableWrapper from '../antTable.style';

export default class extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      dataList: this.props.dataSource,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSource !== nextProps.dataSource) {
      this.setState({ dataList: nextProps.dataSource });
    }
  }

  onChange(pagination, filters, sorter) {
    // if (sorter && sorter.columnKey && sorter.order) {
    //   var sortOrder = "desc";
    //
    //   if (sorter.order === 'ascend') {
    //     sortOrder = "asc";
    //   }
    //
    //   this.props.callback({
    //     'sorts': {
    //       "Sort": {
    //         'selected': true,
    //         'direction': sortOrder,
    //         'col': sorter.columnKey
    //       }
    //     }
    //   });
    // }
  }
  render() {
    return (
      <TableWrapper
        columns={this.props.tableInfo.columns}
        onChange={this.onChange}
        dataSource={this.state.dataList}
        className="isoSortingTable"
      />
    );
  }
}
