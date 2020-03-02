import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

import { showMenu, isMobile, EXTENDED_MOBILE } from "../../redux/app/actions";

//      User menu
import TopbarUser from "./TopbarUser";
//      Icon
import Icon from "./Icon";

//  SCSS
import "../../scss/components/Topbar.scss";
import Logo from "./Logo";
import IntlMessages from "../utility/intlMessages";
import AddProduct from "./AddProduct";
import { Auth0Context } from "../utility/Auth0Wrapper";

//  Data
import { MENU } from '../../settings/menu'

class Topbar extends Component {
  static contextType = Auth0Context;

  static propTypes = {
    transparent: PropTypes.bool
  }

  /**
   * Toggle Menu mobile modal
   *
   * @param {object} event - click event
   */
  showMenu = event => {
    const { showMenu } = this.props;
    showMenu();
  };

  /**
   * Redirect to login page
   */
  logIn = event => {
    console.log("6767676", this.context)
    const { loginWithRedirect } = this.context;
    loginWithRedirect();
  };

  buttonClassName = ( href, mobile ) => {
    const { pathname } = this.props;

    return (
      "vpinsight__settings-tab-button group mx-4 text-sm rounded-lg flex items-center pointer-events-auto " +
      (pathname === href
        ? "bg-water-blue-light text-water-blue font-bold"
        : "border border-transparent hover:border-border-grey text-dusk hover:text-dusk font-medium") +
      " " +
      (mobile ? "justify-center text-xs h-9 w-9 leading-none p-0" : "h-10 p-3")
    );
  };

  render() {
    //  Properties
    const { mobile, locale, pathname, transparent, windowScrolled } = this.props;
    const { isAuthenticated } = this.context;

    const showBg = mobile || !transparent || windowScrolled;

    //  Classname for container element
    const headerClassname =
      "vpinsight__topbar fixed pin-t pin-l z-50 w-screen flex justify-between items-center h-16 lg:h-18 px-2.5 " +
      (showBg ? ' bg-white shadow-vp-header' : ' vpinsight__topbar_transparent' );

    const classes = {
      accentButton:
        "font-bold uppercase rounded-lg lg:min-w-120px px-4 text-xs h-9 bg-water-blue-10 text-water-blue lg:h-10 lg:text-sm lg:text-white lg:bg-water-blue " +
        (mobile ? "" : "hover:bg-water-blue-hover")
    };

    const menuButtons = MENU.map(tab => (
      <Link
        key={tab.message}
        to={tab.href}
        className={this.buttonClassName(tab.href, mobile)}
      >
        <Icon
          name={tab.icon}
          class={
            (pathname === tab.href
              ? ""
              : "text-light-grey-blue-50 group-hover:text-water-blue ") +
            (mobile ? "text-xl" : "text-lg mr-2")
          }
        />
        { !mobile && <IntlMessages id={tab.message} /> }
      </Link>
    ));

    return (
      <section className={headerClassname} >


        {mobile && (
          <>
            <Logo noText small/>

            <section
              className={
                "absolute pin-t pin-l h-full w-full vpinsight__filter-bar z-10 pointer-events-none flex flex-no-shrink justify-center items-center"
              }
            >
              { isAuthenticated && menuButtons }
              { !isAuthenticated &&
                <button className={classes.accentButton + " pointer-events-auto"} onClick={this.logIn}>
                  Login
                </button>
              }
            </section>

            <section className="flex justify-end items-center">
              {/* Toggle Menu modal */}
              <button
                className="text-light-grey-blue opacity-80 z-20 text-lg2"
                onClick={this.showMenu}
              >
                <Icon name="hamburger" />
              </button>
            </section>
          </>
        )}

        {!mobile && (
          <>
            <Logo />

            <section
              className={
                "absolute pin-t pin-l vpinsight__filter-bar z-10 pointer-events-none flex flex-no-shrink w-full h-full justify-center items-center px-7"
              }
            >
              {menuButtons}
            </section>

            <section className="right-section flex justify-end items-center flex-no-shrink">
              {isAuthenticated && (
                <>
                  {/* User menu */}
                  <div onClick={() => this.setState({ selectedItem: "user" })}>
                    <TopbarUser locale={locale} user={this.props.user} />
                  </div>

                  <section className="border-l h-18 pl-7 flex items-center justify-center flex-no-shrink">
                    <AddProduct showCount={true} />
                  </section>
                </>
              )}

              {!isAuthenticated && (
                <button className={classes.accentButton} onClick={this.logIn}>
                  Login
                </button>
              )}
            </section>
          </>
        )}
      </section>
    );
  }
}

export default connect(
  state => ({
    ...state.App,
    locale: state.LanguageSwitcher.language.locale,
    customizedTheme: state.ThemeSwitcher.topbarTheme,
    notifications: state.Notifications.notifications,
    pathname: state.router.location.pathname,
    mobile: isMobile( state.App.view, EXTENDED_MOBILE  )
  }),
  { showMenu }
)(Topbar);
