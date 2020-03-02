import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from "lodash";
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';

import settingsActions from '../../../redux/settings/actions';
import listingsActions from '../../../redux/listings/actions';
import propertiesActions from '../../../redux/properties/actions';

import Icon from "../../../components/common/Icon";

import "../../../scss/settings/PropertyTab.scss";
import LoadingIndicator from '../../../components/common/LoadingIndicator';
import { isMobile } from '../../../redux/app/actions';
import InfoPopup from "../../../components/common/InfoPopup";
import { getVrboType } from '../../../components/utility/propertyListing';

const { getUserListings } = listingsActions;
const { toggleListingModal, toggleEditModal, findListing, propertyFormUpdate, setDefaultListing, setEditedProperty, toggleModal } = settingsActions;
const { removeProperty } = propertiesActions;

export class PropertyTab extends Component {
    constructor(props) {
        super(props);

        this.state = {
            limit: 10,
            email: "",
            addingProperty: false,
            visibleUpgrade: false
        };
    }

    loadUserListings = () => {
        const { getUserListings } = this.props;
        getUserListings();
    };

    componentDidMount() {
        this.loadUserListings();
    }

    /**
     * Toggle add Property input visibility
     */
    toggleAddProperty = () => {
        const { user, toggleModal } = this.props;
        if(user.user_properties.length < user.settings.allowed_properties) {
            this.setState( {
                addingProperty: !this.state.addingProperty
            } );
        } else toggleModal();
    }

    /**
     * Toggle listing modal to select default Listing for a Property
     */
    toggleListingModal = ( property_id, market ) => {
        const { toggleListingModal, setEditedProperty, findListing } = this.props;
        //  Find a property from a list by it's ID
        const property = _.find( this.props.user.user_properties, property => {
            return property.property_id === property_id
        } );
        //  Toggle Listing Modal
        toggleListingModal( property_id, market );

        setEditedProperty( property );

        //  Find listings nearby this property
        geocodeByAddress( property.property.street_address )
            .then( results => {
                findListing( results, market )
            } )
            .catch( error => {
                // throw "Please enter a valid property address.";
                console.error( error );
            });
    };

    /**
     * Remove a Property
     *
     * @param {number} id - ID of a Property
     */
    removeProperty = ( id ) => {
        const { removeProperty } = this.props;
        removeProperty( id );
    }

    /**
     * When address is valid and listings are found,
     * handle control over to Listings Modal to select
     * default listing
     */
    handleSelect = ( event ) => {
        let propertyForm = _.cloneDeep( this.props.propertyForm );

        geocodeByAddress( propertyForm.property_address )
            .then( results => {
                //  Update GIS data on property form
                propertyForm.gis = results;
                this.props.propertyFormUpdate( propertyForm );
                //  Find listings nearby that address
                this.props.findListing( results );
            })
            .catch( error => {
                // throw "Please enter a valid property address.";
                console.error( error );
            });
    };

    /**
     * When property form changes
     */
    onRecordChange = (key, event) => {
        let propertyForm = _.cloneDeep( this.props.propertyForm );

        if ( key ) {
            propertyForm[key] = event;
        }

        this.props.propertyFormUpdate( propertyForm );
    };

