import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { InView } from 'react-intersection-observer';

import {
  getReviews,
  setFilters,
  clearFilters,
  getReviewsCount,
} from '../../redux/reviews/actions';
import {
  showSavedResponsesModal,
  isMobile,
  setQueryParams,
  EXTENDED_MOBILE,
} from '../../redux/app/actions';

import Review from '../../components/common/Review';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import SortingBar from './components/SortingBar';

import '../../scss/Reviews.scss';
import Icon from '../../components/common/Icon';
import ReviewColumn from '../../components/common/Review/ReviewColumn';
import ReviewModal from '../../components/common/Review/ReviewModal';

export class Reviews extends Component {
  state = {
    intersectionObserverPrevEntry: null,
  };

  /**
   * Callback for react-waypoint
   *
   * @param {object} inView - inView instance
   * @param {object} entry - intersection observer entry
   */
  intersectionHandler = (inView, entry) => {
    const { reviewsLoading } = this.props;
    const { intersectionObserverPrevEntry } = this.state;

    //
    if (
      !reviewsLoading &&
      intersectionObserverPrevEntry &&
      intersectionObserverPrevEntry.intersectionRect.height <
        entry.intersectionRect.height
    ) {
      this.getReviewsThrottled();
    }

    if (
      !intersectionObserverPrevEntry ||
      !_.isEqual(
        intersectionObserverPrevEntry.intersectionRect.toJSON(),
        entry.intersectionRect.toJSON()
      )
    ) {
      this.setState({
        intersectionObserverPrevEntry: entry,
      });
    }
  };

  /**
   * Load more reviews
   *
   * @param {object} event - click event
   */
  loadMore = event => {
    this.getReviewsThrottled();
  };

  /**
   * Dispatch get reviews Redux action
   */
  getReviews() {
    const { getReviews } = this.props;
    getReviews();
  }

  getReviewsCount() {
    const { getReviewsCount } = this.props;
    getReviewsCount();
  }

  savedResponsesShow = () => {
    this.setState({ savedResponsesModalVisible: true });
  };

  savedResponsesClose = () => {
    this.setState({ savedResponsesModalVisible: false });
  };

  showSavedResponsesModal = event => {
    const { showSavedResponsesModal } = this.props;
    showSavedResponsesModal();
  };

  setQuickFilter = key => {
    const { setFilters } = this.props;

    setFilters({
      bookmarked: key === 'bookmarked' ? true : null,
      answered:
        key === 'answered_true'
          ? true
          : key === 'answered_false'
          ? false
          : null,
    });
  };

  applyQueryParams() {
    const { queryParams, filters, setFilters } = this.props;
    setFilters(_.pick(queryParams, Object.keys(filters)));
  }

  constructor(props) {
    super(props);

    this.getReviewsThrottled = _.throttle(this.getReviews, 1000);
  }

  componentDidMount() {
    const { reviews } = this.props;
    if (reviews.length === 0) {
      this.getReviews();
      this.getReviewsCount();
    }
  }

  componentDidUpdate(prevProps) {
    if (!_.isEqual(this.props.queryParams, prevProps.queryParams)) {
      this.applyQueryParams();
    }
  }

  componentWillUnmount() {
    const { filters, setQueryParams, clearFilters, pathname } = this.props;
    //  Unset any filter query params,
    //  specific to Reviews page when
    //  navigating away from it
    if (pathname !== '/reviews') {
      clearFilters();
      setQueryParams({ $unset: Object.keys(filters) });
    }
  }

