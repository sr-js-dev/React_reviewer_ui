import shortid from 'shortid';
import moment from 'moment';
import tailwindConfig from '../../tailwind';
import _ from 'lodash';

export function getView(width) {
  let view = '3xl';

  _.each(Object.keys(tailwindConfig.screens).reverse(), key => {
    if (width <= parseInt(tailwindConfig.screens[key], 10)) {
      view = key;
    }
  });

  return view;
}

const actions = {
  RESIZE: 'RESIZE',
  SHOW_MENU: 'SHOW_MENU',
  HIDE_MENU: 'HIDE_MENU',

  GET_SAVED_RESPONSES: 'GET_SAVED_RESPONSES',
  SET_SAVED_RESPONSES: 'SET_SAVED_RESPONSES',
  ADD_SAVED_RESPONSE: 'ADD_SAVED_RESPONSE',
  PUSH_SAVED_RESPONSE: 'PUSH_SAVED_RESPONSE',
  REPLACE_SAVED_RESPONSE: 'REPLACE_SAVED_RESPONSE',
  UPDATE_SAVED_RESPONSE: 'UPDATE_SAVED_RESPONSE',
  REMOVE_SAVED_RESPONSE: 'REMOVE_SAVED_RESPONSE',
  UPDATE_SAVED_RESPONSES_ORDER: 'UPDATE_SAVED_RESPONSES_ORDER',
  SHOW_SAVED_RESPONSES_MODAL: 'SHOW_SAVED_RESPONSES_MODAL',
  HIDE_SAVED_RESPONSES_MODAL: 'HIDE_SAVED_RESPONSES_MODAL',

  GET_MARKETPLACES: 'GET_MARKETPLACES',
  SET_MARKETPLACES: 'SET_MARKETPLACES',
  SET_MARKETPLACES_LOADING: 'SET_MARKETPLACES_LOADING',
  SET_MARKETPLACES_LOADED: 'SET_MARKETPLACES_LOADED',

  ADD_TOAST: 'ADD_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',

  SET_WINDOW_SCROLLED: 'SET_WINDOW_SCROLLED',
  SET_QUERY_PARAMS: 'SET_QUERY_PARAMS',

  SET_MAIN_PADDING_TOP: 'SET_MAIN_PADDING_TOP',
};

const MOBILE_VIEWS = ['sm', 'md'];
export const EXTENDED_MOBILE = ['sm', 'md', 'lg'];

/**
 * returns true if mobile view needs to be rendered here and now
 *
 * @returns {boolean}
 */
export function isMobile(view, mobileViews = []) {
  const checkViews = mobileViews.length > 0 ? mobileViews : MOBILE_VIEWS;

  return checkViews.includes(view);
}

//  Set all viewport related properties on resize
export function resize(width, height, collapsedBreakpoint) {
  return {
    type: actions.RESIZE,
    collapsed: width < collapsedBreakpoint,
    width,
    height,
  };
}

//
export function showMenu() {
  return {
    type: actions.SHOW_MENU,
  };
}

export function hideMenu() {
  return {
    type: actions.HIDE_MENU,
  };
}

export function getSavedResponses() {
  return {
    type: actions.GET_SAVED_RESPONSES,
  };
}

export function addSavedResponse(response_text) {
  return {
    type: actions.ADD_SAVED_RESPONSE,
    response_text,
  };
}

export function updateSavedResponse(savedResponse) {
  return {
    type: actions.UPDATE_SAVED_RESPONSE,
    savedResponse,
  };
}

export function removeSavedResponse(saved_response) {
  return {
    type: actions.REMOVE_SAVED_RESPONSE,
    saved_response,
  };
}

export function updateSavedResponsesOrder(saved_responses) {
  return {
    type: actions.UPDATE_SAVED_RESPONSES_ORDER,
    saved_responses,
  };
}

export function showSavedResponsesModal() {
  return {
    type: actions.SHOW_SAVED_RESPONSES_MODAL,
  };
}

export function hideSavedResponsesModal() {
  return {
    type: actions.HIDE_SAVED_RESPONSES_MODAL,
  };
}

export function getMarketplaces() {
  return {
    type: actions.GET_MARKETPLACES,
  };
}

export function setMainPaddingTop(mainPaddingTop) {
  return {
    type: actions.SET_MAIN_PADDING_TOP,
    mainPaddingTop,
  };
}

export function addToast(toast) {
  const timeOnScreen = toast.delayTime || 2000;

  toast.id = shortid.generate();
  toast.time_added = moment().toISOString();
  toast.time_dismissed = moment(toast.time_added)
    .add(timeOnScreen, 'milliseconds')
    .toISOString();

  return {
    type: actions.ADD_TOAST,
    toast,
  };
}

export function dismissToast(id) {
  return {
    type: actions.DISMISS_TOAST,
    toast: { id },
  };
}

export function setWindowScrolled(windowScrolled) {
  return {
    type: actions.SET_WINDOW_SCROLLED,
    windowScrolled,
  };
}

export function setQueryParams(updateParams) {
  return {
    type: actions.SET_QUERY_PARAMS,
    updateParams,
  };
}

export default actions;
