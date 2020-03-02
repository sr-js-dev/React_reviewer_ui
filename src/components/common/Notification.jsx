import React, { Component } from 'react'
import {connect} from "react-redux";
import Icon from "./Icon";
import moment from "moment";
import notificationsAction from "../../redux/notifications/actions";

const { disabledNotifications } = notificationsAction;

class Notification extends Component {

    // notificationTypes = {
    //     1:
    // }
    

    handleHide = ( notificationId , event) => {
        event.target.parentElement.setAttribute('style', 'left: -360px;')
        if (notificationId) {
          this.props.disabledNotifications(notificationId);
        }
    };

    render() {
        const notification = this.props.data;

        const date = moment( notification.updated_at ).fromNow();

        return (
            <div className={"flex w-full h-auto justify-start items-start p-5 flex-no-shrink notification-item " + ( this.props.lastChild ? "" : "border-b" )} >
                {/* Notification icon */}
                <div className="vpinsight__notification-icon border flex-no-shrink mr-5 flex justify-center items-center text-xl">
                    {/* { notification.notification_type ? (
                        <Icon name={ notification.notification_type.name } />
                    ) : (
                        <Icon name="notification" />
                    ) } */}

                    <Icon name="notifications" class="text-water-blue h-5.5 w-5"/>
                </div>

                {/* Notification body */}
                <div>
                    {/* Notifications message */}
                    <div className={"flex-grow text-slate font-bold text-xs " + (notification.viewed ? 'viewed-notification' : '')} dangerouslySetInnerHTML={{__html: notification.message}}></div>
                    {/* Notification date */}
                    <div className="mt-2.5 text-xxs text-light-grey-blue font-semibold">
                        { date }
                    </div>
                </div>

                {/* Close button */}
                <Icon name="cross" onClick={(event) => this.handleHide(notification.id, event)} class="flex-no-shrink ml-5 h-2.5 w-2.5 text-light-grey-blue text-xxs cursor-pointer hover:opacity-75"/>
            </div>
        )
    }
}

export default connect(
    null,{ disabledNotifications }
)(Notification);
