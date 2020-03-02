import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Layout } from "antd";
import PerfectScrollbar from 'react-perfect-scrollbar'
import IntlMessages from "../../components/utility/intlMessages";
import appActions, { isMobile } from "../../redux/app/actions";

//  New components
import Icon from "./Icon";
import Logo from "./Logo";
import MobileModal from "./MobileModal";
import MobileNotifications from "./MobileNotifications";
import Footer from "./Footer";

// const SubMenu = Menu.SubMenu;
const { Sider } = Layout;

const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed,
  hideMenu,
  setCollapsed,
  setCollapsedBreakpoint
} = appActions;

const stripTrailingSlash = str => {
  if (str.substr(-1) === "/") {
    return str.substr(0, str.length - 1);
  }
  return str;
};

/**
 * Undocumented mess – my favourite kind of legacy to work with...
 *
 * I will rewrite existing sidebar component to look like Roman's design
 * and also I'll comment on everything I see.
 *
 *
 *
 *
 * Sidebar – Main menu of the app
 */
class Sidebar extends Component {
    state = {
        menuItems: [
            {
                key: 'reservations',
                label: 'sidebar.reservations',
                icon: 'my-listing',
            },
            {
                key: 'properties',
                label: 'sidebar.properties',
                icon: 'property',
            },
            {
                key: 'calendar',
                label: 'sidebar.calendar',
                icon: 'cal',
            },
            {
                key: 'taxes',
                label: 'sidebar.taxes',
                icon: 'price-correction',
            },
            {
                key: 'settings',
                label: 'sidebar.settings',
                icon: 'filter',
            },
        ]
    }

    /**
     * Handle click on menu link
     *
     * @param {object} event - javascript click event
     * @param {string} key - key to change current to
     */
    handleClick = ( event, key ) => {
        const { changeCurrent, view } = this.props;
        //  Change current view to key passed in event

        changeCurrent( [ key ] );

        if ( isMobile( view ) ) {
            this.hideMenu();
        }
    }

