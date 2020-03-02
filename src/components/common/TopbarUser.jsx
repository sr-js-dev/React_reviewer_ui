import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Popover from '../../components/uielements/popover';
import IntlMessages from '../../components/utility/intlMessages';
import authAction from '../../redux/auth/actions';
import { Auth0Context } from "../utility/Auth0Wrapper";

//  New Components
import Icon from "./Icon";

import "../../scss/components/TopbarUser.scss";

const { logout } = authAction;

class TopbarUser extends Component {
  static contextType = Auth0Context;

  state = {
    visible: false
  };

  hide = () => {
    this.setState({ visible: false });
  }
  handleVisibleChange = () => {
    this.setState({ visible: !this.state.visible });
  }

  /**
   * Logoout using Auth0
   */
  logOut = event => {
    const { logout } = this.context;
    logout();
  }

  render() {
    const { user } = this.context;

    const linkClass = "relative flex items-center w-full h-50px px-5 mb-2 text-sm no-underline focus:no-underline hover:no-underline text-charcoal-grey hover:text-charcoal-grey hover:bg-ice-blue";
    const iconClass = "text-xl leading-none text-grey-icon opacity-50 mr-4";

    const content = (
      <>
        {/* Profile link */}
        <Link className={linkClass} to="/settings?tab=Profile" onClick={this.handleVisibleChange}>
          <Icon class={ iconClass } name="profile" />
          <IntlMessages id="user.profile" />
        </Link>

        {/* Subscription link */}
        <Link className={linkClass} to="/settings?tab=Subscription" onClick={this.handleVisibleChange}>
          <Icon class={ iconClass } name="subscription" />
          <IntlMessages id="user.subscription" />
        </Link>


        {/* Billing link */}
        <Link className={linkClass} to="/settings?tab=Billing" onClick={this.handleVisibleChange}>
          <Icon class={ iconClass } name="billing" />
          <IntlMessages id="user.billing" />
        </Link>

        {/* Logoout link */}
        <div className={linkClass} onClick={this.logOut} style={{cursor: "pointer"}}>
          <Icon class={ iconClass } name="private-room" />
          <IntlMessages id="topbar.logout" />
        </div>
      </>
    );

    return (
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        placement="bottomLeft"
        overlayClassName={ "vpinsight__user-tooltip" }
      >
        <div className="flex flex-no-shrink items-center mr-3.5 cursor-pointer">
            <span className="text-sm text-dusk font-bold">
              { user && user.nickname ? user.nickname : 'User' }
            </span>

            <Icon name={ ( this.state.visible ? "arrow-up" : "arrow-down" ) } class="ml-3.5 mt-1 mr-1 text-3xs"/>
        </div>
      </Popover>
    );
  }
}
export default connect(null, { logout })(TopbarUser);
