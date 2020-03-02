import { all, takeEvery, put, fork, call, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { getToken, clearToken } from '../../helpers/utility';
import actions from './actions';
import SecurityService from '../../services/SecurityService';
import UserService from '../../services/UserService';

/*
 * Selector. The query depends by the state shape
 */
export const getRouterState = (state) => state.router;


export function* loginRequest() {
  yield takeEvery('LOGIN_REQUEST', function*(payload) {
    const token = yield call(SecurityService.authenticate, payload.credentials.user, payload.credentials.pass);
    if(token['error']) {
      yield put({
        type: actions.LOGIN_ERROR,
        error: token['error']
      });
    } else {
      if(token !== 'demo') {
        yield put({
          type: actions.LOGIN_SUCCESS,
          token: token,
          profile: 'Profile'
        });
      }
      yield put(push('/reservations'));
    }

  });
}

export function* signupRequest() {
  yield takeEvery('SIGNUP_REQUEST', function*(payload) {
    const user = yield call(UserService.signupUser, payload.credentials);

    if(user['error']) {
      yield put({
        type: actions.SIGNUP_ERROR,
        error: user['error']
      });
    } else {
      const token = yield call(SecurityService.authenticate, user.email, payload.credentials.pass);
      if(token !== 'demo') {
        yield put({
          type: actions.LOGIN_SUCCESS,
          token: token,
          profile: 'Profile'
        });
      }
      yield localStorage.setItem('id_token', token);
      try {
        console.log('getCurrentUser auth saga')
        const user = yield call(UserService.getCurrentUser);
        yield put({
          type: actions.SET_USER,
          user: user
        });
        if(getToken()) {
          yield checkUserSignup(user);
          // yield put(push('/dashboard'));
        }
      } catch(err) {
        console.log("getting user err");
        console.log(err);
        clearToken();
        yield put(push('/'));
      }
    }
  });
}

export function* loginSuccess() {
  // console.log("Logged in!");
  yield takeEvery(actions.LOGIN_SUCCESS, function*(payload) {
    yield localStorage.setItem('id_token', payload.token);
    try {
      const user = yield call(UserService.getCurrentUser);
      yield put({
        type: actions.SET_USER,
        user: user
      });
      if(getToken() && !user.demo_user) {
        yield checkUserSignup(user);
        // yield put(push('/dashboard'));
      }
    } catch(err) {
      console.log("getting user err");
      console.log(err);
      clearToken();
      yield put(push('/login'));
    }
  });
}

/**
 * When user object is available, check
 * if anything is wrong with it and redirect to
 * a page where user can fill missing info
 *
 * @param {object} user - current user
 */
export function* checkUserSignup(user) {

  // if ( user && !user.property_id ) {
  //   yield put(push( '/dashboard/settings?tab=Property&n=true') );
  // }
}

export function* forgotPassword() {
  yield takeEvery(actions.FORGOT_PASSWORD_REQUEST, function* (payload) {
    const response = yield call(UserService.forgotPassword, {email: payload.email});
    const status = response.status !== 422;
    const data = {
      success: status,
      msg: response.data.msg
    };
    yield put({
      type: actions.FORGOT_PASSWORD_RESPONSE,
      ...data
    });
  })
}

export function* checkResetPasswordToken() {
  yield takeEvery(actions.CHECK_RESET_PASS_TOKEN_REQ, function* (payload) {
    const response = yield call(UserService.chechResetPasswordToken, payload.token);
    yield put({
      type: actions.CHECK_RESET_PASS_TOKEN_RES,
      success: response.status !== 422
    })
  });
}

export function* resetPassword() {
  yield takeEvery(actions.RESET_PASSWORD_REQUEST, function* (payload) {
    yield put({
      type: actions.RESET_PASSWORD_RESPONSE,
      success: null,
      message: null
    });
    const response = yield call(UserService.resetPassword, payload.data);
    yield put({
      type: actions.RESET_PASSWORD_RESPONSE,
      success: response.status !== 422,
      message: response.data.msg
    })
  })
}

export function* loginError() {
  yield takeEvery(actions.LOGIN_ERROR, function*() {});
}

export function* logout() {
  yield takeLatest(actions.LOGOUT, function*() {
    console.log("Logging out");
    clearToken();
    yield put(push('/login'));
  });
}
export function* checkAuthorization() {
  yield takeEvery(actions.CHECK_AUTHORIZATION, function*() {
    const token = getToken().get('idToken');
    if (token && token !== 'demo') {
      yield put({
        type: actions.LOGIN_SUCCESS,
        token,
        profile: 'Profile'
      });
    }
  });
}
export default function* rootSaga() {
  yield all([
    fork(checkAuthorization),
    fork(loginRequest),
    fork(signupRequest),
    fork(loginSuccess),
    fork(loginError),
    fork(logout),
    fork(forgotPassword),
    fork(checkResetPasswordToken),
    fork(resetPassword)
  ]);
}
