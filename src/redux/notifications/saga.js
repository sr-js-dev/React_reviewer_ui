import { all, takeEvery, fork, call, put } from 'redux-saga/effects';
import actions from './actions';
import UserService from '../../services/UserService';
import ListingService from '../../services/ListingService';

export function* disabledNotificationRequest() {
  yield takeEvery(actions.SET_NOTIFICATION_DISABLED, function*(payload) {
    yield call(UserService.setNotificationDisabled, payload.id);
    yield put({
      type: actions.DISMISS_NOTIFICATION_LOCAL,
      id: payload.id,
    });
  });
}

export function* getNotificationsRequest() {
  yield takeEvery(actions.GET_NOTIFICATIONS, function*(payload) {
    const notifications = yield call(UserService.getNotifications);
    yield put({
      type: actions.SET_NOTIFICATIONS,
      notifications,
    });
  });
}

export function* getListingNotificationsRequest() {
  yield takeEvery(actions.GET_LISTING_NOTIFICATIONS, function*(payload) {
    const response = yield call(
      ListingService.getListingNotifications,
      payload.id,
      payload.currentPage
    );
    yield put({
      type: actions.SET_LISTING_NOTIFICATIONS,
      listingNotifications: response.notifications,
      totalListingNotifications: response.total_notifications,
    });
  });
}

export function* clearAllNotificationsRequest() {
  yield takeEvery(actions.CLEAR_ALL_NOTIFICATION, function*(payload) {
    yield call(UserService.clearAllNotifications, payload.id);
    yield put({
      type: actions.CLEAR_ALL_NOTIFICATION_SUCCESS,
    });
  });
}

export function* disabledListingNotifications() {
  yield takeEvery(actions.DISABLE_LISTING_NOTIFICATION, function*(payload) {
    const id = payload.parameters.id;
    const currentPage =
      payload.parameters.currentPage === 1
        ? payload.parameters.currentPage
        : payload.parameters.currentPage - 1;
    const total_notifications = payload.parameters.totalRecordsOnPage;
    const listingId = payload.parameters.listingId;

    yield call(ListingService.setNotificationDisabled, id);
    yield put({
      type: actions.DISABLE_LISTING_NOTIFICATION_LOCAL,
      id: payload.parameters.id,
    });

    if (total_notifications - 1 <= 1) {
      const response = yield call(
        ListingService.getListingNotifications,
        listingId,
        currentPage
      );
      yield put({
        type: actions.SET_LISTING_NOTIFICATIONS,
        listingNotifications: response.notifications,
        totalListingNotifications: response.total_notifications,
      });
    }
  });
}

export function* clearAllListingNotificationsRequest() {
  yield takeEvery(actions.CLEAR_ALL_LISTING_NOTIFICATION, function*(payload) {
    yield call(ListingService.setListingNotificationsDisabled, payload.id);
    yield put({
      type: actions.CLEAR_ALL_LISTING_NOTIFICATION_SUCCESS,
      listingNotifications: [],
    });
  });
}

export default function* rootSaga() {
  yield all([
    fork(disabledNotificationRequest),
    fork(getNotificationsRequest),
    fork(getListingNotificationsRequest),
    fork(clearAllNotificationsRequest),
    fork(disabledListingNotifications),
    fork(clearAllListingNotificationsRequest),
  ]);
}
