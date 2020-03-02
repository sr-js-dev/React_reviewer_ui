import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import _ from "lodash";

import { Dropdown } from "antd";
import PerfectScrollbar from 'react-perfect-scrollbar'

import appActions from "../../redux/app/actions";
import settingsActions from "../../redux/settings/actions";
import propertiesActions from '../../redux/properties/actions';

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
        search: ""
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

    handleSearchChange = event => {
        this.setState( {
            search: event.target.value
        } );
    }

    constructor(props) {
        super(props);

        this.hideGradientDebounced = _.throttle( this.hideGradient, 100 );
        this.showGradientDebounced = _.throttle( this.showGradient, 100 );

        this.dropdown = React.createRef();
    }

    componentDidMount = () => {
        // this.getProperties();
        document.addEventListener( "mousedown", this.documentClick, false );
    }

    componentWillUnmount = () => {
        document.removeEventListener( "mousedown", this.documentClick, false );
    }

    render() {
        //  Make reference for easier access
        const { properties, user } = this.props;
        const { search } = this.state;

        let current_property = {};

        if ( typeof user === "undefined" ) {
            return (
                <div className="vpinsight__property-selector flex justify-start items-center">
                    {/* <div onClick={ this.togglePropertyModal }  className="border flex justify-center items-center text-blueish-grey rounded-lg ml-5 w-11 h-11 hover:bg-coral-pink hover:text-white hover:border-coral-pink cursor-pointer text-lg2 leading-none">
                        <Icon name="add" class="h-5.5"/>
                    </div> */}
                </div>
            );
        }

        if ( typeof user.current_property === "undefined" ) {
            current_property.name = "Showing all properties";
            current_property.id = "all";
        } else {
            current_property = _.cloneDeep( user.current_property );
        }

        //  Things related to current property
        //      Block class
        let propertyClass = "relative h-16 rounded-lg px-2.5 pr-0 overflow-hidden flex items-center w-auto bg-blueish-grey-transparent";
        //      Link to either Airbnb or VRBO

        //  Render individual properties
        const propertiesList = typeof user.props !== "undefined" && user.props.map( property => {

            if ( search.length > 0 &&
                property.name.toLowerCase().indexOf( search ) === -1 &&
                String( property.id ).indexOf( search ) === -1 &&
                String( property.airbnb_listing_id ).indexOf( search ) === -1 &&
                String( property.vrbo_listing_id ).indexOf( search ) === -1 &&
                property.street1.toLowerCase().indexOf( search ) === -1
            ) {
                return "";
            }

            return (
                <div key={ property.id } onClick={ () => { this.handleDropdownMenuClick( { key: property.id } ) } } className="flex items-center w-full h-16 px-3.5 border-b border-grey-border-50 bg-white hover:bg-grey-backdrop-10 cursor-pointer">
                    <div className="flex-grow text-slate font-semibold">
                        { property.name }
                    </div>
                </div>
            );
        } );

        const propertiesDropdown = (
            <section
                ref={this.dropdown}
                className="vpinsight__property-selector-dropdown w-100 bg-white -mt-16 rounded shadow-vp-dropdown flex flex-col"
            >
                {/* Search in properties */}
                <section className="w-100 h-16 bg-grey-backdrop flex justify-center items-center p-3.5 flex-no-shrink">
                    <section className="bg-white rounded-full h-full w-full flex">
                        <div className="flex justify-center items-center h-full w-9 ml-2 text-grey-backdrop ">
                            <Icon name="search" class="relative" style={ { top: -1 } } />
                        </div>
                        <input type="text" placeholder="Search in My Listing..." className="vpinsight__property-selector-input flex-grow rounded-r-full" value={ this.state.search } onChange={ this.handleSearchChange }/>
                    </section>
                </section>

                {/* Properties list */}
                <section className="vpinsight__property-selector-scrollsection relative flex flex-col">
                    <div className="flex flex-no-shrink justify-between items-center bg-grey-backdrop-transparent h-7 px-3.5 text-xs font-bold text-lighter-grey-blue">
                        <span>ALL PROPERTY</span>
                        <span>{ properties && properties.length }</span>
                    </div>
                    <PerfectScrollbar onYReachEnd={ this.hideGradientDebounced } onScrollUp={ this.showGradientDebounced }>
                        <>
                            <div key="all" onClick={ () => { this.handleDropdownMenuClick( { key: "all" } ) } } className="flex items-center w-full h-16 px-3.5 border-b border-grey-border-50 bg-white hover:bg-grey-backdrop-10 cursor-pointer">
                                <div className="flex-grow text-slate font-semibold">
                                    Show All Properties
                                </div>
                            </div>

                            { propertiesList || "" }
                        </>
                    </PerfectScrollbar>

                    <div className={ "absolute pin-b pin-l h-50px w-full pointer-events-none z-20 bg-bottom-gradient " + ( this.state.scrolledToBottom ? "opacity-0" : "" ) }></div>
                </section>

            </section>
        );

        //  Current property looks like expanded property in
        //  simple property selector
        const currentProperty = (
            <Dropdown
                overlay={ propertiesDropdown }
                trigger={ [] }
                visible={this.state.dropdownVisible}
                onVisibleChange={this.handleDropdownVisibleChange}
            >
                <section className={ propertyClass }>
                    <div className={ "flex flex-column align-start justify-center leading-sm mr-8" }>
                        <div className="flex-grow">
                            <div className="text-dusk font-bold">{ current_property.name }</div>
                            { current_property.id !== "all" && (<Link to={ `/properties/${ current_property.id }` } className="text-light-grey-blue text-xs font-bold hover:text-coral-pink no-underline">
                                See property page
                            </Link>) }
                        </div>
                    </div>

                    <div
                        onClick={ this.openDropdown }
                        className="ant-dropdown-link flex justify-center items-center ml-3.5 w-13 h-full border-l border-blueish-grey-transparent-40 text-blueish-grey hover:bg-blueish-grey-transparent hover:text-slate cursor-pointer">
                            <Icon name="arrow-down"/>
                    </div>
                </section>
            </Dropdown>
        )

        return (
            <div className={ "vpinsight__property-selector flex justify-start items-center " + ( this.props.propertySelectorLoading ? "opacity-50" : "" ) }>
                { currentProperty }

                {/* <div onClick={ this.togglePropertyModal }  className="border flex justify-center items-center text-blueish-grey rounded-lg ml-5 w-11 h-11 hover:bg-coral-pink hover:text-white hover:border-coral-pink cursor-pointer text-lg2 leading-none">
                    <Icon name="add" class="h-5.5"/>
                </div> */}
            </div>
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
