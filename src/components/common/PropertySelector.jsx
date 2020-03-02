import React, { Component } from 'react'
import { connect } from "react-redux";

import appActions from "../../redux/app/actions";
import settingsActions from '../../redux/settings/actions';

import { getHomewayListingType } from '../utility/propertyListing';  

// import { addProperty } from "../../redux/settings/actions";

import "../../scss/components/PropertySelector.scss";

import ListingSelector from "./ListingSelector";
import Icon from "./Icon";

const { changeProperty } = appActions;
const { toggleModal, toggleListingModal, toggleEditModal } = settingsActions;

/**
 * Simple property selector is shown when user has less then 5 properties
 */
class PropertySelector extends Component {

    handlePropertyChange = (key) => {
        const { changeProperty } = this.props;
        changeProperty(key);
    };

    togglePropertyModal = () => {
        const { toggleModal } = this.props;
        toggleModal();
    };

    render() {
        //  Can't render a list of properties if there aren't any properties on a user
        if ( typeof this.props.user === "undefined" || typeof this.props.user.user_properties === "undefined" ) {
            return (
                <div className="vpinsight__property-selector flex justify-start items-center">
                    <div onClick={ this.togglePropertyModal }  className="border flex justify-center items-center text-blueish-grey rounded-lg ml-5 w-11 h-11 hover:bg-coral-pink hover:text-white hover:border-coral-pink cursor-pointer text-lg2 leading-none">
                        <Icon name="add" class="h-5.5"/>
                    </div>
                </div>
            );
        }

        //  Make reference for easier access
        const { user_properties, current_property } = this.props.user;

        //  Render individual properties,
        //  make active property expanded by default
        const properties = user_properties.map( property => {
            //  Determine whether this property is active or not
            let active = ( property.property_id === current_property.id );
            //  Section class
            let sectionClass = "vpsinsight__property-selector-property relative rounded-lg p-2.5 overflow-hidden flex items-center h-16 " + ( active ? "w-auto bg-blueish-grey-transparent" : "w-16 cursor-pointer hover:opacity-75" );
            //  Determine image class
            let imageClass = "w-11 h-11 object-cover " + ( active ? "rounded-sm mr-4" : "rounded-lg" );
            //  Determine image based on active listing
            let imageSrc;
            //  Default listing image
            if ( property.currently_selected_market_id === 1 ) {
              if(property.airbnb_listing){
                  imageSrc = (property.airbnb_listing.picture_large_url);
              } else if(property.vrbo_listing) {
                imageSrc = (property.vrbo_listing.picture_large_url);
              }
            } else if ( property.currently_selected_market_id === 2 ) {
              if(property.airbnb_listing){
                imageSrc = ( property.airbnb_listing.picture_large_url);
              } else if(property.vrbo_listing) {
                imageSrc = ( property.vrbo_listing.picture_large_url);
              }
            }
            //  Link to either Airbnb or VRBO
            let propertyLink;
            //  Airbnb link
            if ( property.currently_selected_market_id === 1 ) {
              if (property.airbnb_listing) {
                propertyLink = (<a className="text-light-grey-blue text-xs font-bold hover:text-coral-pink no-underline"
                                   target="_blank" rel="noopener noreferrer" href={property.airbnb_listing.url}>Visit on
                  Airbnb</a>);
              }
            //  VRBO link
            } else if ( property.currently_selected_market_id === 2 ) {
              if (property.vrbo_listing) {
                const { homeawayType, link } = getHomewayListingType(property.vrbo_listing);
                propertyLink = (<a className="text-light-grey-blue text-xs font-bold hover:text-coral-pink no-underline"
                                   target="_blank" rel="noopener noreferrer" href={link}>Visit on {homeawayType}</a>);
              }
            }

            return (
                <section className={ sectionClass } key={ property.property_id } onClick={ ( active ? null : () => this.handlePropertyChange( { key: property.property_id } ) ) }>
                    <div className={ "flex flex-column align-start justify-center leading-sm " + ( active ? "mr-8" : "" ) }>
                        <img src={ imageSrc } alt={ property.property.street_address } className={ imageClass }/>

                        <div className={ "flex-grow " + ( active ? "" : "hidden" ) }>
                            <div className="text-dusk font-bold">{ property.property.street_address }</div>
                            { propertyLink }
                        </div>
                    </div>

                    { ( active ? (<ListingSelector />) : "" ) }
                </section>
            );
        } );

        return (
            <div className={ "vpinsight__property-selector flex justify-start items-center " + ( this.props.propertySelectorLoading ? "opacity-50" : "" ) }>
                { properties }

                <div onClick={ this.togglePropertyModal } className="border flex justify-center items-center text-blueish-grey rounded-lg ml-5 w-11 h-11 hover:bg-coral-pink hover:text-white hover:border-coral-pink cursor-pointer text-lg2 leading-none">
                    <Icon name="add" class="h-5.5"/>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
      ...state.App,
      user: state.Auth.currentUser
    }),
    { changeProperty, toggleModal, toggleListingModal, toggleEditModal }
  )(PropertySelector);
