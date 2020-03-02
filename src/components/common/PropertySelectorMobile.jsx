import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { connect } from "react-redux";
import _ from "lodash";

import appActions from "../../redux/app/actions";
import settingsActions from "../../redux/settings/actions";
import propertiesActions from "../../redux/properties/actions";

import Icon from "./Icon";


import 'react-perfect-scrollbar/dist/css/styles.css';

const { changeProperty } = appActions;
const { getProperties } = propertiesActions;
const { toggleModal } = settingsActions;

/**
 * Property selector with dropdown is shown when user has 5 or more properties.
 * This makes selecting current property much easier :)
 */
class PropertySelector extends Component {

    state = {
        dropdownVisible: false,
        scrolledToBottom: false,
    }

    getProperties = () => {
        const { getProperties } = this.props;
        getProperties();
    };

    handlePropertyChange = (key) => {
        const { changeProperty } = this.props;
        changeProperty(key);
    };

    togglePropertyModal = () => {
        const { toggleModal } = this.props;
        toggleModal();
    };

    openDropdown = () => {
        this.setState({ dropdownVisible: true });
    }

    hideDropdown = () => {
        this.setState({ dropdownVisible: false });
    }

    documentClick = ( e ) => {
        let domNode = ( this.dropdown.current != null ? ReactDOM.findDOMNode( this.dropdown.current ) : null );

        if ( domNode && !domNode.contains( e.target ) ) {
            this.setState({ dropdownVisible: false });
        }
    }

    handleDropdownVisibleChange = (flag) => {
        this.setState({ dropdownVisible: flag });
    }

    handleDropdownMenuClick = ( event ) => {
        this.handlePropertyChange( { key: event.key } );
        this.setState({ dropdownVisible: false });
    }

    hideGradient = () => {
        this.setState( {
            scrolledToBottom: true
        } )
    }

    showGradient = () => {
        this.setState( {
            scrolledToBottom: false
        } )
    }

    constructor(props) {
        super(props);

        this.hideGradientDebounced = _.throttle( this.hideGradient, 100 );
        this.showGradientDebounced = _.throttle( this.showGradient, 100 );

        this.dropdown = React.createRef();
    }

    componentDidMount = () => {
        this.getProperties();

        document.addEventListener( "mousedown", this.documentClick, false );
    }

    componentWillUnmount = () => {
        document.removeEventListener( "mousedown", this.documentClick, false );
    }

    render() {
        //  Make reference for easier access
        const { properties } = this.props;

        if ( typeof this.props.user === "undefined" || this.props.user.current_property === "undefined" ) {
            return (
                <div className="vpinsight__property-selector flex justify-start items-center">
                    {/* <div onClick={ this.togglePropertyModal }  className="border flex justify-center items-center text-blueish-grey rounded-lg ml-5 w-11 h-11 hover:bg-coral-pink hover:text-white hover:border-coral-pink cursor-pointer text-lg2 leading-none">
                        <Icon name="add" class="h-5.5"/>
                    </div> */}
                </div>
            );
        }

        //  Make reference for easier access
        const { current_property } = this.props.user;

        //  Things related to current property
        //      Image class
        const propClass = "flex items-center w-full border-b border-grey-border-50 bg-white px-2.5 h-15"

        //  Render individual properties
        const propertiesList = properties && _.filter( properties, o => { return o.id !== current_property.id } ).map( property => {
            return (
                <div key={ property.id } onClick={ () => { this.handleDropdownMenuClick( { key: property.id } ) } } className={ propClass }>
                    <div className="flex-grow text-light-grey-blue font-medium">
                        { property.name }
                    </div>
                </div>
            );
        } );

        return (
            <>
                {/* Hide Dropdown */}
                { this.state.dropdownVisible && (
                    <div onClick={ this.hideDropdown }  className="relative z-20 border-2 flex justify-center items-center text-blueish-grey rounded-lg w-9 h-9 hover:bg-coral-pink hover:text-white hover:border-coral-pink cursor-pointer text-xs leading-none">
                        <Icon name="cross" class=""/>
                    </div>
                ) }

                {/* Show Dropdown */}
                { !this.state.dropdownVisible && (
                    <div onClick={ this.openDropdown }  className="relative z-20 border-2 flex justify-center items-center text-blueish-grey rounded-lg w-9 h-9 hover:bg-water-blue hover:text-white hover:border-water-blue cursor-pointer text-xs leading-none">
                        <Icon name="property" class=""/>
                    </div>
                ) }

                <section className={ "vpinsight__mobile-prop-list fixed overflow-hidden w-screen flex pin-l flex-col " + ( this.state.dropdownVisible ? "active shadow-vp-header" : "" ) } >
                    <section className="vpinsight__mobile-prop-scroll-block overflow-scroll">
                        <div key="all" onClick={ () => { this.handleDropdownMenuClick( { key: "all" } ) } } className={ propClass + " border-t" }>
                            <div className="flex-grow text-slate font-semibold">
                                Show All Properties
                            </div>
                        </div>

                        {/* Current Property */}
                        <div key={ current_property.id } className={ propClass }>
                            <div className="flex-grow text-slate font-semibold flex justify-between items-baseline">
                                { current_property.name } <small className="text-1/2 font-bold opacity-75">CURRENT PROPERTY</small>
                            </div>
                        </div>

                        { propertiesList }
                    </section>
                    <button className="w-full h-16 bg-white border-t flex justify-center items-center flex-no-shrink uppercase text-water-blue text-sm font-bold" onClick={ this.togglePropertyModal }>
                        <Icon name="add" class="mr-2 h-4 "/> <span>Add Property</span>
                    </button>
                </section>
            </>
        )
    }
}

export default connect(
    state => ({
      ...state.App,
      ...state.Properties,
      user: state.Auth.currentUser
    }),
    { changeProperty, toggleModal, getProperties }
  )(PropertySelector);
