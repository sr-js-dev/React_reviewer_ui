const reviewsActions = {
  GET_GRAPHS: 'GET_GRAPHS',
  SET_GRAPHS: 'SET_GRAPHS',
  SET_GRAPHS_LOADING: 'SET_GRAPHS_LOADING',
  SET_GRAPHS_LOADED: 'SET_GRAPHS_LOADED',
  CLEAR_REVIEWS: 'CLEAR_REVIEWS',
  GET_RECENT_CRITICAL: 'GET_RECENT_CRITICAL',
  GET_REVIEWS: 'GET_REVIEWS',
  SET_RECENT_CRITICAL: 'SET_RECENT_CRITICAL',
  SET_REVIEWS: 'SET_REVIEWS',
  SET_REVIEWS_LOADING: 'SET_REVIEWS_LOADING',
  SET_REVIEWS_LOADED: 'SET_REVIEWS_LOADED',

  DISMISS_REVIEW: 'DISMISS_REVIEW',
  RECORD_RESPONSE: 'RECORD_RESPONSE',
  BOOKMARK_REVIEW: 'BOOKMARK_REVIEW',

  //  Count
  GET_REVIEWS_COUNT: 'GET_REVIEWS_COUNT',
  SET_REVIEWS_COUNT: 'SET_REVIEWS_COUNT',

  //  Filters
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_FILTERS: 'CLEAR_FILTERS',

  //  Offset for lazy loading
  SET_OFFSET: 'SET_OFFSET',
  UPDATE_OFFSET: 'UPDATE_OFFSET',

  //  Modal
  SET_MODAL_ACTIVE: 'SET_MODAL_ACTIVE',
  SET_MODAL_INACTIVE: 'SET_MODAL_INACTIVE',
};

export const getGraphs = function() {
  return {
    type: reviewsActions.GET_GRAPHS,
  };
};

export const getRecentCritical = function() {
  return {
    type: reviewsActions.GET_RECENT_CRITICAL,
  };
};

export const getReviews = function() {
  return {
    type: reviewsActions.GET_REVIEWS,
  };
};

export const getReviewsCount = function() {
  return {
    type: reviewsActions.GET_REVIEWS_COUNT,
  };
};

export const clearReviews = function() {
  return {
    type: reviewsActions.CLEAR_REVIEWS,
  };
};

export const setFilters = function(filters) {
  return {
    type: reviewsActions.SET_FILTERS,
    filters,
  };
};

export const clearFilters = function() {
  return {
    type: reviewsActions.CLEAR_FILTERS,
  };
};

export const dismissReview = function(review_id) {
  return {
    type: reviewsActions.DISMISS_REVIEW,
    review_id,
  };
};

export const recordResponse = function(review_id, response_id) {
  return {
    type: reviewsActions.RECORD_RESPONSE,
    review_id,
    response_id,
  };
};

export const bookmarkReview = function(review_id, is_bookmarked) {
  return {
    type: reviewsActions.BOOKMARK_REVIEW,
    review_id,
    is_bookmarked,
  };
};

export const showModal = function(review) {
  return {
    type: reviewsActions.SET_MODAL_ACTIVE,
    review,
  };
};

export const hideModal = function() {
  return {
    type: reviewsActions.SET_MODAL_INACTIVE,
  };
};

export default reviewsActions;
