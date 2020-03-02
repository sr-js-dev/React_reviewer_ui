import _ from 'lodash';
import actions from './actions';
import tagActions from '../tags/actions';

const DEFAULT_FILTERS = {
  rating: [],
  on_or_after_date: null,
  search: null,
  sort_by: null,
  bookmarked: null,
  answered: null,
  marketplace: null,
};

const initState = {
  graphs: [],
  graphsLoading: false,
  recentCritical: [],
  reviews: [],
  reviewsLoading: false,
  filterLoading: false,
  //  Filters
  filters: DEFAULT_FILTERS,

  //  Offset for lazy loading
  offset: 0,
  count: null,

  //  Modal workings
  modalReview: {},
  modalActive: false,
};

/**
 * Insert reviews at the right place
 *
 * @param {array} reviews
 */
export function processIncomingReviews({ offset, reviews }, newReviews) {
  if (offset === 0) {
    return newReviews;
  }

  return _.concat(reviews, newReviews);
}

export default function reviewsReducer(state = initState, action) {
  switch (action.type) {
    case actions.SET_GRAPHS:
      return {
        ...state,
        graphs: action.graphs,
      };
    case actions.SET_RECENT_CRITICAL:
      return {
        ...state,
        recentCritical: action.reviews,
      };

    case actions.CLEAR_REVIEWS:
      return {
        ...state,
        reviews: [],
        offset: 0,
      };

    case actions.SET_REVIEWS:
      const reviews = processIncomingReviews(state, action.reviews);
      const offset = reviews.length;

      return {
        ...state,
        reviews,
        offset,
      };
    case actions.SET_REVIEWS_COUNT:
      return {
        ...state,
        count: action.count,
      };
    case actions.UPDATE_OFFSET:
      return {
        ...state,
        offset: state.reviews.length,
      };
    case actions.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.filters,
        },
        offset: 0,
        reviews: [],
        filterLoading: true,
      };

    case actions.CLEAR_FILTERS:
      return {
        ...state,
        filters: DEFAULT_FILTERS,
        offset: 0,
        reviews: [],
      };

    /**
     * Loading indicators
     */
    case actions.SET_GRAPHS_LOADING:
      return {
        ...state,
        graphsLoading: true,
      };
    case actions.SET_GRAPHS_LOADED:
      return {
        ...state,
        graphsLoading: false,
      };
    case actions.SET_REVIEWS_LOADING:
      return {
        ...state,
        reviewsLoading: true,
      };
    case actions.SET_REVIEWS_LOADED:
      return {
        ...state,
        reviewsLoading: false,
        filterLoading: false,
      };

    case actions.SET_MODAL_ACTIVE:
      return {
        ...state,
        modalActive: true,
        modalReview: action.review,
      };

    case actions.SET_MODAL_INACTIVE:
      return {
        ...state,
        modalActive: false,
        modalReview: {},
      };
    case tagActions.SELECT_TAG:
      return {
        ...state,
        offset: 0,
        reviews: [],
        count: 0,
      };
    default:
      return state;
  }
}
