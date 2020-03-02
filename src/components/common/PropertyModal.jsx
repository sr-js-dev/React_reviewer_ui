import React, { Component } from 'react'
import { connect } from 'react-redux'
import clone from 'clone';
//  Components
import { Modal, Alert } from 'antd';
import Spin from '../uielements/spin';
import PlacesAutocomplete, { geocodeByAddress } from 'react-places-autocomplete';
import Icon from "./Icon";
import UpgradeModal from "./UpgradeModal";
//  Actions
import settingsActions from '../../redux/settings/actions';
//  Style
import "../../scss/components/PropertyModal.scss";
import { isMobile } from '../../redux/app/actions';
import MobileModal from './MobileModal';

//  Map to const
const { toggleModal, toggleListingModal, toggleEditModal, findListing, propertyFormUpdate } = settingsActions;

export class PropertyModal extends Component {
    state = {
        loading: false,
    }

    /**
     * Toggle property modal (this modal)
     */
    togglePropertyModal = () => {
        const { toggleModal } = this.props;
        toggleModal();
    };

    /**
     * Toggle listing modal to select default listing
     */
    toggleListingModal = () => {
        const { toggleListingModal } = this.props;
        toggleListingModal();
    };

    /**
     * When address is valid and listings are found,
     * handle control over to Listings Modal to select
     * default listing
     */
    handleSelect = ( event ) => {
        let propertyForm = clone(this.props.propertyForm);

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
        let propertyForm = clone(this.props.propertyForm);

        if ( key ) {
            propertyForm[key] = event;
        }

        this.props.propertyFormUpdate( propertyForm );
    };

    render() {
        const {
            modalActive,
            newProp,
            foundListingSuccess,
            notSupported,
            loadingListingModal,
            view,
            allowedPropertyCount,
            userPropertyCount
        } = this.props;

        const allowedAddProperty = userPropertyCount < allowedPropertyCount;

        if(!allowedAddProperty) {
            return (
                <UpgradeModal
                    visible={modalActive}
                    onClose={this.togglePropertyModal}
                    onCancel={this.togglePropertyModal}
                    title={"propModal.title"}
                    body={"propModal.body"}
                    planDataIcon={"entire-home"}
                    allowedPropertyCount={allowedPropertyCount}
                />
            )
        };

        const { propertyForm } = clone(this.props);

        const mobile = isMobile( view );

        const inputProps = {
            value: propertyForm.property_address,
            onChange: this.onRecordChange.bind(this, 'property_address'),
            placeholder: "Enter an address or location",
        };

        const content = (
            <Spin spinning={ loadingListingModal } wrapperClassName="z-10">
                {notSupported === true && (
                    <Alert
                        message="The property address you've entered isn't currently supported by our system. Try a different address or enter your email to be notified when we add support for this area."
                        type="error"
                        showIcon={true}
                    />
                )}

                <div className="flex flex-col justify-end items-center mb-3">
                    <div className="vpinsight__large-add-property-icon my-3 flex justify-center items-center rounded-full">
                        <Icon name="add-property" />
                    </div>

                    <div className="text-2.5xl text-slate text-center font-semibold">
                        Add Property
                    </div>
                </div>
                <div>
                    {!newProp && (
                        <>
                            <div className="vpinsight__places-autocomplete-input">
                                <PlacesAutocomplete inputProps={inputProps} className="bg-grey" />
                            </div>

                            <button
                                onClick={ this.handleSelect }
                                className={ "vpinsight__add-property-button block mt-5 mx-auto text-lg uppercase text-white font-bold bg-water-blue hover:bg-water-blue-hover rounded-lg " + ( propertyForm.property_address ? "" : "bg-grey-light pointer-events-none" ) }
                            >
                                Add Property
                            </button>
                        </>
                    )}
                </div>
            </Spin>
        );

        const mobileModalOptions = {
            active: modalActive,
            onHide: this.togglePropertyModal
        }

        return (
            <div>
                { !mobile && (
                <Modal
                    visible={modalActive}
                    onClose={this.togglePropertyModal.bind(this)}
                    okText={foundListingSuccess? 'Finish' : 'Add Property'}
                    onCancel={this.togglePropertyModal.bind(this)}

                    width={540}

                    zIndex={1002}
                    centered={true}
                    className="vpinsight__add-property-popup"
                    footer={null}
                >
                    { content }
                </Modal>
                ) }

                { (mobile && mobileModalOptions.active ) && (
                    <MobileModal {...mobileModalOptions}>
                        <section className="rounded-lg bg-white h-auto w-5/6 mx-auto my-6 p-6 flex flex-col">
                            { content }
                        </section>
                    </MobileModal>
                ) }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    //  Modal state
    loadingPropModal: state.Settings.loadingPropModal,
    modalActive: state.Settings.modalActive,
    //  Property settings
    propertyForm: state.Settings.propertyForm,
    newProp: state.Settings.newProp,
    //  Listings
    //  Loading indicators
    notSupported: state.Settings.notSupported,
    loadingListingModal: state.Settings.loadingListingModal,
    foundListingSuccess: state.Settings.foundListingSuccess,
    foundListings: state.Settings.foundListings,
    //  View state
    view: state.App.view,
    // allowed add
    userPropertyCount: (state.Auth.currentUser) ? state.Auth.currentUser.user_properties.length : null,
    allowedPropertyCount: (state.Auth.currentUser) ? state.Auth.currentUser.settings.allowed_properties : null
});

const mapDispatchToProps = {
    //  Toggle things
    toggleModal,
    toggleListingModal,
    toggleEditModal,
    //  Update forms
    propertyFormUpdate,
    //  Find listings at address
    findListing
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyModal);
