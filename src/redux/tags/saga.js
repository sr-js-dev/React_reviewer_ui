import { all, takeEvery, put, fork, call, select } from 'redux-saga/effects';
import actions from './actions';

import reviewsActions from '../reviews/actions';
import commentsActions from '../comments/actions';
import productsActions from '../products/actions';
import appActions from '../app/actions';

import TagsService from '../../services/TagsService';

/*
 * Selector. The query depends by the state shape
 */
export const getRouterState = state => state.router;

export function* getTags() {
  yield takeEvery(actions.GET_TAGS, function*() {
    yield put({
      type: actions.SET_TAGS_LOADING,
    });

    const tags = yield call(TagsService.get);

    yield put({
      type: actions.SET_TAGS,
      tags,
    });

    yield put({
      type: actions.SET_TAGS_LOADED,
    });
  });
}

export function* selectTag() {
  yield takeEvery(actions.SELECT_TAG, function*(payload) {
    console.log(`SELECTED TAG: ${payload.tag}`);
    localStorage.setItem('selected_tag', payload.tag);

    if (payload.tag === 'all') {
      yield put({
        type: appActions.SET_QUERY_PARAMS,
        updateParams: { $unset: ['tag'] },
      });
    } else {
      yield put({
        type: appActions.SET_QUERY_PARAMS,
        updateParams: { $merge: { tag: payload.tag } },
      });
    }

    if (payload.updateData) {
      const router = yield select(getRouterState);

      if (!router) {
        return;
      }

      switch (router.location.pathname) {
        case '/dashboard':
          yield put({ type: reviewsActions.GET_RECENT_CRITICAL });
          yield put({ type: commentsActions.GET_RECENT });
          yield put({ type: reviewsActions.GET_GRAPHS });

          break;
        case '/products':
          yield put({ type: productsActions.CLEAR_PRODUCTS });
          yield put({ type: productsActions.GET_PRODUCTS });
          yield put({ type: productsActions.GET_PRODUCTS_COUNT });
          yield put({ type: productsActions.SELECT_PRODUCT, ids: 'remove' });

          break;
        case '/reviews':
          yield put({ type: reviewsActions.CLEAR_REVIEWS });
          yield put({ type: reviewsActions.GET_REVIEWS });
          yield put({ type: reviewsActions.GET_REVIEWS_COUNT });

          break;
        case '/comments':
          yield put({ type: commentsActions.CLEAR_COMMENTS });
          yield put({ type: commentsActions.GET_COMMENTS });
          yield put({ type: commentsActions.GET_COMMENTS_COUNT });

          break;
        default:
          break;
      }
    }
  });
}

export default function* rootSaga() {
  yield all([fork(getTags), fork(selectTag)]);
}
