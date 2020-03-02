import React, { Component } from "react";
import { connect } from "react-redux";
import { Input } from 'antd';
import _ from 'lodash';

import { setFilters } from '../../../redux/comments/actions';
import { isMobile, EXTENDED_MOBILE } from "../../../redux/app/actions";

import SortButton from '../../../components/sortButton';
import Icon from "../../../components/common/Icon";
import MarketplaceSelect from "../../../components/common/MarketplaceSelect";

const SORT_FIELDS = [
  {
      fieldName: 'recent',
      buttonLabel: 'Most Recent',
      descName: 'newest_first',
      ascName: 'oldest_first'
  }
];

export class SortingBar extends Component {
  state = {
    searchFocused: false,
    sorting: {
        fieldName: 'recent',
        status: false,
        directionSort: false,
    },
  };

    /**
     * Trigger handler for filter button
     *
     * @param {string} fieldName - sorting field name
     * @returns {object}
     */
    handlerTriggerFilter = fieldName => {
      this.setState(state => {
          let fn = state.sorting.fieldName !== '' && fieldName === state.sorting.fieldName ? state.sorting.fieldName : fieldName;
          let sortDirection = (state.sorting.fieldName !== '' && fieldName === state.sorting.fieldName) ? !state.sorting.directionSort : false;
          return {
              sorting: {
                  ...state.sorting,
                  fieldName: fn,
                  status: !state.sorting.status,
                  directionSort: sortDirection,
              },
          };
      });
  };

  /**
   * Trigger handler for direction
   *
   * @param {event} e - object
   * @returns {object}
   */
  handlerTriggerDirection = e => {
      e.stopPropagation();
      this.setState(state => ({
          sorting: {
              ...state.sorting,
              directionSort: !state.sorting.directionSort,
          },
      }));
  };

  searchFocus = event => {
    this.setState( { searchFocused: true } );
  }

  searchBlur = event => {
    this.setState( { searchFocused: false } );
  }

  searchChange = event => {
    const search = event.target.value;

    this.setFilters( { search } );
  }

  getRating = () => {
    const { rating } = this.props.filters;
    return rating.pop();
  }

  changeRating = rating => {
    let ratingArray = [];

    for (let index = 1; index <= rating; index++) {
      ratingArray.push( index );
    }

    this.setFilters({ rating: ratingArray });
  }

  onMarketplaceSelect = ( value, options ) => {
    const { setFilters, defaultMarketplace } = this.props;
    if ( value !== defaultMarketplace ) {
      setFilters( { marketplace: value } );
    } else {
      setFilters( { marketplace: null } );
    }
  }

  setFilters = filters => {
    const { setFilters } = this.props;
    setFilters( filters );
  }

  componentDidUpdate( prevProps, prevState ) {
    const { sorting } = this.state

    if ( !_.isEqual( prevState.sorting, sorting ) ) {
      const { ascName, descName } = _.find( SORT_FIELDS, [ "fieldName", sorting.fieldName ] );

      this.setFilters({
        sort_by: sorting.directionSort ? ascName : descName
      })
    }
  }

  render() {
    const { count, mobile, extendedMobile, mainPaddingTop } = this.props;
    const { search, marketplace } = this.props.filters;
    const { sorting, searchFocused } = this.state;
    const btnLabel = (sorting.directionSort && sorting.fieldName === 'recent') ? 'Least Recent' : null;
    const classes = {
      count:
        'flex-no-shrink text-water-blue text-xs font-bold border-grey-border-50 border rounded flex items-center px-2.5 h-7 lg:ml-5',
    }

    const inputPrefix = <Icon name="search" className={ "text-lg " + ( searchFocused ? "text-water-blue" : "text-dusk-30" ) } />;

    const sortButtons = SORT_FIELDS.map(field => {
      return (
          <SortButton
              key={'sorting-' + field.fieldName}
              {...field}
              buttonLabel={(btnLabel && field.fieldName === 'recent') ? btnLabel : field.buttonLabel}
              currentFieldName={sorting.fieldName}
              status={sorting.status}
              directionSort={sorting.directionSort}
              handlerTriggerButton={this.handlerTriggerFilter}
              handlerTriggerDirection={this.handlerTriggerDirection}
          />
      );
  });

    return (
      <div className={ "reviews__reviews-sort-search bg-white z-10 lg:h-16 w-full flex justify-between lg:rounded-t-lg " + ( extendedMobile ? "flex-col" : "") } style={ mobile ? null : { top: mainPaddingTop }} >
        <section className={ "w-full flex items-center " + ( extendedMobile ? "w-full border-b px-2.5" : "" ) }>
          {/* Product count */}
          {count != null && <div className={classes.count}>{count}</div>}
          {/* Search input */}
          <Input
          className={ "flex-grow h-14 lg:h-16" }
            prefix={ inputPrefix }
            onFocus={ this.searchFocus }
            onBlur={ this.searchBlur }
            value={ search }
            onChange={ this.searchChange }
            placeholder="Search by Keywords, ASIN or Product Name…"
          />
        </section>

        <div className={ "flex items-center flex-no-shrink " + ( extendedMobile ? "w-full h-15.5 px-2.5 overflow-y-scroll" : "" ) }>
          { sortButtons }

          <MarketplaceSelect value={ marketplace } onChange={ this.onMarketplaceSelect }/>

          { extendedMobile && <div className="h-7 w-2.5 flex-no-shrink"/>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  count: state.Comments.count,
  filters: state.Comments.filters,
  defaultMarketplace: state.App.defaultMarketplace,
  mainPaddingTop: state.App.mainPaddingTop,
  mobile: isMobile( state.App.view ),
  extendedMobile: isMobile( state.App.view, EXTENDED_MOBILE )
});

const mapDispatchToProps = {
  setFilters
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SortingBar);
