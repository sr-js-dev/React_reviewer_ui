import React, { Component } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/fp/get';
import pick from 'lodash/fp/pick';
//  Components
import { Modal } from 'antd';
import Spin from '../uielements/spin';
import PerfectScrollbar from 'react-perfect-scrollbar'
//  Actions
import settingsActions from '../../redux/settings/actions';
import propertiesActions from '../../redux/properties/actions';
//  Style
import 'react-perfect-scrollbar/dist/css/styles.css';
import "../../scss/components/ListingsModal.scss";
import { isNull } from 'util';
import MobileModal from './MobileModal';
import { isMobile } from '../../redux/app/actions';
import checkMark from '../../image/check-circle.png';
import checkMarkWhite from '../../image/tick-white-t.png';

//  Map to const
const { toggleListingModal, addProperty, setListing, setDefaultListing, setSelectingListing, setEditedProperty } = settingsActions;
const { getPropertyCompetition } = propertiesActions;

export class ListingsModal extends Component {
    state = {
        scrolledToBottom: false,
    }
    /**
     * Toggle this modal
     */
    toggleListingModal = () => {
        const { toggleListingModal } = this.props;
        toggleListingModal();
    };

    /**
     * Set default listing by clicking for a property
     */
    setListing = (listing_id) => {
        const {
            setListing,
            setDefaultListing,
            selectingListingFrom,
            listingsModalPropertyID,
            user,
            editedProperty,
            propertyForm
        } = this.props;

        const switchMarket = (listing_id === 'confirm') ? "Add Property" : '';
        const isSelectedAirBnb = selectingListingFrom === "AirBnb";
        /**
         *  When changing the default Listing for an existing Property
         */
        if ( typeof listingsModalPropertyID !== "undefined" && !isNull( listingsModalPropertyID ) ) {
            
            const airbnbListingUpdated = isSelectedAirBnb && listing_id && (listing_id !== editedProperty.airbnb_listing_id)

            const vrboListingUpdated = !isSelectedAirBnb && listing_id && (listing_id !== editedProperty.vrbo_listing_id)

            if ((listing_id === editedProperty.airbnb_listing_id) || (listing_id === editedProperty.vrbo_listing_id)) listing_id = null

            const submitListing = (airbnbListingUpdated || vrboListingUpdated)

            const selectedIds = {
                airbnb_listing_id: ( isSelectedAirBnb ? listing_id : editedProperty.airbnb_listing_id ),
                vrbo_listing_id: ( !isSelectedAirBnb ? listing_id : editedProperty.vrbo_listing_id ),
            }
            //     propertyId: editedProperty.property_id,
            //     user,
            //     selectingListingFrom
            // }

            if (listing_id === 'confirm') {
              const payload = pick(['airbnb_listing_id', 'vrbo_listing_id', 'property_id'])(editedProperty);
              return setDefaultListing({ ...payload, propertyId: payload.property_id, user, selectingListingFrom, submitListing });
            }
            this.props.setEditedProperty({ ...editedProperty, ...selectedIds  });
        /**
         *  When setting the default Listing for a new Property
         */
        } else {

            if ((listing_id === propertyForm.airbnb_listing_id)
                || (listing_id === propertyForm.vrbo_listing_id)) listing_id = null;
            
            setListing( listing_id, switchMarket );
        }


    }

    /**
     * Add Property
     */
    addProperty = () => {
        const { addProperty, propertyForm } = this.props;

        addProperty( {
            ...propertyForm
        } );
    }

    /**
     * Load more listings
     */
    loadMore = () => {
        const { getPropertyCompetition, selectedPropertyId, propListings } = this.props;
        const market = ( propListings && propListings.length > 0 ? propListings[0].market.id : 1);
        const newLimit = this.state.limit + 10;

        this.setState({
            limit: this.state.limit + 10
        });

        getPropertyCompetition( selectedPropertyId,
            {
                limit: newLimit,
                criteria: {
                    "ls.market_id": market
                }
            }
        );
    }