    render() {
        console.log("prop render");
        const {
            listings,
            notSupported,
            propertyForm,
            loadingListingModal,
            view
        } = this.props;

        const mobile = isMobile( view );

        const inputProps = {
            value: propertyForm.property_address,
            onChange: this.onRecordChange.bind(this, 'property_address'),
            placeholder: "Enter an address or location",
        };

        const imageClass = "object-cover rounded hover:opacity-75";


        const propertiesList = listings && listings.length > 0 && listings.map( ( listing ) => {
            const type  = listing.vrbo_listing ? getVrboType(listing.vrbo_listing).type : 'N/A';
            return (
                <div className={ "vpinsight__settings-property shadow-vp-settings-form hover:shadow-vp-settings-form-hover bg-white rounded-lg mb-2.5 flex justify-start items-center " + ( mobile ? "py-6 flex-col" : "px-7 h-28" )} key={ listing.id } >
                    {/* Property name */}
                    <div className="flex-grow text-lg font-semibold text-slate">
                        {listing.property.street_address}
                    </div>

                    <div className={ "flex " + ( mobile ? "py-6" : "" ) } >
                        {/* Airbnb listing picture and change action */}
                        <div
                            className="cursor-pointer w-16 h-16 mr-7 listing-property-tag"
                            onClick={ () => { this.toggleListingModal( listing.property.id, "AirBnb" ) } }
                        >
                            <div className="property-label listing-airbnb">Airbnb</div>
                            { listing.airbnb_listing && listing.airbnb_listing.picture_small_url && (
                                <img
                                    className={ imageClass }
                                    src={ listing.airbnb_listing.picture_small_url }
                                    alt={ "Airbnb listing" }
                                />
                            )}

                            {/* Listing available, but no picture */}
                            { listing.airbnb_listing && !listing.airbnb_listing.picture_small_url && (
                                <div className="w-full h-full flex text-sm justify-center items-center rounded vpinsight__airbnb-gradient">Airbnb</div>
                            )}

                            {/* Listing not available */}
                            { !listing.airbnb_listing && (
                                <div className="w-full h-full flex text-sm justify-center items-center rounded border text-light-grey-blue hover:text-white font-bold hover:bg-grey-border">Select</div>
                            )}
                        </div>

                        {/* VRBO listing picture and change action */}
                        <div
                            className={ "cursor-pointer w-16 h-16 listing-property-tag " + ( !mobile ? "mr-7" : "" ) }
                            onClick={ () => { this.toggleListingModal( listing.property.id, "VRBO" ) } }
                        >

                            <div className="property-label listing-vrbo">{type}</div>
                            {/* Listing AND Picture available */}
                            { listing.vrbo_listing && listing.vrbo_listing.picture_small_url && (
                                <img
                                    className={ imageClass }
                                    src={ listing.vrbo_listing.picture_small_url }
                                    alt={ "VRBO listing" }
                                />
                            )}

                            {/* Listing available, but no picture */}
                            { listing.vrbo_listing && !listing.vrbo_listing.picture_small_url && (
                                <div className="w-full h-full flex text-sm justify-center items-center rounded vpinsight__vrbo-gradient">{type}</div>
                            )}

                            {/* Listing not available */}
                            { !listing.vrbo_listing && (
                                <div className="w-full h-full flex text-sm justify-center items-center rounded border text-light-grey-blue hover:text-white font-bold hover:bg-grey-border">Select</div>
                            )}
                        </div>
                    </div>

                    {/* Remove the property */}
                    <InfoPopup text={"infoPopup.property"}
                               values={{
                                   email: (<a href='mailto:support@vpinsight.com'>support@vpinsight.com</a>)
                               }}
                    />
                </div>
            );
        } );

        return (
            <section className={ "flex flex-col items-center flex-no-shrink " + ( mobile ? "w-full" : "py-16 my-auto" ) }>
                { listings && listings.length > 0 && (
                    <section className={ "vpinsight__property-list" }>
                        { propertiesList }
                    </section>
                ) }

                { listings && listings.length <= 0 && (
                    <section className={ "p-17 text-lg text-light-grey-blue font-medium text-center" }>
                        You don't have any properties added on your account.<br/>
                        Add a new one by clicking the 'Add Property' button in the upper right hand corner.
                    </section>
                ) }

                {/* Button for toggle adding property */}
                { !notSupported && !this.state.addingProperty && (
                    <button
                        className={ "flex justify-center items-center bg-water-blue hover:bg-water-blue-hover text-white shadow-vp-blue hover:shadow-vp-blue-active uppercase font-bold h-14 rounded-lg " + ( mobile ? "w-full" : "text-base mt-50px min-w-290px" ) }
                        onClick={ this.toggleAddProperty }
                    >
                        <Icon name="add" class="mr-2 text-xl h-5 "/> <span>Add Property</span>
                    </button>
                ) }

                {/* Input for adding property */}
                { !notSupported && this.state.addingProperty && (
                    <div
                        className={ "vpinsight__settings-property relative w-full shadow-vp-settings-form bg-white rounded-lg mb-2.5 flex justify-start items-center " + ( mobile ? "p-6" : "px-7 mt-50px h-28" ) }
                    >
                        <LoadingIndicator visible={ loadingListingModal }/>

                        <div className={ "vpinsight__places-autocomplete-input vpinsight__places-autocomplete-input_settings flex-grow " + ( mobile ? "w-full mt-6" : "mr-5" ) } >
                            <PlacesAutocomplete inputProps={inputProps} className="bg-grey" />
                        </div>

                        <button
                            onClick={ this.handleSelect }
                            className={ "vpinsight__add-property-button px-5 uppercase text-white font-bold bg-water-blue hover:bg-water-blue-hover rounded-lg " + ( propertyForm.property_address ? "" : "bg-grey-light pointer-events-none" ) + " " + ( mobile ? "w-full mt-2.5 mb-6 h-10" : "mr-7 h-50px" ) }
                        >
                            Add Property
                        </button>

                        <button
                            className="vpinsight__filter-clear bg-white text-grey-border hover:text-white rounded-full w-5 h-5 hover:bg-grey-border-50"
                            onClick={ this.toggleAddProperty }
                        >
                            <Icon name="cross" class="text-xxs leading-none" />
                        </button>
                    </div>
                ) }
            </section>
        )
    }
}

const mapStateToProps = (state) => ({
    //  User
    user: state.Auth.currentUser,
    //  Actually, this is properties
    listings: state.Listings.listings,
    //  Loading those properties
    loadingListing: state.Listings.loadingListing,
    //  Loading listings modal
    loadingListingModal: state.Settings.loadingListingModal,
    //  A from with a new property info
    propertyForm: state.Settings.propertyForm,
    //  Loading property list
    loadingProperties: state.Settings.loadingProperties,
    //  Adding more properties is supported
    notSupported: state.Settings.notSupported,
    //  View state
    view: state.App.view
})

const mapDispatchToProps = {
    //  Get list of properties
    getUserListings,
    //  Find listings for a property
    findListing,
    //  Toggle Listing modal, it's available on every page
    toggleListingModal,
    //
    toggleEditModal,
    setEditedProperty,
    //  Update new property form
    propertyFormUpdate,
    //  Remove Property
    removeProperty,
    //  Set the default Listing for a Property
    setDefaultListing,
    toggleModal
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTab)
