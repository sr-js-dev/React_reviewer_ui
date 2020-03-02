import React from 'react';
import { connect } from 'react-redux';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCaretUp from '@fortawesome/fontawesome-free-solid/faCaretUp';
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown';

//  Actions
import reservationsActions from '../../redux/reservations/actions';

const { setFilter } = reservationsActions;

class HeaderSort extends React.Component {
  sortColumn = (event) => {
    const { name, column: col, filterStates, setFilter } = this.props;

    const newFilter = {
      ...filterStates,
      sorts: {
        name,
        col,
        direction: filterStates.sorts.name === name ? filterStates.sorts.direction === 'asc' ? 'desc' : 'asc' : 'asc'
      }
    };

    setFilter( newFilter );
  }


  render() {
    const { className, name, filterStates } = this.props;

    const selected = name === filterStates.sorts.name;
    const asc = filterStates.sorts.direction === 'asc';

    return (
      <th className={className} nowrap="nowrap" onClick={ this.sortColumn }>
        { name } { selected && <FontAwesomeIcon icon={ asc ? faCaretDown : faCaretUp } /> }
      </th>
    );
  }

}

export default connect(
  ( state ) => ({
      filterStates: state.Reservations.filterStates
  }),
  { setFilter }
)(HeaderSort);
