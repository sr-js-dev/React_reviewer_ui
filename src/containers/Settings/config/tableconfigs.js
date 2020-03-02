// import React from 'react';
import clone from 'clone';
import _ from 'lodash';
import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
} from '../../../components/tables/helperCells';

const renderCell = (object, type, key) => {
  const value = _.get(object, key);

  switch (type) {
    case 'ImageCell':
      return ImageCell(value);
    case 'DateCell':
      return DateCell(value);
    case 'LinkCell':
      return LinkCell(value, 'listing/' + object['id']);
    default:
      return TextCell(value);
  }
};

const columns = [
  {
    key: 'picture_1_url',
    render: object => renderCell(object, 'ImageCell', 'picture_1_url'),
  },
  {
    key: 'id',
    render: object =>
      renderCell(
        object,
        'LinkCell',
        'current_listing_info_snapshot.listing_title'
      ),
  },
];
// const smallColumns = [columns[0], columns[2]];

const tableinfos = [
  {
    title: 'Properties Table',
    value: 'dashboardView',
    columns: clone(columns),
  },
];
export { columns, tableinfos };
