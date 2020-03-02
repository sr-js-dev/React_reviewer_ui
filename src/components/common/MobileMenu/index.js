import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

//  Components
import Logo from '../Logo';
import Icon from '../Icon';
import MobileModal from '../MobileModal';
import IntlMessages from '../../utility/intlMessages';
//  Actions
import { hideMenu } from '../../../redux/app/actions';
//  Data
import { MENU, SETTINGS } from '../../../settings/menu';

const MenuLink = ({ item, pathname, borderBottom, onClick }) => {
  const active = pathname === item.href;

  const linkClass =
    'vpinsight__menu-link border-t relative flex items-center w-full h-50px px-5 text-sm rounded-lg no-underline	' +
    (active
      ? 'vpinsight__menu-link_active text-water-blue hover:text-water-blue font-bold'
      : 'text-charcoal-grey hover:text-charcoal-grey hover:bg-ice-blue') +
    (borderBottom ? ' border-b' : '');

  return (
    <Link to={item.href} key={item.key} className={linkClass} onClick={onClick}>
      <Icon
        name={item.icon}
        class={
          'text-xl leading-none ' + (active ? '' : 'text-grey-icon opacity-50')
        }
      />

      <span className="vpinsight__menu-label ml-4">
        <IntlMessages id={item.message} className="" />
      </span>
    </Link>
  );
};

export class MobileMenu extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
  };

  /**
   * Hide this menu
   */
  hide = event => {
    const { hideMenu } = this.props;
    hideMenu();
  };

  render() {
    const { visible, pathname } = this.props;

    const headerClassname =
      'vpinsight__topbar fixed pin-t pin-l z-50 w-screen bg-white flex justify-center items-center px-2.5 h-16 z-50';

    const menuLinks = MENU.map((item, idx) => {
      return (
        <MenuLink
          key={idx}
          item={item}
          pathname={pathname}
          onClick={this.hide}
        />
      );
    });
    return (
      <>
      {visible && 
        <MobileModal
          active={visible}
          onHide={this.hide}
          theme="light"
          containerClass="flex flex-col justify-start pb-32"
        >
          {/* This section mimics header */}
          <section className={headerClassname}>
            {/* Logo */}
            <Logo small />

            {/* Hide Menu modal */}
            <button
              className="absolute pin-r mr-5 text-light-grey-blue opacity-80 z-20 text-xs"
              onClick={this.hide}
            >
              <Icon name="cross" />
            </button>
          </section>

          {/* Notification section */}
          {/* <MobileNotifications /> */}

          {/* Menu */}
          <section className="flex flex-col justify-center align-center w-3/4 mx-auto px-2.5 flex-grow ">
            {menuLinks}

            <MenuLink
              item={SETTINGS}
              pathname={pathname}
              onClick={this.hide}
              borderBottom
            />
          </section>
        </MobileModal>
      }
      </>
    );
  }
}

const mapStateToProps = state => ({
  visible: state.App.menuActive,
  pathname: state.router.location.pathname,
});

const mapDispatchToProps = {
  hideMenu,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileMenu);
