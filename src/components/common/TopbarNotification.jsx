import React, { Component } from "react";
import { connect } from "react-redux";

import { Popover } from "antd";
import PerfectScrollbar from 'react-perfect-scrollbar'

// import appActions from "../../redux/app/actions";

//  New components
import Icon from "./Icon";
import Notification from "./Notification";
import notificationsActions from "../../redux/notifications/actions";

import 'react-perfect-scrollbar/dist/css/styles.css';
import "../../scss/components/TopbarNotification.scss";

// const { hideAllNotifications } = appActions;

const { clearAllNotifications } = notificationsActions;

class TopbarNotification extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications && nextProps.notifications.length <= 1) {
      if (document.getElementById('notifications-clear-all') !== null){
        document.getElementById('notifications-clear-all').parentElement.parentElement.getElementsByClassName('vpinsight__topbar-notifications-container')[0].getElementsByClassName('ps__scrollbar-y-rail')[0].classList.add("hidden");
      }
    }
  }

  hide() {
    this.setState({ visible: false });
  }
  
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }
  
  handleHideAllNotifications = () => {
    if (this.props.notifications) {
      this.props.clearAllNotifications();
    }
  }
  render() {
    const { user } = this.props;

    const notificationsAvailable = ( user && this.props.notifications && this.props.notifications.length > 0 );

    const notifications = ( notificationsAvailable ? this.props.notifications.map( ( notification, index ) => {
        let lastChild = ( this.props.notifications - 1 === index );

        return (
            <Notification key={ notification.id } data={ notification } lastChild={ lastChild }/>
        );
    } ) : (
        <div className="flex w-full h-auto justify-start items-start p-5 flex-no-shrink">
            No new notifications
        </div>
    ) );

    const content = (
        <>
            <PerfectScrollbar className={ "vpinsight__topbar-notifications-container flex flex-col w-full " + ( !notificationsAvailable ? " items-center justify-center" : "" ) }>
                 { notifications }

                {/*<div className="w-full h-auto p-5 flex-no-shrink text-center text-light-grey-blue">*/}
                    {/*No new notifications*/}
                {/*</div>*/}
            </PerfectScrollbar>

            <section className="w-full border-t border-grey-border-50 h-9 flex items-center justify-end px-5">
                <span onClick={ this.handleHideAllNotifications } className="text-xxs text-light-grey-blue no-decoration hover:text-water-blue uppercase font-bold cursor-pointer" id="notifications-clear-all">
                    Clear All
                </span>
            </section>
        </>
    );

    return (
      // Popover element
      <Popover
        content={content}
        trigger="click"
        visible={this.state.visible}
        onVisibleChange={this.handleVisibleChange}
        arrowPointAtCenter={true}
        overlayClassName={ "vpinsight__notification-tooltip" }
        placement="bottomLeft"
      >
        <div className={ "relative cursor-pointer mr-4 w-6 h-6 text-2xl " + ( this.state.visible ? "text-water-blue" : "text-blueish-grey" ) }>
          {/* Render notification dot only if user has notifications */}
          { ( notificationsAvailable && (this.props.notifications.length !== this.props.notifications.filter(n => n.viewed).length) ? (
            <div className="vpinsight__topbar-notification-dot absolute pin-t pin-r border-3 border-white rounded-full"></div>
          ) : "" ) }

          <Icon name="notifications" class="h-6"/>
        </div>
      </Popover>
    );
  }
}

export default connect(
    state => ({
        ...state.App,
        user: state.Auth.currentUser,
        notifications: state.Notifications.notifications,
    }),
    { clearAllNotifications }
)(TopbarNotification);
