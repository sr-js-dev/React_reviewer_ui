import _ from 'lodash';
import {
  all,
  takeEvery,
  put,
  fork,
  call,
  select,
  debounce,
} from 'redux-saga/effects';
import actions from './actions';
import appActions from '../app/actions';
import CommentsService from '../../services/CommentsService';
import { isNullOrEmpty } from '../../helpers/utility';

/**
 * Returns filter params for Reviews/index call
 *
 * @param {object} state - redux state
 */
export const getParams = state => {
  let params = {
    offset: state.Comments.offset,
  };

  for (const key in state.Comments.filters) {
    if (state.Comments.filters.hasOwnProperty(key)) {
      const element = state.Comments.filters[key];

      if (element != null) params[key] = element;
    }
  }

  return params;
};

export const getFilters = state => {
  return state.Comments.filters;
};

export function* getRecent() {
  yield takeEvery(actions.GET_RECENT, function*() {
    yield put({
      type: actions.SET_COMMENTS_LOADING,
    });

    const recent = yield call(CommentsService.recent);
    if (recent.error && recent.error.length > 0) {
      yield put({
        type: actions.SHOW_COMMENT_ERROR,
        error: recent.error,
      });
    } else {
      yield put({
        type: actions.SET_RECENT,
        recent,
      });
    }
    yield put({
      type: actions.SET_COMMENTS_LOADED,
    });
  });
}

export function* getComments() {
  yield takeEvery(actions.GET_COMMENTS, function*() {
    yield put({
      type: actions.SET_COMMENTS_LOADING,
    });

    // yield delay(1000);

    const params = yield select(getParams);

    const comments = yield call(CommentsService.index, params);
    if (comments.error && comments.error.length > 0) {
      yield put({
        type: actions.SHOW_COMMENT_ERROR,
        error: comments.error,
      });
    } else {
      yield put({
        type: actions.SET_COMMENTS,
        comments: typeof comments === 'undefined' ? [] : comments,
      });
    }

    yield put({
      type: actions.SET_COMMENTS_LOADED,
    });
  });
}

export function* getCommentsCount() {
  yield takeEvery(actions.GET_COMMENTS_COUNT, function*() {
    const params = yield select(getParams);
    const count = yield call(CommentsService.count, params);

    yield put({
      type: actions.SET_COMMENTS_COUNT,
      count,
    });
  });
}

function* updateComment() {
  yield put({ type: actions.GET_COMMENTS });
  yield put({ type: actions.GET_COMMENTS_COUNT });
}

export function* setFilters() {
  yield debounce(600, actions.SET_COMMENTS_FILTERS, updateComment);

  yield takeEvery(actions.SET_COMMENTS_FILTERS, function*(payload) {
    const filters = yield select(getFilters);

    const updateParams = {
      $merge: _.omitBy(filters, isNullOrEmpty),
      $unset: Object.keys(_.pickBy(filters, isNullOrEmpty)),
    };

    yield put({
      type: appActions.SET_QUERY_PARAMS,
      updateParams,
    });
  });
}

export default function* rootSaga() {
  yield all([
    fork(getRecent),
    fork(getComments),
    fork(setFilters),
    fork(getCommentsCount),
  ]);
}
