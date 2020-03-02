import { getDefaultPath } from '../../helpers/urlSync';
import actions, { getView } from './actions';
import update from 'immutability-helper';
import _ from 'lodash';

const preKeys = getDefaultPath();

const initState = {
  collapsed: false,
  view: getView(window.innerWidth),
  height: window.innerHeight,
  width: window.innerWidth,
  openDrawer: false,
  openKeys: preKeys,
  current: preKeys,
  propertySelectorLoading: false,
  menuActive: false,
  windowScrolled: false,

  //
  savedResponses: [],
  savedResponsesModalVisible: false,

  defaultMarketplace: 'US',
  marketplaces: [],
  marketplacesLoading: false,

  toasts: [],

  queryParams: {},

  mainPaddingTop: '3.75rem',
};

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.RESIZE:
      return {
        ...state,
        width: action.width,
        height: action.height,
        collapsed: action.collapsed,
        view: getView(action.width),
      };

    case actions.SHOW_MENU:
      return {
        ...state,
        menuActive: true,
      };

    case actions.HIDE_MENU:
      return {
        ...state,
        menuActive: false,
      };

    case actions.SET_SAVED_RESPONSES:
      return {
        ...state,
        savedResponses: action.savedResponses,
      };

    case actions.PUSH_SAVED_RESPONSE:
      return {
        ...state,
        savedResponses: _.concat([action.saved_response], state.savedResponses),
      };

    case actions.REPLACE_SAVED_RESPONSE:
      return {
        ...state,
        savedResponses: _.map(state.savedResponses, response => {
          if (response && action.saved_response.id === response.id) {
            return action.saved_response;
          } else {
            return response;
          }
        }),
      };

    case actions.SHOW_SAVED_RESPONSES_MODAL:
      return {
        ...state,
        savedResponsesModalVisible: true,
      };

    case actions.HIDE_SAVED_RESPONSES_MODAL:
      return {
        ...state,
        savedResponsesModalVisible: false,
      };

    case actions.SET_MARKETPLACES:
      return {
        ...state,
        marketplaces: action.marketplaces,
      };
    case actions.SET_MARKETPLACES_LOADING:
      return {
        ...state,
        marketplacesLoading: true,
      };
    case actions.SET_MARKETPLACES_LOADED:
      return {
        ...state,
        marketplacesLoading: false,
      };

    case actions.ADD_TOAST:
      return {
        ...state,
        toasts: _.includes(state.toasts, action.toast)
          ? [...state.toasts]
          : [...state.toasts, action.toast],
      };

    case actions.DISMISS_TOAST:
      return {
        ...state,
        toasts: _.map(state.toasts, o => {
          if (o.id === action.toast.id) {
            o.dismissed = true;
          }
          return o;
        }),
      };

    case actions.REMOVE_TOAST:
      return {
        ...state,
        toasts: _.reject(state.toasts, { id: action.toast.id }),
      };

    case actions.SET_WINDOW_SCROLLED:
      return {
        ...state,
        windowScrolled: action.windowScrolled,
      };

    case actions.SET_QUERY_PARAMS:
      const queryParams =
        action.queryParams !== 'clear'
          ? update(state.queryParams, action.updateParams)
          : {};

      return {
        ...state,
        queryParams,
      };

    case actions.SET_MAIN_PADDING_TOP:
      return {
        ...state,
        mainPaddingTop: action.mainPaddingTop,
      };

    default:
      return state;
  }
}
