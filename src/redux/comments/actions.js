const commentsActions = {
  GET_RECENT: 'GET_RECENT',
  SET_RECENT: 'SET_RECENT',
  CLEAR_COMMENTS: 'CLEAR_COMMENTS',
  GET_COMMENTS: 'GET_COMMENTS',
  SET_COMMENTS: 'SET_COMMENTS',
  SET_COMMENTS_LOADING: 'SET_COMMENTS_LOADING',
  SET_COMMENTS_LOADED: 'SET_COMMENTS_LOADED',

  SET_COMMENTS_FILTERS: 'SET_COMMENTS_FILTERS',
  CLEAR_COMMENTS_FILTERS: 'CLEAR_COMMENTS_FILTERS',

  //  Count
  GET_COMMENTS_COUNT: 'GET_COMMENTS_COUNT',
  SET_COMMENTS_COUNT: 'SET_COMMENTS_COUNT',

  //  modal
  SET_COMMENTS_MODAL_ACTIVE: 'SET_COMMENTS_MODAL_ACTIVE',
  SET_COMMENTS_MODAL_INACTIVE: 'SET_COMMENTS_MODAL_INACTIVE',
  SHOW_COMMENT_ERROR: 'SHOW_COMMENT_ERROR',
};

export const getRecent = function() {
  return {
    type: commentsActions.GET_RECENT,
  };
};

export const getComments = function() {
  return {
    type: commentsActions.GET_COMMENTS,
  };
};

export const getCommentsCount = function() {
  return {
    type: commentsActions.GET_COMMENTS_COUNT,
  };
};

export const setFilters = function(filters) {
  return {
    type: commentsActions.SET_COMMENTS_FILTERS,
    filters,
  };
};

export const clearFilters = function() {
  return {
    type: commentsActions.CLEAR_COMMENTS_FILTERS,
  };
};

export const showModal = function(comment) {
  return {
    type: commentsActions.SET_COMMENTS_MODAL_ACTIVE,
    comment,
  };
};

export const hideModal = function(comment) {
  return {
    type: commentsActions.SET_COMMENTS_MODAL_INACTIVE,
  };
};

export default commentsActions;
