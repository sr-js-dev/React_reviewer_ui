const notificationsAction = {
  GET_NOTIFICATIONS: 'GET_NOTIFICATIONS',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',

  GET_LISTING_NOTIFICATIONS: 'GET_LISTING_NOTIFICATIONS',
  SET_LISTING_NOTIFICATIONS: 'SET_LISTING_NOTIFICATIONS',

  SET_NOTIFICATION_DISABLED: 'SET_NOTIFICATION_DISABLED',
  DISMISS_NOTIFICATION_LOCAL: 'DISMISS_NOTIFICATION_LOCAL',

  DISABLE_LISTING_NOTIFICATION: 'DISABLE_LISTING_NOTIFICATION',
  DISABLE_LISTING_NOTIFICATION_LOCAL: 'DISABLE_LISTING_NOTIFICATION_LOCAL',

  CLEAR_ALL_NOTIFICATION: 'CLEAR_ALL_NOTIFICATION',
  CLEAR_ALL_NOTIFICATION_SUCCESS: 'CLEAR_ALL_NOTIFICATION_SUCCESS',

  CLEAR_ALL_LISTING_NOTIFICATION: 'CLEAR_ALL_LISTING_NOTIFICATION',
  CLEAR_ALL_LISTING_NOTIFICATION_SUCCESS:
    'CLEAR_ALL_LISTING_NOTIFICATION_SUCCESS',

  disabledNotifications: id => {
    return {
      type: notificationsAction.SET_NOTIFICATION_DISABLED,
      id: id,
    };
  },

  disabledListingNotifications: parameters => {
    return {
      type: notificationsAction.DISABLE_LISTING_NOTIFICATION,
      parameters: parameters,
    };
  },

  getNotifications: () => {
    return {
      type: notificationsAction.GET_NOTIFICATIONS,
    };
  },

  getListingNotifications: (id, currentPage) => {
    return {
      type: notificationsAction.GET_LISTING_NOTIFICATIONS,
      id,
      currentPage,
    };
  },

  clearAllNotifications: () => {
    return {
      type: notificationsAction.CLEAR_ALL_NOTIFICATION,
    };
  },

  clearAllListingNotifications: id => {
    return {
      type: notificationsAction.CLEAR_ALL_LISTING_NOTIFICATION,
      id,
    };
  },
};
export default notificationsAction;
