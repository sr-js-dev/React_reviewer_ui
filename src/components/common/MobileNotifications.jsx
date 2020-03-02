import React, { Component } from "react";
import { connect } from "react-redux";

import Slider from "react-slick";

import appActions from "../../redux/app/actions";

//  New components
import Notification from "./Notification";

import "slick-carousel/slick/slick.css";
import "../../scss/components/TopbarNotification.scss";

const { hideAllNotifications } = appActions;

class MobileNotifications extends Component {
  constructor(props) {
    super(props);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
    this.state = {
      visible: false
    };
  }
  hide() {
    this.setState({ visible: false });
  }
  handleVisibleChange() {
    this.setState({ visible: !this.state.visible });
  }
  render() {
    const { user } = this.props;

    const notificationsAvailable = ( user && user.user_notifications && user.user_notifications.length > 0 );

    const notifications = ( notificationsAvailable ? user.user_notifications.map( ( notification, index ) => {
        return (
            <div className="w-5/6 min-h-80px bg-white rounded-lg shadow-vp-default" key={ notification.id }>
                <Notification  data={ notification } lastChild={ false }/>
            </div>
        );
    } ) : (
        <div>
            No new notifications
        </div>
    ) );

    const sliderSettings = {
        centerMode: true,
        variableHeight: true,
        centerPadding: '8%',
        slidesToShow: 1,
        arrows: false,
        infinite: false,
        mobileFirst: true

    }

    return (
        <section className="vpinsight__mobile-notifications w-full relative py-7">
            <Slider {...sliderSettings}>
                { notifications }
            </Slider>
        </section>
    );
  }
}

export default connect(
    state => ({
        ...state.App,
        user: state.Auth.currentUser
    }),
    { hideAllNotifications }
)(MobileNotifications);
