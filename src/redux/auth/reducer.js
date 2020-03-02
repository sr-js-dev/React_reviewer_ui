import actions from "./actions";

const initState = {
  idToken: null,
  currentUser: null,
  signupError: null,
  loginError: null,
  loadingSignup: false,
  forgotPasswordSuccess: null,
  forgotPasswordMsg: null,
  resetPasswordTokenValid: null,
  resetPasswordSuccess: null,
  resetPasswordMsg: null
};

export default function authReducer(state = initState, action) {
  switch (action.type) {
    case actions.SIGNUP_REQUEST:
      return {
        ...state,
        loadingSignup: true
      };
    case actions.LOGIN_REQUEST:
      return {
        ...state,
        loadingSignup: true
      };
    case actions.LOGIN_SUCCESS:
      return {
        idToken: action.token,
        loadingSignup: false
      };
    case actions.LOGIN_ERROR:
      return {
        ...state,
        loginError: action.error,
        loadingSignup: false
      };
    case actions.FORGOT_PASSWORD_RESPONSE:
      return {
        ...state,
        forgotPasswordSuccess: action.success,
        forgotPasswordMsg: action.msg
      };
    case actions.CHECK_RESET_PASS_TOKEN_RES:
      return {
        ...state,
        resetPasswordTokenValid: action.success
      };
    case actions.RESET_PASSWORD_RESPONSE:
      return {
        ...state,
        resetPasswordSuccess: action.success,
        resetPasswordMsg: action.message
      };
    case actions.SET_USER:
      return {
        ...state,
        currentUser: action.user
      };
    case actions.LOGOUT:
      return initState;
    case actions.SIGNUP_ERROR:
      return {
        ...state,
        signupError: action.error,
        loadingSignup: false
      };
    default:
      return state;
  }
}
