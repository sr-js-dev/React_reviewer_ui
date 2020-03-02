import _ from 'lodash';
import actions from './actions';
import tagActions from '../tags/actions';

const DEFAULT_FILTERS = {
  search: null,
  sort_by: null,
  marketplace: null,
};

const initState = {
  recent: [],
  comments: [],
  commentsLoading: false,
  filterLoading: false,
  filters: DEFAULT_FILTERS,

  offset: 0,
  count: null,

  //  modal
  modalActive: false,
  modalComment: {},
  comment_error: null,
};

/**
 * Insert reviews at the right place
 *
 * @param {array} reviews
 */
function processIncomingComments({ offset, comments }, newComments) {
  if (offset === 0) {
    return newComments;
  }

  return _.concat(comments, newComments);
}

export default function commentsReducer(state = initState, action) {
  switch (action.type) {
    case actions.SET_RECENT:
      return {
        ...state,
        recent: action.recent,
        comment_error: null,
      };

    case actions.CLEAR_COMMENTS:
      return {
        ...state,
        comments: [],
        offset: 0,
      };

    case actions.SET_COMMENTS:
      const comments = processIncomingComments(state, action.comments);
      const offset = comments.length;

      return {
        ...state,
        comments,
        offset,
        comment_error: null,
      };

    case actions.SET_COMMENTS_COUNT:
      return {
        ...state,
        count: action.count,
      };

    case actions.SET_COMMENTS_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.filters,
        },
        offset: 0,
        comments: [],
        filterLoading: true,
      };

    case actions.CLEAR_COMMENTS_FILTERS:
      return {
        ...state,
        filters: DEFAULT_FILTERS,
        offset: 0,
        comments: [],
      };

    /**
     * Loading indicators
     */
    case actions.SET_COMMENTS_LOADING:
      return {
        ...state,
        commentsLoading: true,
      };
    case actions.SET_COMMENTS_LOADED:
      return {
        ...state,
        commentsLoading: false,
        filterLoading: false,
      };

    /**
     * Modal
     */

    case actions.SET_COMMENTS_MODAL_ACTIVE:
      return {
        ...state,
        modalActive: true,
        modalComment: action.comment,
      };
    case actions.SET_COMMENTS_MODAL_INACTIVE:
      return {
        ...state,
        modalActive: false,
        modalComment: {},
      };
    case actions.SHOW_COMMENT_ERROR:
      return {
        ...state,
        comment_error: action.error,
      };
    case tagActions.SELECT_TAG:
      return {
        ...state,
        offset: 0,
        comments: [],
        count: 0,
      };
    default:
      return state;
  }
}
