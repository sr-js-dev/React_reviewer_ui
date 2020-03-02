import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import StarRatings from "react-star-ratings";

//  Actions
import settingsActions from "../../../redux/settings/actions";
import { isMobile } from "../../../redux/app/actions";
//  Components
import IntlMessages from "../../../components/utility/intlMessages";
import Icon from "../../../components/common/Icon";
//  Styles
import "../../../scss/settings/ProfileTab.scss";

import { SVG_STAR } from "../../../settings";
import Checkbox from "../../../components/common/Checkbox";
import { getUser } from '../../../redux/auth/actions';

const { saveUserProfile, userFormUpdate } = settingsActions;

const STAR_RATING_PROPS = {
  starDimension: "16px",
  starSpacing: "1px",
  starEmptyColor: "#e5e8f0",
  starRatedColor: "#fec400",
  starHoverColor: "#fec400",
  svgIconViewBox: "0 0 45 45",
  svgIconPath: SVG_STAR
};

const notificationsOptions = [
  {
    id: 0,
    title: "1 Star Reviews",
    type: "stars",
    rating: 1
  },
  {
    id: 1,
    title: "2 Star Reviews",
    type: "stars",
    rating: 2
  },
  {
    id: 2,
    title: "3 Star Reviews",
    type: "stars",
    rating: 3
  },
  {
    id: 3,
    title: "4 Star Reviews",
    type: "stars",
    rating: 4
  },
  {
    id: 4,
    title: "5 Star Reviews",
    type: "stars",
    rating: 5
  }
];

export class ProfileTab extends Component {
  state = {
    passwordFieldsVisible: false
  };

  componentDidMount() {
    //  On mount, if user is available, fill
    //  user form in redux state
      this.props.getUser();
    if (this.props.user) {
      //  Clone userForm from props
      let { userForm } = _.cloneDeep(this.props);

      userForm.firstName = this.props.user.settings.first_name || '';
      userForm.lastName = this.props.user.settings.last_name || '';
      userForm.email = this.props.user.settings.email;
      userForm.notificationsEnabled = this.props.user.settings.notifications_enabled;
      userForm.enabledNotificationOptions = this.props.user.settings.enabled_notification_options;

      this.props.userFormUpdate(userForm);

      this.setState({ userForm });
    }
  }

  componentWillReceiveProps(nextProps) {
    //  On props change, if user has changed, fill
    //  user form in redux state once again
    if (this.props.user !== nextProps.user && nextProps.user) {
      //  Clone userForm from props
      let { userForm } = _.cloneDeep(this.props);

      userForm.firstName = nextProps.user.settings.first_name;
      userForm.lastName = nextProps.user.settings.last_name;
      userForm.email = nextProps.user.settings.email;
      this.props.userFormUpdate(userForm);

      this.setState({ userForm });
    }
  }

  /**
   * Toggle "change password" block by
   * setting state
   */
  togglePasswordBlock = () => {
    this.setState({
      passwordFieldsVisible: !this.state.passwordFieldsVisible
    });
  };

  /**
   * Change user form key in Redux state on input change
   *
   * @param {string} key - key to be changed
   * @param {object} event - change event
   */
  onRecordChange = (key, event) => {
    let { userForm } = _.cloneDeep(this.props);

    if (key) {
      userForm[key] = event.target.value;
    }

    this.props.userFormUpdate(userForm);
  };

  /**
   * Send request to API to save user info,
   * pass userForm as new user info
   */
  onButtonClick = () => {
    let { saveUserProfile, userForm } = this.props;
    console.log('userForm:',userForm)
    let postData = {
      'first_name': userForm.firstName,
      'last_name': userForm.lastName,
      'notifications_enabled': userForm.notificationsEnabled,
      'enabled_notification_options': userForm.enabledNotificationOptions,
      'email': userForm.email
    }
     delete userForm.newPassword;
     delete userForm.newPasswordConfirm;
    saveUserProfile(postData);
  };

  /**
   * Determine whether form was changed from this input
   * and we should enable saving
   */
  formChanged = () => {
    return !_.isEqual(this.state.userForm, this.props.userForm);
  };

  getChecked = id => {
    const { enabledNotificationOptions } = this.props.userForm;
    return enabledNotificationOptions && enabledNotificationOptions.includes( id );
  }

  checkOption = id => {
    let userForm = _.cloneDeep(this.props.userForm);
    const checked = userForm.enabledNotificationOptions && userForm.enabledNotificationOptions.includes( id );

    if ( checked ) {
      userForm.enabledNotificationOptions = _.difference( userForm.enabledNotificationOptions, [ id ] );
    } else {
      userForm.enabledNotificationOptions = _.union( userForm.enabledNotificationOptions, [ id ] );
    }

    this.props.userFormUpdate(userForm);
  }

  toggleNotifications = () => {
    let userForm = _.cloneDeep(this.props.userForm);

    userForm.notificationsEnabled = !userForm.notificationsEnabled;

    this.props.userFormUpdate(userForm);
  }

