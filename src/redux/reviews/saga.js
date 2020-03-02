import _ from 'lodash';
import {
  all,
  takeEvery,
  put,
  fork,
  call,
  delay,
  select,
  debounce,
} from 'redux-saga/effects';

import actions from './actions';
import appActions from '../app/actions';

import ReviewsService from '../../services/ReviewsService';
import { isNullOrEmpty } from '../../helpers/utility';

export const getReviewsState = state => state.Reviews;

export const getFilters = state => {
  return state.Reviews.filters;
};

/**
 * Returns filter params for Reviews/index call
 *
 * @param {object} state - redux state
 */
export const getParams = state => {
  let params = {
    offset: state.Reviews.offset,
  };

  for (const key in state.Reviews.filters) {
    if (state.Reviews.filters.hasOwnProperty(key)) {
      const element = state.Reviews.filters[key];

      if (element != null) params[key] = element;
    }
  }

  return params;
};

export function* getGraphs() {
  yield takeEvery(actions.GET_GRAPHS, function*() {
    yield put({
      type: actions.SET_GRAPHS_LOADING,
    });

    const graphs = yield call(ReviewsService.dashboard_graphs);

    yield put({
      type: actions.SET_GRAPHS,
      graphs,
    });

    yield put({
      type: actions.SET_GRAPHS_LOADED,
    });
  });
}

export function* getRecentCritical() {
  yield takeEvery(actions.GET_RECENT_CRITICAL, function*() {
    yield put({
      type: actions.SET_REVIEWS_LOADING,
    });

    yield delay(1000);

    const { reviews } = yield call(ReviewsService.recent_critical);

    yield put({
      type: actions.SET_RECENT_CRITICAL,
      reviews,
    });

    yield put({
      type: actions.SET_REVIEWS_LOADED,
    });
  });
}

export function* getReviews() {
  yield takeEvery(actions.GET_REVIEWS, function*(payload) {
    yield put({
      type: actions.SET_REVIEWS_LOADING,
    });

    // yield delay(1000);

    const params = yield select(getParams);

    const { reviews } = yield call(ReviewsService.index, params);

    yield put({
      type: actions.SET_REVIEWS,
      reviews,
    });

    yield put({
      type: actions.SET_REVIEWS_LOADED,
    });
  });
}

export function* getReviewsCount() {
  yield takeEvery(actions.GET_REVIEWS_COUNT, function*() {
    const params = yield select(getParams);
    const count = yield call(ReviewsService.count, params);

    yield put({
      type: actions.SET_REVIEWS_COUNT,
      count,
    });
  });
}

export function* recordResponse() {
  yield takeEvery(actions.RECORD_RESPONSE, function*(payload) {
    yield call(ReviewsService.record_response, {
      review_id: payload.review_id,
      params: {
        saved_review_response_id: payload.response_id,
      },
    });
  });
}

export function* dismissReview() {
  yield takeEvery(actions.DISMISS_REVIEW, function*(payload) {
    yield call(ReviewsService.patch, {
      review_id: payload.review_id,
      params: {
        is_ignored: true,
      },
    });
  });
}

export function* bookmarkReview() {
  yield takeEvery(actions.BOOKMARK_REVIEW, function*(payload) {
    yield call(ReviewsService.patch, {
      review_id: payload.review_id,
      params: {
        is_bookmarked: !payload.is_bookmarked,
      },
    });
  });
}

function* updateReviews() {
  yield put({ type: actions.GET_REVIEWS });
  yield put({ type: actions.GET_REVIEWS_COUNT });
}

export function* setFilters() {
  yield debounce(600, actions.SET_FILTERS, updateReviews);

  yield takeEvery(actions.SET_FILTERS, function*(payload) {
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
    fork(getGraphs),
    fork(getReviews),
    fork(getReviewsCount),
    fork(getRecentCritical),
    fork(setFilters),
    fork(recordResponse),
    fork(dismissReview),
    fork(bookmarkReview),
  ]);
}
