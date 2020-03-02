import { push, replace } from 'connected-react-router';

import {
  all,
  takeEvery,
  put,
  fork,
  call,
  delay,
  debounce,
  select,
} from 'redux-saga/effects';
import actions from './actions';
import authActions from '../auth/actions';

import SavedResponsesService from '../../services/SavedResponsesService';
import MarketplacesService from '../../services/MarketplacesService';
import UserService from '../../services/UserService';

/**
 * Returns query params
 *
 * @param {object} state - redux state
 */
export const getQueryParams = state => {
  return state.App.queryParams;
};

/**
 * Returns react-router location
 *
 * @param {object} state - redux state
 */
export const getLocation = state => {
  return state.router.location;
};

export function* getSavedResponses() {
  yield takeEvery(actions.GET_SAVED_RESPONSES, function*() {
    const savedResponses = yield call(SavedResponsesService.index);

    yield put({
      type: actions.SET_SAVED_RESPONSES,
      savedResponses,
    });
  });
}

export function* addSavedResponse() {
  yield takeEvery(actions.ADD_SAVED_RESPONSE, function*(payload) {
    const { saved_response } = yield call(SavedResponsesService.create, {
      response_text: payload.response_text,
    });

    yield put({
      type: actions.PUSH_SAVED_RESPONSE,
      saved_response,
    });
  });
}

export function* updateSavedResponse() {
  yield takeEvery(actions.UPDATE_SAVED_RESPONSE, function*(payload) {
    const { saved_response } = yield call(SavedResponsesService.update, {
      saved_response: payload.savedResponse,
    });

    yield put({
      type: actions.REPLACE_SAVED_RESPONSE,
      saved_response,
    });
  });
}

export function* removeSavedResponse() {
  yield takeEvery(actions.REMOVE_SAVED_RESPONSE, function*(payload) {
    const savedResponses = yield call(SavedResponsesService.remove, payload);
    if (savedResponses) {
      yield put({
        type: actions.GET_SAVED_RESPONSES,
      });
    }
  });
}

export function* updateSavedResponseOrder() {
  yield takeEvery(actions.UPDATE_SAVED_RESPONSES_ORDER, function*(payload) {
    const savedResponses = yield call(
      SavedResponsesService.updateOrder,
      payload.saved_responses
    );
    if (savedResponses) {
      yield put({
        type: actions.SET_SAVED_RESPONSES,
        savedResponses,
      });
    }
  });
}

/**
 * Dismiss toast after it's been added
 */
export function* addToast() {
  yield takeEvery(actions.ADD_TOAST, function*(payload) {
    const delayTime = payload.toast.delayTime || 3000;

    yield delay(delayTime);

    //  Dismiss toast with an animation
    yield put({
      type: actions.DISMISS_TOAST,
      toast: payload.toast,
    });
  });
}

export function* dismissToast() {
  yield takeEvery(actions.DISMISS_TOAST, function*(payload) {
    //  Animation will take about 400ms
    yield delay(400);
    //  Then remove the toast
    yield put({
      type: actions.REMOVE_TOAST,
      toast: payload.toast,
    });
  });
}

function* updateMarketplaces() {
  const marketplaces = yield call(MarketplacesService.index);

  yield put({
    type: actions.SET_MARKETPLACES,
    marketplaces,
  });
}

export function* getMarketplaces() {
  yield debounce(1000, actions.GET_MARKETPLACES, updateMarketplaces);
}

export function* getCurrentUser() {
  yield takeEvery(authActions.GET_CURRENT_USER, function*() {
    const user = yield call(UserService.getCurrentUser);

    yield put({
      type: authActions.SET_USER,
      user,
    });
  });
}

export function* setQueryParams() {
  yield takeEvery(actions.SET_QUERY_PARAMS, function*() {
    const currentParams = yield select(getQueryParams);
    const currentLocation = yield select(getLocation);

    const search = `?${new URLSearchParams(currentParams).toString()}`;

    yield put(
      push({
        pathname: currentLocation.pathname,
        search,
      })
    );
  });
}

export function* locationChange() {
  yield takeEvery('@@router/LOCATION_CHANGE', function*({ payload }) {
    if (payload.action === 'PUSH') {
      const currentParams = yield select(getQueryParams);
      const search = `?${new URLSearchParams(currentParams).toString()}`;

      yield put(
        replace({
          pathname: payload.location.pathname,
          search,
        })
      );
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(getSavedResponses),
    fork(addToast),
    fork(dismissToast),
    fork(addSavedResponse),
    fork(updateSavedResponse),
    fork(removeSavedResponse),
    fork(getMarketplaces),
    fork(getCurrentUser),
    fork(updateSavedResponseOrder),
    fork(setQueryParams),
    fork(locationChange),
  ]);
}