  render() {
    const {
      reviewsLoading,
      reviews: reviewsProp,
      filters,
      mobile,
      offset,
      count,
      filterLoading,
    } = this.props;

    let reviews = _.uniqBy(reviewsProp, 'id');

    const noReviews = !reviews || reviews.length === 0;

    const reviewsList = reviews.map(review => {
      return mobile ? (
        <ReviewColumn review={review} key={review.id} expanded mobile list />
      ) : (
        <Review review={review} key={review.id} expanded={true} />
      );
    });

    const classes = {
      count:
        'text-light-grey-blue hover:text-water-blue text-xs font-bold border-grey-border-50 hover:border-transparent border hover:bg-white hover:shadow-vp-default rounded flex items-center px-2.5 h-7 ml-2.5',
      container:
        'reviews__items-container flex flex-col w-full min-h-160px bg-white rounded-lg shadow-vp-default mt-7 ',
    };

    const all_active = filters.bookmarked == null && filters.answered == null;
    const threshold = [0.25, 0.5, 0.75];
    return (
      <>
        <ReviewModal expanded />

        <section className="w-full min-h-full lg:p-7 z-10">
          {/* Top section */}
          <section
            className={'w-full flex justify-between items-center '}
            style={mobile ? { height: 58 } : {}}
          >
            {/* Preset filters */}
            <section
              className={
                'flex items-center text-sm font-medium ' +
                (mobile ? 'h-full w-full justify-around' : '')
              }
            >
              <button
                onClick={e => {
                  this.setQuickFilter('all');
                }}
                className={
                  'lg:mr-7 ' + (all_active ? 'font-bold text-water-blue' : '')
                }
              >
                {mobile ? 'All' : 'All Reviews'}
              </button>
              <button
                onClick={e => {
                  this.setQuickFilter('answered_false');
                }}
                className={
                  'lg:mr-7 ' +
                  (filters.answered === false
                    ? 'font-bold text-water-blue'
                    : '')
                }
              >
                Unanswered
              </button>
              <button
                onClick={e => {
                  this.setQuickFilter('answered_true');
                }}
                className={
                  'lg:mr-7 ' +
                  (filters.answered === true ? 'font-bold text-water-blue' : '')
                }
              >
                Answered
              </button>
              <button
                onClick={e => {
                  this.setQuickFilter('bookmarked');
                }}
                className={
                  'lg:mr-7 ' +
                  (filters.bookmarked ? 'font-bold text-water-blue' : '')
                }
              >
                Bookmarked
              </button>
            </section>

            {!mobile && (
              <button
                onClick={this.showSavedResponsesModal}
                className="h-10 px-4 text-xxs text-water-blue rounded-lg flex items-center uppercase font-bold bg-white shadow-vp-default hover:shadow-vp-hover"
              >
                <div className="w-4 h-4 rounded bg-water-blue flex justify-center items-center mr-3">
                  <Icon name="reviews" class="text-white text-1/2 mr-px" />
                </div>
                Saved Responses
              </button>
            )}
          </section>

          {/* Main section */}
          <section className={mobile ? '' : classes.container}>
            {/* Search / Sorting bar */}
            <SortingBar />

            {noReviews && (reviewsLoading || filterLoading) && (
              <LoadingAnimation className="py-4" />
            )}

            {noReviews && !(reviewsLoading || filterLoading) && (
              <div className="w-full text-2xl font-medium text-light-grey-blue text-center py-7">
                There are no reviews
              </div>
            )}

            {!noReviews && !filterLoading && (
              <>
                {reviewsList}

                {!mobile && count > offset && (
                  <InView
                    as="div"
                    onChange={this.intersectionHandler}
                    threshold={threshold}
                  >
                    <div className="w-full flex items-center justify-center py-7">
                      {reviewsLoading && <LoadingAnimation />}
                    </div>
                  </InView>
                )}

                {mobile && !reviewsLoading && (
                  <button
                    onClick={this.loadMore}
                    className="w-full max-w-full-margin mx-2.5 mb-2.5 h-11 flex items-center justify-center bg-water-blue-10 text-water-blue text-xs font-bold rounded-lg uppercase"
                  >
                    Load More
                  </button>
                )}

                {mobile && reviewsLoading && (
                  <LoadingAnimation className="mt-5" />
                )}
              </>
            )}
          </section>
        </section>
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state.Reviews,
  pathname: state.router.location.pathname,
  queryParams: state.App.queryParams,
  mobile: isMobile(state.App.view, EXTENDED_MOBILE),
});

const mapDispatchToProps = {
  getReviews,
  getReviewsCount,
  setFilters,
  clearFilters,
  showSavedResponsesModal,
  setQueryParams,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reviews);
