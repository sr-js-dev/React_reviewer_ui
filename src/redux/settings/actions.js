const settingsAction = {
  GET_PLANS: 'GET_PLANS',
  SET_PLANS: 'SET_PLANS',
  GET_BILLING: 'GET_BILLING',
  SET_BILLING: 'SET_BILLING',
  GET_TRANSACTION_HISTORY: 'GET_TRANSACTION_HISTORY',
  SET_TRANSACTION_HISTORY: 'SET_TRANSACTION_HISTORY',
  BILLING_ERROR: 'BILLING_ERROR',
  CHANGE_SETTING: 'CHANGE_SETTING',
  UPDATE_PLAN: 'UPDATE_PLAN',
  UPDATE_PLAN_COMPLETED: 'UPDATE_PLAN_COMPLETED',
  ADD_BILLING: 'ADD_BILLING',
  SAVE_USER_PROFILE: 'SAVE_USER_PROFILE',
  SAVE_USER_PROFILE_SUCCESS: 'SAVE_USER_PROFILE_SUCCESS',
  SAVE_USER_PROFILE_ERROR: 'SAVE_USER_PROFILE_ERROR',
  TOGGLE_CONTACT_MODAL: 'TOGGLE_CONTACT_MODAL',
  SEND_CONTACT_MAIL: 'SEND_CONTACT_MAIL',
  SEND_CONTACT_ERROR: 'SEND_CONTACT_ERROR',
  CONTACT_FORM_UPDATE: 'CONTACT_FORM_UPDATE',
  USER_FORM_UPDATE: 'USER_FORM_UPDATE',
  PLAN_MESSAGE: {
    title: 'Select Plan',
    msg: 'Please select a plan before continuing to use this application.',
  },
  BILLING_MESSAGE: {
    title: 'Setup Payment',
    msg:
      'You have chosen a paid plan. Please enter your payment information to continue.',
  },
  SHOW_PRODUCT_REMOVE_NOTIFICATION: 'SHOW_PRODUCT_REMOVE_NOTIFICATION',
  SET_TAB: 'SET_TAB',

  getPlans: () => {
    console.log('Loading plans');
    return {
      type: settingsAction.GET_PLANS,
    };
  },

  changeSetting: (id, showNote) => {
    return (dispatch, getState) => {
      let notificationMsg = settingsAction.PLAN_MESSAGE;

      if (id === 'billing') {
        notificationMsg = settingsAction.BILLING_MESSAGE;
      } else if (id === 'property') {
        notificationMsg = settingsAction.PROPERTY_MESSAGE;
      }

      dispatch({
        type: settingsAction.CHANGE_SETTING,
        selectedSetting: id,
        notificationMsg: notificationMsg,
        showNotification: showNote,
      });
    };
  },
  updatePlan: plan => {
    return {
      type: settingsAction.UPDATE_PLAN,
      plan: plan,
    };
  },
  getBilling: () => {
    console.log('Loading billing');
    return {
      type: settingsAction.GET_BILLING,
    };
  },
  addBilling: stripeToken => {
    return {
      type: settingsAction.ADD_BILLING,
      stripeToken: stripeToken,
    };
  },
  toggleModal: () => {
    console.log('action toggle');
    return {
      type: settingsAction.TOGGLE_PROPERTY_MODAL,
    };
  },
  toggleListingModal: (property_id = null, market = 'AirBnb') => {
    return {
      type: settingsAction.TOGGLE_LISTING_MODAL,
      listingsModalPropertyID: property_id,
      selectingListingFrom: market,
    };
  },
  toggleEditModal: property => {
    console.log('action edit toggle');
    return {
      type: settingsAction.TOGGLE_PROPERTY_EDIT_MODAL,
      property: property,
    };
  },
  toggleContactModal: () => {
    return {
      type: settingsAction.TOGGLE_CONTACT_MODAL,
    };
  },
  propertyFormUpdate: data => {
    return {
      type: settingsAction.PROPERTY_FORM_UPDATE,
      propertyForm: data,
    };
  },
  userFormUpdate: data => {
    return {
      type: settingsAction.USER_FORM_UPDATE,
      userForm: data,
    };
  },
  contactFormUpdate: data => {
    return {
      type: settingsAction.CONTACT_FORM_UPDATE,
      contactForm: data,
    };
  },
  findListing: (geocodeData, market = 'AirBnb') => {
    return {
      type: settingsAction.FIND_LISTING,
      geocodeData,
      market,
    };
  },
  setDefaultListing: listingParameters => {
    return {
      type: settingsAction.SET_DEFAULT_LISTING,
      airbnb_listing_id: listingParameters.airbnb_listing_id,
      vrbo_listing_id: listingParameters.vrbo_listing_id,
      propertyId: listingParameters.propertyId,
      user: listingParameters.user,
      selectingListingFrom: listingParameters.selectingListingFrom,
      submitListing: listingParameters.submitListing,
    };
  },
  sendContactMail: contactForm => {
    console.log('sending contact');
    return {
      type: settingsAction.SEND_CONTACT_MAIL,
      contactForm: contactForm,
    };
  },
  saveUserProfile: userForm => {
    return {
      type: settingsAction.SAVE_USER_PROFILE,
      userForm: userForm,
    };
  },

  // addProperty: () => {
  //   return {
  //     type: settingsAction.ADD_PROPERTY,
  //   };
  // },

  setListing: (listing_id, switchMarket = false) => {
    return {
      type: settingsAction.SET_LISTING,
      listing_id: listing_id,
      switchMarket: switchMarket,
    };
  },

  setEditedProperty: property => {
    return {
      type: settingsAction.SET_EDITED_PROPERTY,
      editedProperty: property,
    };
  },

  /**
   * Get transaction history for `dashboard/settings?tab=Billing`
   */
  getTransactionHistory: () => {
    return {
      type: settingsAction.GET_TRANSACTION_HISTORY,
    };
  },

  setSelectingListing: selectedListing => ({
    type: settingsAction.SET_SELECTING_LISTING,
    selectedListing,
  }),

  setTab: tab => ({
    type: settingsAction.SET_TAB,
    selectedSetting: tab,
  }),
};
export default settingsAction;
