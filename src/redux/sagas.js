import { all } from 'redux-saga/effects';
import appSagas from './app/saga';
import authSagas from './auth/saga';
import tagsSagas from './tags/saga';
import reviewsSagas from './reviews/saga';
import commentsSagas from './comments/saga';
import productsSagas from './products/saga';
import settingsSagas from './settings/saga';

export default function* rootSaga(getState) {
  yield all([
    appSagas(),
    authSagas(),
    tagsSagas(),
    reviewsSagas(),
    commentsSagas(),
    productsSagas(),
    settingsSagas(),
  ]);
}