    render() {
        const {
            modalListingActive,
            loadingListingModal,
            foundListings,
            selectingListingFrom,
            view,
            propertyForm,
            editedProperty,
        } = this.props;

        const vrbo_type = get('user.current_user_property[0].currently_selected_listing.homeaway_type')(this.props) ? this.props.user.current_user_property[0].currently_selected_listing.homeaway_type : 'VRBO'

        const ListingSelected = (propertyForm.airbnb_listing_id) || (editedProperty && editedProperty.airbnb_listing_id) || (propertyForm.vrbo_listing_id) || (editedProperty && editedProperty.vrbo_listing_id);

        const mobile = isMobile( view );

        let listings, listingsNodes;

        if ( foundListings ) {
            const selectedNodeId = selectingListingFrom === "AirBnb" ? (propertyForm.airbnb_listing_id || (editedProperty && editedProperty.airbnb_listing_id)) : (propertyForm.vrbo_listing_id || (editedProperty && editedProperty.vrbo_listing_id));
            listings = ( selectingListingFrom === "AirBnb" ? foundListings.airbnb_listings : foundListings.vrbo_listings );
            listingsNodes = ( listings ? listings.map( ( listing ) => {
                let title = ( listing.current_listing_info_snapshot ? listing.current_listing_info_snapshot.listing_title : listing.id );

                return (
                    <div key={listing.id} onClick={ () => { this.setListing( listing.id ) } } className={`listingsModal__list-item w-full h-17 border-b flex items-center p-8 cursor-pointer ${ selectedNodeId !== listing.id ? 'hover:' : 'selected-default-listing ' }bg-water-blue-light`}>
                        <img className="w-11 h-11 object-cover rounded-sm mr-4" src={ listing.picture_small_url } alt={ title }/>
                        <div className="flex-grow">
                            { title }
                        </div>
                        {selectedNodeId === listing.id &&
                                                <img className="selected-listing-checkmark" src={process.env.PUBLIC_URL + checkMark} alt="checkmark" />}
                    </div>
                )
            } ) : (
                <div className="w-full h-32 flex justify-center items-center text-sm text-blueish-grey-transparent-40 font-bold">
                    No listigns found
                </div>
            ) );
        } else {
            listingsNodes = (
                <div className="w-full h-32 flex justify-center items-center text-sm text-blueish-grey-transparent-40 font-bold">
                    No listigns found
                </div>
            );
        }

        const content = (<>
            <div className="listingsModal__header flex flex-col items-center bg-grey-backdrop-transparent p-3.5">
                <div className="flex">
                    <div onClick={() => { this.props.setSelectingListing('AirBnb') }} className={ `listingsModal__listing-icon mr-6 flex justify-center items-center text-lg font-bold text-white h-16 w-16 relative rounded listingsModal__listing-icon_AirBnb property-modal ${ (selectingListingFrom === 'AirBnb') ? 'selected-listing-header' : ''}` }>
                        Airbnb {(propertyForm.airbnb_listing_id || editedProperty && editedProperty.airbnb_listing_id )&&
                                                <img className="selected-listing-checkmark" src={process.env.PUBLIC_URL + checkMarkWhite} alt="checkmark" />}
                    </div>
                    <div onClick={() => { this.props.setSelectingListing('VRBO') }} className={ `listingsModal__listing-icon flex mx-auto justify-center items-center text-lg font-bold text-white h-16 w-16 relative rounded listingsModal__listing-icon_VRBO property-modal ${ (selectingListingFrom === 'VRBO') ? 'selected-listing-header' : ''}` }>
                        <div className={"d-inline-block text-center"}>
                            <span className={"vrbo-header"}>VRBO</span>
                            <span className={"homeaway-header"}>HomeAway</span>
                        </div>
                        {(propertyForm.vrbo_listing_id || editedProperty && editedProperty.vrbo_listing_id) &&
                                                    <img className="selected-listing-checkmark" src={process.env.PUBLIC_URL + checkMarkWhite} alt="checkmark" />}
                        
                    </div>
                </div>

                <div className="text-slate text-lg mt-5 font-semibold default-listing-header">
                    Choose { (selectingListingFrom === 'VRBO') ? 'VRBO/HomeAway' : 'Airbnb'} Listing
                </div>
            </div>
            <Spin spinning={ loadingListingModal } size="large">
                <PerfectScrollbar className="listingsModal__listings min-h-16" onYReachEnd={ this.hideGradientDebounced } onScrollUp={ this.showGradientDebounced }>
                    { listingsNodes }
                </PerfectScrollbar>

                <div className={ "absolute pin-b pin-l h-50px w-full pointer-events-none z-20 bg-bottom-gradient " + ( this.state.scrolledToBottom ? "opacity-0" : "" ) }></div>
            </Spin>
            <div className="flex flex-col items-center bg-grey-backdrop-transparent p-3.5">
                <button
                    onClick={() => this.setListing('confirm')}
                    className={ `vpinsight__add-property-button block mt-5 mx-auto text-lg uppercase text-white font-bold rounded-lg confirm-add-property ${ListingSelected ? 'bg-water-blue hover:bg-water-blue-hover' : 'bg-grey-light pointer-events-none'}`}
                >
                    Confirm
                </button>
            </div>
        </>);

        const mobileModalOptions = {
            active: modalListingActive,
            onHide: this.toggleListingModal
        }

        return (
            <>
            { !mobile && (
                <Modal
                    visible={modalListingActive}
                    onClose={this.toggleListingModal.bind(this)}
                    onCancel={this.toggleListingModal.bind(this)}
                    footer={null}
                    bodyStyle={{
                        padding: 0,
                        position: "relative"
                    }}

                    className={ "listingsModal__container rounded-lg" }

                    zIndex={1002}
                    centered={true}
                >
                    { content }
                </Modal>
            ) }

            { (mobile && mobileModalOptions.active) && (
                <MobileModal {...mobileModalOptions}>
                    <section className="rounded-lg bg-white h-auto w-5/6 mx-auto my-12  flex flex-col">
                        { content }
                    </section>
                </MobileModal>
            ) }
            </>
        )
    }
};

const mapStateToProps = (state) => ({
    //  Property settings
    propertyForm: state.Settings.propertyForm,
    editedProperty: state.Settings.editedProperty,
    newProp: state.Settings.newProp,
    //  Listing settings
    listingsModalPropertyID: state.Settings.listingsModalPropertyID,
    loadingListingModal: state.Settings.loadingListingModal,
    selectingListingFrom: state.Settings.selectingListingFrom,

    foundListings: state.Settings.foundListings,
    foundListingSuccess: state.Settings.foundListingSuccess,
    modalListingActive: state.Settings.modalListingActive,

    user: state.Auth.currentUser,
    view: state.App.view
});

const mapDispatchToProps = {
    //  Set listing in new Property form
    setListing,
    //  Set a default Listing for an existing Property
    setDefaultListing,
    //  Add Property when default listing is selected
    addProperty,
    //  Toggle this modal
    toggleListingModal,
    //  Load more listings in the area
    getPropertyCompetition,
    setSelectingListing,
    setEditedProperty,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListingsModal);
