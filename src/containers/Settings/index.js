import React, { Component } from 'react';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';

import settingsActions from '../../redux/settings/actions';
import { isMobile } from '../../redux/app/actions';

import qs from 'query-string';

import message from '../../components/feedback/message';
import MessageContent from '../Feedback/Message/message.style';

//  New pages
import ProfileTab from './components/ProfileTab';
import SubscriptionTab from './components/SubscriptionTab';
import BillingTab from './components/BillingTab';

//  New components
import IntlMessages from '../../components/utility/intlMessages';
import Icon from '../../components/common/Icon';

import 'react-perfect-scrollbar/dist/css/styles.css';
import '../../scss/settings.scss';
import ContactUs from './components/contactUs';

const { setTab, changeSetting } = settingsActions;

class Settings extends Component {
  tabs = [
    { name: 'Profile', message: 'user.profile', icon: 'profile' },
    {
      name: 'Subscription',
      message: 'user.subscription',
      icon: 'subscription',
    },
    { name: 'Billing', message: 'user.billing', icon: 'billing' },
  ];

  componentWillReceiveProps(nextProps) {
    const { billingError } = nextProps;

    if (billingError) {
      message.error(
        <MessageContent>
          <span>{billingError.msg}</span>
        </MessageContent>,
        10
      );
    }
  }

  componentDidUpdate(prevProps) {
    //  Parse query string
    const queryString = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    const queryString_prev = qs.parse(prevProps.location.search, {
      ignoreQueryPrefix: true,
    });
    let { selectedSetting, isTabSet } = this.props;
    if (
      queryString.tab !== queryString_prev.tab ||
      queryString.tab !== selectedSetting
    ) {
      //  If tab parameter is passed, set tab
      if (queryString.tab && !isTabSet) {
        this.props.setTab(queryString.tab);
      }
    }
  }

  /**
   * Change tab in redux state. This ensures that next time
   * when user opens this page, the tab stays the same
   *
   * @param {string} tab - tab name
   */
  changeTab = tab => {
    const { setTab, history } = this.props;
    history.push(`/settings?tab=${tab}`);
    setTab(tab);
  };

  buttonClassName = tab => {
    const { selectedSetting, view } = this.props;
    const mobile = isMobile(view);

    return (
      'vpinsight__settings-tab-button mx-1 rounded-lg flex items-center ' +
      (selectedSetting === tab
        ? 'bg-water-blue-light text-water-blue font-bold'
        : 'text-slate font-medium') +
      ' ' +
      (mobile ? 'text-xs h-9 px-3' : 'h-10 p-3')
    );
  };

  componentWillUnmount() {
    const { setTab } = this.props;
    setTab(null);
  }

  render() {
    let { selectedSetting, view, isTabSet } = this.props;

    const queryString = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    selectedSetting = !selectedSetting ? queryString.tab : selectedSetting;
    if (!isTabSet) {
      this.props.setTab(selectedSetting);
    } else {
      this.props.changeSetting(selectedSetting, false);
      this.changeTab(selectedSetting);
    }
    const mobile = isMobile(view);

    //  Tab buttons
    const buttons = this.tabs.map(tab => (
      <button
        key={tab.name}
        className={this.buttonClassName(tab.name)}
        onClick={() => {
          this.changeTab(tab.name);
        }}
      >
        <Icon
          name={tab.icon}
          class={
            'mr-2 ' +
            (selectedSetting === tab.name ? '' : 'hidden') +
            ' ' +
            (mobile ? 'text-lg' : '')
          }
        />
        <IntlMessages id={tab.message} />
      </button>
    ));

    const activeTab = (
      <>
        {selectedSetting === 'Profile' && <ProfileTab />}

        {selectedSetting === 'Subscription' && <SubscriptionTab />}

        {selectedSetting === 'Billing' && <BillingTab />}
      </>
    );

    return (
      <>
        <ContactUs />

        <section className="vpinsight__settings-container flex flex-col">
          {/* Tabs Menu */}
          <div
            className={
              'vpinsight__filter-bar z-10 flex flex-no-shrink justify-center items-center w-full  bg-white shadow-vp-header ' +
              (mobile ? 'h-15 px-3' : 'h-28 px-7')
            }
          >
            {buttons}
          </div>

          {!mobile && (
            <PerfectScrollbar
              className={
                'vpinsight__settings-tab w-full flex-grow overflow-hidden py-5 relative z-0 flex flex-col items-center '
              }
            >
              {activeTab}
            </PerfectScrollbar>
          )}

          {mobile && (
            <section className="vpinsight__settings-tab w-full flex-grow overflow-x-hidden overflow-y-scroll p-2.5 relative z-0 flex flex-col items-center">
              {activeTab}
            </section>
          )}
        </section>
      </>
    );
  }
}

const mapStateToProps = state => ({
  selectedSetting: state.Settings.selectedSetting,
  isTabSet: state.Settings.isTabSet,
  user: state.Auth.currentUser,
  notificationMsg: state.Settings.notificationMsg,

  //  View state
  view: state.App.view,
});

export default connect(
  mapStateToProps,
  { changeSetting, setTab }
)(Settings);
