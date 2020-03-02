import React, { Component } from 'react';
import TableWrapper from '../antTable.style';

export default class extends Component {
  render() {
    const dataSource = this.props.dataSource;
    const columns = this.props.columns || this.props.tableInfo.columns;
    return (
      <TableWrapper
        showHeader={false}
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        className="isoSimpleTable"
      />
    );
  }
}