  render() {
    const { userForm, view } = this.props;

    const mobile = isMobile(view);

    const labelClassName =
      "text-xxs uppercase leading-loose text-lighter-grey-blue font-bold";
    const blockClassName =
      "vpinsight__filter-block vpinsight__filter-block-inputs relative w-full px-3 border flex justify-between items-center rounded-lg border-border-profile text-slate leading-none font-semibold text-sm";
    const inputClassName = "h-42px w-full font-semibold text-slate text-sm";

    const notificationOptionsList = notificationsOptions.map(option => {
      const checked = this.getChecked( option.id );
      const className = "flex items-center p-2.5 border mb-2.5 h-9 rounded cursor-pointer text-xs font-semibold leading-none " + ( checked ? "border-water-blue-10 bg-water-blue-05" : "border-border-profile" );

      return <div key={ `notification-option-${ option.id }` } className={ className } onClick={ () => { this.checkOption( option.id ) } }>
        {option.type === "stars" &&
          <StarRatings { ...STAR_RATING_PROPS } rating={ option.rating } />
        }

        <span className="ml-2.5 flex-grow">{ option.title }</span>

        <Checkbox checked={ checked }/>
      </div>;
    });

    return (
      <section className={mobile ? "w-full" : "py-16 my-auto"}>
        <section
          className={
            "vpinsight__profile-form shadow-vp-settings-form bg-white rounded-lg " +
            (mobile ? "p-6" : "p-17")
          }
        >
          {/* First Name */}
          <div className="mb-5">
            <div className={labelClassName}>
              <IntlMessages id="user.firstName" />
            </div>
            <div className={blockClassName}>
              <input
                type="text"
                value={userForm.firstName}
                onChange={e => {
                  this.onRecordChange("firstName", e);
                }}
                className={inputClassName}
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="mb-5">
            <div className={labelClassName}>
              <IntlMessages id="user.lastName" />
            </div>
            <div className={blockClassName}>
              <input
                type="text"
                className={"w-full " + inputClassName}
                value={userForm.lastName}
                onChange={e => {
                  this.onRecordChange("lastName", e);
                }}
              />
            </div>
          </div>

          {/* Notification Email */}
          <div className="mb-5">
            <div className={labelClassName}>
              <IntlMessages id="user.email" />
            </div>
            <div className={blockClassName}>
              <input
                type="text"
                className={"w-full " + inputClassName}
                value={userForm.email}
                onChange={e => {
                  this.onRecordChange("email", e);
                }}
              />
            </div>
          </div>

          {/* Passwords Block */}
          <section
            className={
              "vpinsight__profile-password-block w-full overflow-hidden " +
              (this.state.passwordFieldsVisible ? "active border-b border-border-profile" : "")
            }
          >
            <button
              className={
                "mb-5 vpinsight__profile-password-toggle relative w-full"
              }
              onClick={this.togglePasswordBlock}
            >
              <span className="flex items-center text-xxs text-lighter-grey-blue font-bold relative bg-white uppercase">
                <span className="">Change Password</span>
                <Icon name={ this.state.passwordFieldsVisible ? "arrow-up" : "arrow-down" }/>
              </span>
            </button>

            {/* Old Password */}
            <div className="mb-5">
              <div className={labelClassName}>
                <IntlMessages id="user.oldPassword" />
              </div>
              <div className={blockClassName}>
                <input
                  type="password"
                  value={userForm.oldPassword}
                  onChange={e => {
                    this.onRecordChange("oldPassword", e);
                  }}
                  className={inputClassName}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-5">
              <div className={labelClassName}>
                <IntlMessages id="user.newPassword" />
              </div>
              <div className={blockClassName}>
                <input
                  type="password"
                  value={userForm.newPassword}
                  onChange={e => {
                    this.onRecordChange("newPassword", e);
                  }}
                  className={inputClassName}
                />
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="mb-5">
              <div className={labelClassName}>
                <IntlMessages id="user.newPasswordConfirm" />
              </div>
              <div className={blockClassName}>
                <input
                  type="password"
                  value={userForm.newPasswordConfirm}
                  onChange={e => {
                    this.onRecordChange("newPasswordConfirm", e);
                  }}
                  className={inputClassName}
                />
              </div>
            </div>
          </section>

          <section className="w-full border border-border-profile rounded-lg mt-5 ">
            <button className={ "w-full flex items-center p-4 text-xs font-semibold leading-none border-b border-border-profile "} onClick={ this.toggleNotifications }>
              <Checkbox checked={ userForm.notificationsEnabled } />
              <span className="ml-2.5">
                <IntlMessages id="user.notificationsEnabled" />
              </span>
            </button>

            <section className={ "flex flex-col p-4 " + ( userForm.notificationsEnabled ? "" : "opacity-50 pointer-events-none" ) }>
              {notificationOptionsList}
            </section>
          </section>

          <button
            className={
              "bg-water-blue hover:bg-water-blue-hover text-white font-bold mt-5 rounded-lg w-full h-10 border border-water-blue hover:border-water-blue-hover uppercase " +
              (this.formChanged() ? "" : "pointer-events-none text-white-50")
            }
            onClick={this.onButtonClick}
          >
            Save
          </button>
        </section>
      </section>
    );
  }
}

const mapStateToProps = state => ({
  //  Current user
  user: state.Auth.currentUser.current_user,
  //  User form that will be sent to API
  userForm: state.Settings.userForm,
  //  Loading state
  loadingUser: state.Settings.loadingUser,
  //  Any error
  userError: state.Settings.userError,

  //  View state
  view: state.App.view
});

const mapDispatchToProps = {
  saveUserProfile,
  userFormUpdate,
  getUser
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileTab);
