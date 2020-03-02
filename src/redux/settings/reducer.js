import React from 'react';
import actions from './actions';
import notifications from '../../components/feedback/notification';
import NotificationContent from '../../containers/Feedback/Notification/notification.style';
import message from '../../components/feedback/message';
import MessageContent from '../../containers/Feedback/Message/message.style';

const initState = {
  plans: null,
  billing: null,
  foundListings: null,
  newProp: null,
  foundListingSuccess: null,
  selectingListingFrom: 'AirBnb',
  notSupported: null,
  selectedSetting: null,
  isTabSet: false,
  loadingBilling: false,
  loadingPlans: false,
  loadingProperties: false,
  loadingPropModal: false,
  loadingListingModal: false,
  loadingContacts: false,
  loadingUser: false,
  loadingDefaultListing: false,
  loadingUpdatePlan: false,
  billingError: null,
  contactError: null,
  modalActive: false,
  modalListingActive: false,
  modalContactActive: false,
  notificationMsg: null,
  userForm: {
    firstName: '',
    lastName: '',
    email: '',
    newPassword: '',
    newPasswordConfirm: '',
    notificationsEnabled: true,
    enabledNotificationOptions: [0, 1],
  },
  contactForm: {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  },
  //  Billing transaction history
  transactionHistory: {},
  //  Property ID for which listing modal is loaded
  listingsModalPropertyID: null,
  editedProperty: null,
};

export default function settingsReducer(state = initState, action) {
  switch (action.type) {
    case actions.GET_PLANS:
      return {
        ...state,
        loadingPlans: true,
      };
    case actions.SET_PLANS:
      return {
        ...state,
        plans: action.plans,
        loadingPlans: false,
      };
    case actions.SET_DEFAULT_LISTING:
      return {
        ...state,
        loadingDefaultListing: true,
      };
    case actions.DEFAULT_LISTING_ADDED:
      message.success(
        <MessageContent>
          Default {action.market} listing has changed.
        </MessageContent>,
        10
      );

      return {
        ...state,
        foundListings: action.foundListings,
        newProp: action.newProp,
        foundListingSuccess: true,
        notSupported: null,
        loadingDefaultListing: false,
      };
    case actions.GET_BILLING:
      return {
        ...state,
        billingError: null,
        loadingBilling: true,
      };
    case actions.SET_BILLING:
      return {
        ...state,
        billing: action.billing,
        billingError: null,
        loadingBilling: false,
      };
    case actions.CHANGE_SETTING:
      if (action.showNotification) {
        const args = {
          message: action.notificationMsg.title,
          description: (
            <NotificationContent>
              {action.notificationMsg.msg}
            </NotificationContent>
          ),
          duration: 5,
        };
        notifications.open(args);
      }

      return {
        ...state,
        selectedSetting: action.selectedSetting,
        isTabSet: true,
        loadingBilling: false,
        notificationMsg: action.notificationMsg,
      };
    case actions.ADD_BILLING:
      return {
        ...state,
        billingError: null,
        loadingBilling: true,
      };
    case actions.BILLING_ERROR:
      return {
        ...state,
        billingError: action.error,
        loadingBilling: false,
      };
    case actions.SEND_CONTACT_ERROR:
      message.error(
        <MessageContent>
          {Object.keys(action.error).map((key, i) => {
            return (
              <div
                key={i}
                className=""
                style={{ display: 'flex', width: '100%' }}
              >
                <span
                  style={{ paddingRight: '3px', textTransform: 'capitalize' }}
                >
                  <strong>{key.replace(/_/g, ' ')}:</strong>
                </span>
                <span>{action.error[key]}</span>
              </div>
            );
          })}
        </MessageContent>,
        10
      );
      return {
        ...state,
        contactError: action.error,
        loadingContacts: false,
      };

    case actions.TOGGLE_CONTACT_MODAL:
      return {
        ...state,
        contactForm: {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        },
        modalContactActive: !state.modalContactActive,
        loadingContacts: false,
      };
    case actions.FIND_LISTING:
      return {
        ...state,
        selectingListingFrom: action.market || 'AirBnb',
        loadingListingModal: true,
      };
    case actions.ADD_PROPERTY:
      return {
        ...state,
        loadingPropModal: true,
      };
    case actions.SEND_CONTACT_MAIL:
      return {
        ...state,
        loadingContacts: true,
      };
    case actions.SAVE_USER_PROFILE:
      return {
        ...state,
        loadingUser: true,
      };
    case actions.SAVE_USER_PROFILE_ERROR:
      message.error(
        <MessageContent>
          {Object.keys(action.error).map((key, i) => {
            return (
              <div
                key={i}
                className=""
                style={{ display: 'flex', width: '100%' }}
              >
                <span
                  style={{ paddingRight: '3px', textTransform: 'capitalize' }}
                >
                  <strong>{key.replace(/_/g, ' ')}:</strong>
                </span>
                <span>{action.error[key]}</span>
              </div>
            );
          })}
        </MessageContent>,
        10
      );
      return {
        ...state,
        userError: action.error,
        loadingUser: false,
      };
    case actions.SAVE_USER_PROFILE_SUCCESS:
      message.success(
        <MessageContent>
          <p>User profile saved successfully!</p>
        </MessageContent>,
        10
      );
      return {
        ...state,
        userError: null,
        loadingUser: false,
      };

    case actions.CONTACT_FORM_UPDATE:
      return {
        ...state,
        contactForm: action.contactForm,
      };
    case actions.USER_FORM_UPDATE:
      return {
        ...state,
        userForm: action.userForm,
      };

    //////

    //  Set loading while waiting for updatePlan API response
    case actions.UPDATE_PLAN:
      return {
        ...state,
        loadingUpdatePlan: true,
      };

    case actions.UPDATE_PLAN_COMPLETED:
      return {
        ...state,
        loadingUpdatePlan: false,
      };

    //  Set transaction history state
    case actions.SET_TRANSACTION_HISTORY:
      return {
        ...state,
        transactionHistory: action.transactionHistory,
      };
    case actions.SHOW_PRODUCT_REMOVE_NOTIFICATION:
      if (action.showNotification) {
        const args = {
          message: action.notificationMsg.title,
          description: (
            <NotificationContent>
              {action.notificationMsg.msg}
            </NotificationContent>
          ),
          duration: 5,
        };
        notifications.warning(args);
      }

      return {
        ...state,
        loadingBilling: false,
        notificationMsg: action.notificationMsg,
      };
    case actions.SET_TAB:
      return {
        ...state,
        selectedSetting: action.selectedSetting,
        isTabSet: false,
      };

    default:
      return state;
  }
}
