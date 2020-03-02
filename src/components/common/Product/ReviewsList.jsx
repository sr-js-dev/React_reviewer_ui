import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InView } from 'react-intersection-observer';
import _ from 'lodash';

import ReviewInsideCompact from '../Review/ReviewInsideCompact';
import ReviewsService from '../../../services/ReviewsService';
import LoadingAnimation from '../LoadingAnimation';
import { processIncomingReviews } from '../../../redux/reviews/reducer';
import { Input } from 'antd';
import Icon from '../Icon';


export default class ReviewsList extends Component {
  static propTypes = {
    product_id: PropTypes.number.isRequired
  }

  state = {
    search: "",
    searchFocused: false,
    loading: true,
    reviews: [],
    intersectionObserverPrevEntry: null,
    offset: 0,
    endOfList: false
  }

  searchChange = event => {
    const search = event.target.value;
    this.setState( { search, offset: 0 } );
  }

  searchFocus = event => {
    this.setState( { searchFocused: true } );
  }

  searchBlur = event => {
    this.setState( { searchFocused: false } );
  }

  /**
   * Callback for react-waypoint
   */
  intersectionHandler = (inView, entry) => {
    const { intersectionObserverPrevEntry } = this.state;

    //
    if (
      intersectionObserverPrevEntry &&
      intersectionObserverPrevEntry.intersectionRect.height <
        entry.intersectionRect.height
    ) {
      this.getReviewsThrottled();
    }

    this.setState({
      intersectionObserverPrevEntry: entry,
    });
  };

  loadMore = event => {
    this.getReviewsThrottled();
  }

  getReviews = () => {
    const { product_id } = this.props;
    const { offset, search } = this.state;

    this.setState({loading: true})

    return ReviewsService.index( { product_id, offset, search } )
      .then( ({ reviews: incomingReviews }) => {

        if ( offset > 0 && incomingReviews.length === 0 ) {
          this.setState( { endOfList: true, loading: false } );
          return;
        }

        const newReviews = processIncomingReviews( this.state, incomingReviews );
        const newOffset = newReviews.length;

        this.setState( {
          reviews: newReviews,
          offset: newOffset,
          loading: false
        } );
      } );
  }

  constructor( props ) {
    super( props );

    this.getReviewsThrottled = _.throttle( this.getReviews, 1000 );
  }

  componentDidMount() {
    this.getReviews();
  }

  componentDidUpdate( prevProps, prevState ) {
    if ( this.state.search !== prevState.search ) {
      this.getReviewsThrottled()
    }
  }

  render() {
    const { mobile } = this.props;
    const { reviews, loading, endOfList, search, searchFocused } = this.state;

    const reviewCards = reviews && reviews.map( (review, idx) => {
      return <a href={ review.review_url } target="_blank" key={ idx } rel="noopener noreferrer" className="relative w-full flex flex-col items-center bg-white p-5 mb-3 rounded-lg shadow-vp-default hover:shadow-vp-hover cursor-pointer">
        <ReviewInsideCompact review={ review } compact={ true }/>
      </a>
    } );

    const inputPrefix = <Icon name="search" className={ "text-lg " + ( searchFocused ? "text-water-blue" : "text-dusk-30" ) } />;

    return (
      <section className="flex flex-col">
        <Input
          className={ "w-full h-7 mb-3 shadow-vp-default sticky z-10" }
          style={{ top: '1rem' }}
          prefix={ inputPrefix }
          onFocus={ this.searchFocus }
          onBlur={ this.searchBlur }
          value={ search }
          onChange={ this.searchChange }
          placeholder="Search in Reviews…"
        />

        { loading && <div className="absolute pin-t pin-l w-full h-full bg-white-50 z-30 flex justify-center items-center"><LoadingAnimation /></div>}

        { ( !reviews || reviews.length === 0 ) &&
          <div className="w-full flex-grow flex items-center justify-center text-xl text-light-grey-blue-50 font-semibold">
            No reviews found
          </div>
        }

        { reviews && reviews.length > 0 && <>
          { reviewCards }

          { endOfList && <div className="w-full h-full flex items-center justify-center text-xl text-light-grey-blue-50 font-semibold pt-5 uppercase">End of list</div>}

          { !mobile && !endOfList &&
            <InView
              as="div"
              onChange={this.intersectionHandler}
              threshold={[0.1, 0.5]}
            >
              <div className="w-full flex items-center justify-center py-7" />
            </InView>
          }

          { mobile && !endOfList &&
            <button
              onClick={this.loadMore}
              className="w-full mt-2.5 h-11 flex items-center justify-center bg-water-blue-10 text-water-blue text-xs font-bold rounded-lg uppercase"
            >
              Load More
            </button>
          }
        </>}
      </section>
    )
  }
}
