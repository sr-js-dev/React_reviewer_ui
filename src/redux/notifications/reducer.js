import actions from './actions';

const initState = {
  totalListingNotifications: 0,
};

export default function notificationReducer(state = initState, action) {
  switch (action.type) {
    case actions.DISMISS_NOTIFICATION_LOCAL:
      return {
        ...state,
        notifications: state.notifications.filter(
          n => parseInt(n.id) !== parseInt(action.id)
        ),
      };
    case actions.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.notifications,
      };
    case actions.SET_LISTING_NOTIFICATIONS:
      return {
        ...state,
        listingNotifications: action.listingNotifications,
        totalListingNotifications: action.totalListingNotifications,
      };
    case actions.DISABLE_LISTING_NOTIFICATION_LOCAL:
      return {
        ...state,
        listingNotifications: state.listingNotifications.filter(
          n => parseInt(n.id) !== parseInt(action.id)
        ),
        totalListingNotifications: state.totalListingNotifications - 1,
      };
    case actions.CLEAR_ALL_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notifications: [],
      };
    case actions.CLEAR_ALL_LISTING_NOTIFICATION_SUCCESS:
      return {
        ...state,
        listingNotifications: [],
        totalListingNotifications: 0,
      };
    default:
      return state;
  }
}