    /**
     *
     * @param {*} newOpenKeys
     */
    onOpenChange(newOpenKeys) {
        //
        const { app, changeOpenKeys } = this.props;

        const latestOpenKey = newOpenKeys.find(
            key => !(app.openKeys.indexOf(key) > -1)
        );

        const latestCloseKey = app.openKeys.find(
            key => !(newOpenKeys.indexOf(key) > -1)
        );

        let nextOpenKeys = [];

        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }

        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }

        changeOpenKeys(nextOpenKeys);
    }

    getAncestorKeys = key => {
        const map = {
            sub3: ["sub2"]
        };

        return map[key] || [];
    };

    /**
     * Hide Menu mobile modal
     *
     * @param {object} event - click event
     */
    hideMenu = event => {
        const { hideMenu } = this.props;
        hideMenu();
    };

    toggleCollapsed = event => {
        const { toggleCollapsed } = this.props;
        toggleCollapsed();
    }


    /**
     * Open drawer on mouse entering it's boundaries
     *
     * @param {object} event - mouseenter event object
     */
    onMouseEnter = event => {
        const { width } = this.props;
        const { openDrawer, collapsedBreakpoint } = this.props.app;

        if ( openDrawer === false && width < collapsedBreakpoint ) {
            toggleOpenDrawer();
        }
    };

    /**
     * Collapse drawer on mouse leaving it's boundries
     *
     * @param {object} event - mouseenter event object
     */
    onMouseLeave = event => {
        const { width } = this.props;
        const { openDrawer, collapsedBreakpoint } = this.props.app;

        if (openDrawer === true && width < collapsedBreakpoint) {
            toggleOpenDrawer();
        }
    };

    componentDidMount() {
        const { setCollapsedBreakpoint, width } = this.props;
        const { pathname, search } = this.props.router.location;

        setCollapsedBreakpoint( width, pathname, search );
    }

    render() {
        const { router, view, menuActive } = this.props;
        const { collapsed } = this.props.app;

        const url = stripTrailingSlash(this.props.url);

        const arrowName = !collapsed ? 'arrow-left' : 'arrow-right';

        const headerClassname = "vpinsight__topbar w-screen h-16 bg-white flex justify-center items-center px-2.5 ";

        const menuLinks = this.state.menuItems.map( ( item ) => {

            if ( !isMobile( view ) && item.label === "sidebar.settings" ) {
                return false;
            }

            const routerPath = (router.location.pathname.slice(-1) === "/") ? router.location.pathname.slice(0, -1) : router.location.pathname;
            const active = routerPath === `${url}${ ( item.key ? `/${ item.key }` : "" ) }`;


            let linkClass = "vpinsight__menu-link relative flex items-center w-full h-50px px-5 mb-2 text-sm rounded-lg no-underline focus:no-underline hover:no-underline	" +
                                ( active && ( isMobile( view ) || !collapsed ) ? "bg-water-blue-light text-water-blue hover:text-water-blue font-bold" : "text-charcoal-grey hover:text-charcoal-grey hover:bg-ice-blue" ) +
                                ( collapsed && !isMobile( view ) ? " vpinsight__menu-link_collapsed justify-center" : " justify-start" ) +
                                ( active ? " vpinsight__menu-link_active" : "" );

            if ( item.key === "mylisting" ) {
                linkClass = linkClass + " border border-grey-border";
            }

            return (
                <Link to={ `/${item.key}` } key={ item.key } className={ linkClass } >
                    <Icon name={item.icon} class={ "text-xl leading-none " + ( active ? "" : "text-grey-icon opacity-50") + ( collapsed && !isMobile( view ) ? " " : " mr-4" ) }/>

                    <span className="vpinsight__menu-label">
                        <IntlMessages id={item.label} className=""/>
                    </span>

                    { ( item.key === "mylisting" ? (<Icon name={"arrow-right"} class={ "text-grey-icon absolute pin-r pr-5 leading-none text-xxs" + ( collapsed && !isMobile( view ) ? " opacity-0" : "  opacity-50" ) } />) : "" ) }
                </Link>
            );
        } );
        return (
            <>
                {/* Mobile sidebar */}
                { (isMobile( view ) && menuActive) && (
                    <MobileModal
                        active={ menuActive }
                        onHide={ this.hideMenu }
                        theme="light"
                        containerClass="flex flex-col justify-start pb-32"
                    >
                        {/* This section mimics header */}
                        <section className={ headerClassname }>
                            {/* Logo */}
                            <Logo collapsed={false} notBeta={true}/>

                            {/* Hide Menu modal */}
                            <button className="absolute pin-r mr-5 text-light-grey-blue opacity-80 z-20 text-xs" onClick={ this.hideMenu }>
                                <Icon name="cross" />
                            </button>
                        </section>

                        {/* Notification section */}
                        <MobileNotifications />

                        {/* Menu */}
                        <section className="flex flex-col justify-center align-center w-4/6 mx-auto px-2.5 flex-grow ">
                            { menuLinks }
                        </section>
                    </MobileModal>
                ) }
                {/* Desktop and Tablet sidebar */}
                { !isMobile( view ) && (
                    <Sider
                        trigger={null}
                        collapsible={true}
                        collapsed={collapsed}
                        width={260}
                        collapsedWidth={100}
                        className="vpinsight__sider flex flex-col align-center bg-white border-r border-grey-light z-1001"
                        onMouseEnter={this.onMouseEnter}
                        onMouseLeave={this.onMouseLeave}
                    >

                        <div id={'logo-box'} className="flex flex-no-shrink items-center justify-center w-full h-18">
                            <Logo collapsed={collapsed}/>
                        </div>

                        {/* Links container */}
                        <PerfectScrollbar options={{suppressScrollX: true}} className="container flex flex-grow flex-col align-center w-full px-2.5">
                            { menuLinks }
                        </PerfectScrollbar>

                        <Footer/>

                        <button onClick={ this.toggleCollapsed } className={'focus:outline-none bg-greyish w-full h-13'}>
                            <Icon class={"text-lighter-grey-blue"} name={arrowName}/>
                        </button>
                    </Sider>
                ) }
            </>

        );
    }
}

export default connect(
  state => ({
    app: state.App,
    router: state.router,

    view: state.App.view,
    height: state.App.height,
    width: state.App.width,
    menuActive: state.App.menuActive
  }),
  { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed, hideMenu, setCollapsed, setCollapsedBreakpoint }
)(Sidebar);
