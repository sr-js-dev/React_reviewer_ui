import { all, takeEvery, fork, call, put } from 'redux-saga/effects';

import AppService from '../../services/AppService';
import UserService from '../../services/UserService';

import actions from './actions';
import authActions from '../auth/actions';

export function* getPlansRequest() {
  yield takeEvery(actions.GET_PLANS, function*(payload) {
    const plans = yield call(AppService.plans);

    yield put({
      type: actions.SET_PLANS,
      plans: plans,
    });
  });
}

export function* getUpdatePlanRequest() {
  yield takeEvery(actions.UPDATE_PLAN, function*(payload) {
    const user = yield call(UserService.setPlan, payload.plan);
    if (user.error && user.error.length > 0) {
      yield put({
        type: actions.SHOW_PRODUCT_REMOVE_NOTIFICATION,
        notificationMsg: {
          title: 'Remove Products',
          msg: user.error,
        },
        showNotification: true,
      });
    } else {
      if (user) {
        yield put({
          type: authActions.SET_USER,
          user: user,
        });
      }

      yield put({
        type: actions.UPDATE_PLAN_COMPLETED,
      });

      // if a user selects the free plan, have them enter a property next, otherwise enter billing details
      if (payload.plan.plan_type === 'free') {
        yield put({
          type: actions.CHANGE_SETTING,
          selectedSetting: 'Subscription',
        });
        //  If payment method is not set and user selected plan that is not free, prompt to set it
      } else if (
        (user.settings.monthly_amount || user.settings.yearly_amount) &&
        (user.settings.monthly_amount > 0 || user.settings.yearly_amount > 0)
      ) {
        yield put({
          type: actions.CHANGE_SETTING,
          selectedSetting: 'Billing',
          notificationMsg: actions.BILLING_MESSAGE,
          showNotification: true,
        });
      }
    }
  });
}

export function* getBillingRequest() {
  yield takeEvery(actions.GET_BILLING, function*(payload) {
    const billing = yield call(UserService.billing);
    yield put({
      type: actions.SET_BILLING,
      billing: billing,
    });
  });
}

export function* getAddBillingRequest() {
  yield takeEvery(actions.ADD_BILLING, function*(payload) {
    const user = yield call(UserService.addBilling, payload.stripeToken);

    if (user['error']) {
      yield put({
        type: actions.BILLING_ERROR,
        error: user['error'],
      });
    } else {
      yield put({
        type: authActions.SET_USER,
        user: user,
      });
      yield put({
        type: actions.GET_BILLING,
      });
      yield put({
        type: actions.GET_TRANSACTION_HISTORY,
      });
    }
  });
}

export function* sendContactMailRequest() {
  yield takeEvery(actions.SEND_CONTACT_MAIL, function*(payload) {
    const result = yield call(AppService.sendContactEmail, payload.contactForm);

    if (result['error']) {
      yield put({
        type: actions.SEND_CONTACT_ERROR,
        error: result['error'],
      });
    } else {
      yield put({
        type: actions.TOGGLE_CONTACT_MODAL,
      });
    }
  });
}

export function* saveUserProfileRequest() {
  yield takeEvery(actions.SAVE_USER_PROFILE, function*(payload) {
    const userData = { settings: payload.userForm };
    const result = yield call(UserService.saveUserProfile, userData);
    if (result['error']) {
      yield put({
        type: actions.SAVE_USER_PROFILE_ERROR,
        error: result['error'],
      });
    } else {
      yield put({
        type: authActions.SET_USER,
        user: result,
      });
      const keys = Object.keys(payload.userForm);
      if (keys.length !== 1 && keys['0'] !== 'show_tour') {
        yield put({
          type: actions.SAVE_USER_PROFILE_SUCCESS,
        });
      }
    }
  });
}

/**
 * Get transaction history for `dashboard/settings?tab=Billing`
 */
export function* getTransactionHistory() {
  //  Take every action of GET_TRANSACTION_HISTORY
  yield takeEvery(actions.GET_TRANSACTION_HISTORY, function*() {
    //  Get history from API
    const transactionHistory = yield call(UserService.billing_history);
    //  Apply loaded history to state
    yield put({
      type: actions.SET_TRANSACTION_HISTORY,
      transactionHistory,
    });
  });
}

export default function* rootSaga() {
  yield all([
    fork(getUpdatePlanRequest),
    fork(getAddBillingRequest),
    fork(getPlansRequest),
    fork(getBillingRequest),
    fork(sendContactMailRequest),
    fork(saveUserProfileRequest),

    fork(getTransactionHistory),
  ]);
}
