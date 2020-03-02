import _ from 'lodash';
import {
  all,
  takeEvery,
  takeLatest,
  put,
  fork,
  call,
  delay,
  select,
  debounce,
  cancel,
} from 'redux-saga/effects';
import actions from './actions';
import appActions from '../app/actions';
import ProductsService from '../../services/ProductsService';
import NewAsinsService from '../../services/NewAsinsService';
import { isNullOrEmpty } from '../../helpers/utility';

/**
 * Returns filter params for Reviews/index call
 *
 * @param {object} state - redux state
 */
export const getParams = state => {
  let params = {
    offset: state.Products.offset,
  };

  for (const key in state.Products.filters) {
    if (state.Products.filters.hasOwnProperty(key)) {
      const element = state.Products.filters[key];

      if (element != null) params[key] = element;
    }
  }

  return params;
};

export const getFilters = state => {
  return state.Products.filters;
};

export function* getProducts() {
  yield takeEvery(actions.GET_PRODUCTS, function*() {
    yield put({
      type: actions.SET_PRODUCTS_LOADING,
    });

    const params = yield select(getParams);

    const products = yield call(ProductsService.index, params);
    yield put({
      type: actions.SET_PRODUCTS,
      products: typeof products === 'undefined' ? [] : products,
    });

    yield put({
      type: actions.SET_PRODUCTS_LOADED,
    });
  });
}

export function* removeProducts() {
  yield takeEvery(actions.REMOVE_PRODUCTS, function*(payload) {
    yield put({
      type: actions.SET_PRODUCTS_LOADING,
    });

    yield put({
      type: actions.CLEAR_PRODUCTS,
    });

    yield put({
      type: actions.SELECT_PRODUCT,
      ids: 'remove',
    });

    yield call(ProductsService.delete_multiple, {
      ids: payload.ids.join(','),
    });

    yield put({
      type: actions.GET_PRODUCTS,
    });

    yield put({
      type: actions.GET_PRODUCTS_COUNT,
    });
  });
}

export function* getProductsCount() {
  yield takeEvery(actions.GET_PRODUCTS_COUNT, function*() {
    const params = yield select(getParams);
    const count = yield call(ProductsService.count, params);

    yield put({
      type: actions.SET_PRODUCTS_COUNT,
      count,
    });
  });
}

function* updateTotalProductsCount() {
  const totalCount = yield call(ProductsService.total_user_product_count);

  yield put({
    type: actions.SET_TOTAL_PRODUCTS_COUNT,
    totalCount,
  });
}

export function* getTotalProductsCount() {
  yield debounce(
    1000,
    actions.GET_TOTAL_PRODUCTS_COUNT,
    updateTotalProductsCount
  );
}

function* updateProducts() {
  yield put({ type: actions.SELECT_PRODUCT, ids: 'remove' });
  yield put({ type: actions.GET_PRODUCTS });
  yield put({ type: actions.GET_PRODUCTS_COUNT });
}

export function* setFilters() {
  yield debounce(600, actions.SET_PRODUCTS_FILTERS, updateProducts);

  yield takeEvery(actions.SET_PRODUCTS_FILTERS, function*(payload) {
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

/**
 * ASINs polling part
 *
 */

const tasks = {};

/**
 * Get current polling state
 *
 * @param {Object} state - redux state
 */
export const getPrevProcessing = state => {
  return state.Products.prevAsinsProcessing;
};

/**
 * Get current polling delay
 *
 * @param {Object} state - redux state
 */
export const getAsinPollDelay = state => {
  return state.Products.pollDelay;
};

/**
 * This function starts polling
 */
export function* getAsinProgress() {
  yield takeLatest(actions.GET_ASIN_PROGRESS, function*() {
    tasks.asinsPoll = yield fork(asinsProgressLoop);
  });
}

export function* cancelAsinProgressPoll() {
  yield takeLatest(actions.CANCEL_ASIN_PROGRESS_POLL, function*() {
    yield cancel(tasks.asinsPoll);
  });
}

/**
 *  And this one stops it on complete message
 */
export function* setAsinProgress() {
  yield takeLatest(actions.SET_ASIN_PROGRESS, function*(payload) {
    const { asinProgress } = payload;
    const prevAsinsProcessing = yield select(getPrevProcessing);

    //  This will mean that processing has finished
    if (asinProgress.asins_processing === false) {
      //  If it has finished with an error, cancel polling
      if (asinProgress.error) {
        yield cancel(tasks.asinsPoll);
      }

      if (prevAsinsProcessing !== asinProgress.asins_processing) {
        //  We should update all data on products
        yield put({
          type: actions.CLEAR_PRODUCTS,
        });

        yield put({
          type: actions.GET_PRODUCTS,
        });

        yield put({
          type: actions.GET_PRODUCTS_COUNT,
        });
      }
    }
  });
}

/**
 * The issue with this pattern is that you can't
 * change the delay based on API response immediately
 * before yielding a delay()
 *
 * Since fork() creates non-blocking task,
 * we can't access it's result.
 *
 * And if we use call(), we'll be applying uneven delay
 * for our API calls.
 */
function* asinsProgressLoop() {
  while (true) {
    try {
      const pollDelay = yield select(getAsinPollDelay);

      yield fork(asinsAPICall);
      yield delay(pollDelay);
    } catch (e) {
      console.error(e);
    }
  }
}

function* asinsAPICall() {
  try {
    const asinProgress = yield call(NewAsinsService.poll);

    yield put({
      type: actions.SET_ASIN_PROGRESS,
      asinProgress,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: actions.SET_ASIN_PROGRESS,
      asinProgress: { asins_processing: false, error },
    });
  }
}

export default function* rootSaga() {
  yield all([
    fork(getProducts),
    fork(getProductsCount),
    fork(getTotalProductsCount),
    fork(setFilters),
    fork(removeProducts),
    fork(getAsinProgress),
    fork(setAsinProgress),
    fork(cancelAsinProgressPoll),
  ]);
}
