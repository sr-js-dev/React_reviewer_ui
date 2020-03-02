import React, { Component } from 'react'
import _ from "lodash";
import { connect } from 'react-redux'

import { Dropdown, Menu, Checkbox } from "antd";
import IntlMessages from '../../components/utility/intlMessages';

import filterActions from "../../redux/filter/actions";

import Icon from "./Icon";

import "../../scss/components/FilterBar.scss";
import MinMaxFilterInput from './MinMaxFilterInput';
import MobileModal from "./MobileModal";

const {
    getFilterOptions,
    setFilter,
    setRentalType,
    setNightlyRate,
    setAmenities,
    setBedrooms,
    setGuests,
    setDistance,
    toggleComps,
    restoreFilterSilent
} = filterActions

const CheckboxGroup = Checkbox.Group;

export class FilterMobile extends Component {

    state = {
        filterModalVisible: false,
        amenitiesModalVisible: false,
        distanceModalVisible: false,
        defaultAmenities: []
    }

    componentDidMount() {
        this.props.getFilterOptions();
    }

    componentDidUpdate( prevProps ) {
        const { restoreFilterSilent, filterState, restored } = this.props;

        if ( !restored && filterState ) {
            restoreFilterSilent( filterState );
        }

    }

    /**
     * Get filter options from the API
     */
    getFilterOptions = () => {
        const { getFilterOptions } = this.props;
        getFilterOptions();
    }

    /**
     * Clear filter ( set all values as default )
     */
    clearFilter = () => {
        const { setFilter } = this.props;
        setFilter( "clear" );
    }

    /**
     * Set the rental type
     *
     * @param {string} event - click event from Menu component, represents "name" property
     */
    setRentalType = ( event ) => {
        const { setRentalType } = this.props;
        setRentalType( event.key );
    }
     /**
     * Set the nightly rates
     *
     * @param {number} min - min value
     * @param {number} max - max value
     */
    setNightlyRate = ( min, max ) => {
        const { setNightlyRate } = this.props;
        setNightlyRate( min, max );
    }
    /**
     * Set the amenities
     *
     * @param {Array<String>} amenities - array of amenities
     */
    setAmenities = ( amenities ) => {
        const { setAmenities } = this.props;
        setAmenities( amenities );
    }
    /**
     * Set the bedroom number
     *
     * @param {number} min - min value
     * @param {number} max - max value
     */
    setBedrooms = ( min, max ) => {
        const { setBedrooms } = this.props;
        setBedrooms( min, max );
    }
    /**
     * Set the guests number
     *
     * @param {number} min - min value
     * @param {number} max - max value
     */
    setGuests = ( min, max ) => {
        const { setGuests } = this.props;
        setGuests( min, max );
    }
    /**
     * Set the distance
     *
     * @param {number} min - min value
     * @param {number} max - max value
     */
    setDistance = ( value ) => {
        const { setDistance } = this.props;
        setDistance( value );
    }
    /**
     *
     * Toggle comps filter:
     *   This sets filter values to match competition
     *   available for selected listing
     */
    toggleComps = () => {
        const { toggleComps } = this.props;
        toggleComps();
    }


    showFilterModal = ( event ) => {
        this.setState( { filterModalVisible: true } );
    }

    hideFilterModal = ( event ) => {
        this.setState( { filterModalVisible: false } );
    }


    showAmenitiesModal = ( event ) => {
        this.setState( {
            filterModalVisible: false,
            amenitiesModalVisible: true
        } );
    }

    hideAmenitiesModal = ( event ) => {
        this.setState( {
            filterModalVisible: true,
            amenitiesModalVisible: false
        } );
    }

    getNumberOfAppliedFilters = () => {
        const { filter, filterDefaults } = this.props;

        if ( typeof filterDefaults === "undefined" ) {
            return 0;
        }

        const filteredValues = _.filter( filter, function( value, key ) {
            return !_.isEqual( value, filterDefaults[ key ] );
        } );

        return filteredValues.length;
    }

    /**
     * Handle setting distance from preset in menu
     *
     * @param {object} event - Menu component click event
     */
    menuSetDistance = ( event ) => {
        this.setDistance( parseInt( event.key, 10 ) );
    }

    render() {
        const { options, filter, loading } = this.props;

        const rentalTypeMenu = options.rentalTypes.map( ( type ) => {
            return (
                <Menu.Item key={ type.name } className="w-full flex items-center border-bottom-grey-border text-slate leading-none font-semibold text-sm">
                    <Icon name={ type.icon } class="text-base mr-4" /> { type.name }
                </Menu.Item>
            );
        } )

        const rentalTypeOverlay = (
            <Menu onClick={ this.setRentalType }>
                { rentalTypeMenu }
            </Menu>
        );

        const distanceOverlay = (
            <Menu onClick={ this.menuSetDistance }>
                <Menu.Item key={ 1 } className="w-full flex items-center border-bottom-grey-border text-slate leading-none font-semibold text-sm">
                    1 Mile
                </Menu.Item>
                <Menu.Item key={ 2 } className="w-full flex items-center border-bottom-grey-border text-slate leading-none font-semibold text-sm">
                    2 Miles
                </Menu.Item>
                <Menu.Item key={ 5 } className="w-full flex items-center border-bottom-grey-border text-slate leading-none font-semibold text-sm">
                    5 Miles
                </Menu.Item>
                <Menu.Item key={ 10 } className="w-full flex items-center border-bottom-grey-border text-slate leading-none font-semibold text-sm">
                    10 Miles
                </Menu.Item>
                <Menu.Item key={ 15 } className="w-full flex items-center border-bottom-grey-border text-slate leading-none font-semibold text-sm">
                    15 Miles
                </Menu.Item>
            </Menu>
        );

        const labelClassName = "vpinsight__filter-label text-xxs uppercase leading-loose text-lighter-grey-blue font-bold";
        const blockClassName = "vpinsight__filter-block relative w-full border flex justify-between items-center rounded-lg border-grey-border text-slate leading-none font-semibold text-sm"

        const appliedFilters = this.getNumberOfAppliedFilters();

        return (
            <>

            {/* The bar itself */}
            <div
                onClick={ this.showFilterModal }
                className={ "vpinsight__filter-bar-mobile flex justify-center items-center w-full h-12 text-xs font-bold uppercase bg-white absolute z-30 pin-l shadow-vp-header " + ( appliedFilters === 0 ? "text-light-grey-blue" : "text-water-blue" ) }
            >
                <Icon name="filter" class="mr-3 h-3" />

                <span>
                    { appliedFilters === 0 ? "Filter" : `${ appliedFilters } Filters Applied` }
                </span>

                {/* Loading overlay */}
                <div className={ "absolute pin-t pin-l w-full h-full bg-white z-30 " + ( loading ? "opacity-50" : "opacity-0 pointer-events-none" ) }></div>
            </div>

            {/* Filter general modal */}
            {this.state.filterModalVisible &&
            <MobileModal
                active={ this.state.filterModalVisible }
                onHide={ this.hideFilterModal }
            >

                <section className="rounded-lg bg-white h-auto w-3/4 mx-auto my-7 p-4">
                    {/* Rental Types */}
                    <Dropdown overlay={rentalTypeOverlay} trigger={['click']}>
                        <div className="mb-4 flex-grow">
                            <div className={ labelClassName }>
                                <IntlMessages id="filter.rentalTypes" />
                            </div>
                            <div className={ blockClassName }>
                                { filter.rentalType == null ? "Loading..." : (
                                    <>
                                        <Icon name={ filter.rentalType.icon } class="text-base" />

                                        <span className="flex-grow mx-4">
                                            { filter.rentalType.name }
                                        </span>

                                        <Icon name="arrow-down" class="text-arrow text-xxs"/>
                                    </>
                                ) }
                            </div>
                        </div>
                    </Dropdown>

                    {/* Nightly Rates */}
                    <MinMaxFilterInput
                        title="filter.nightlyRate"
                        handler={ this.setNightlyRate }
                        defaultValue={[0,1000]}
                        max={1000}
                        maxAlias={"∞"}
                        prefix={"$"}
                        values={ filter.nightlyRate }
                        className="mb-4"
                        hideRange={true}
                    />

                    {/* Amenities */}
                    <div className="mb-4 flex-grow" onClick={ this.showAmenitiesModal }>
                        <div className={ labelClassName }>
                            <IntlMessages id="filter.amenities" />
                        </div>
                        <div className={ blockClassName }>
                            <Icon name="amenities" class="text-base"/>

                            <span className="flex-grow mx-4">
                                { filter.amenities.length } Selected
                            </span>

                            <Icon name="arrow-down" class="text-arrow text-xxs"/>
                        </div>
                    </div>

                    {/* Bedrooms */}
                    <MinMaxFilterInput
                        title="filter.bedrooms"
                        handler={ this.setBedrooms }
                        defaultValue={[0,15]}
                        min={0}
                        max={15}
                        minAlias={"Studio"}
                        maxAlias={"∞"}
                        values={ filter.bedrooms }
                        className="mb-4"
                        hideRange={true}
                    />

                    {/* Guests */}
                    <MinMaxFilterInput
                        title="filter.guests"
                        handler={ this.setGuests }
                        defaultValue={[1,35]}
                        min={1}
                        max={35}
                        values={ filter.guests }
                        className="mb-4"
                        hideRange={true}
                    />

                    {/* Distance */}
                    <Dropdown
                        overlay={distanceOverlay}
                        trigger={['click']}
                    >
                        <div className="mb-4 flex-grow">
                            <div className={ labelClassName }>
                                <IntlMessages id="filter.distance" />
                            </div>
                            <div className={ blockClassName }>
                                <Icon name="map" class="text-base"/>

                                <span className="flex-grow mx-4">
                                    { filter.distance } <IntlMessages id="filter.distanceMeasure" />
                                </span>

                                <Icon name="arrow-down" class="text-arrow text-xxs"/>
                            </div>
                        </div>
                    </Dropdown>

                    <section className="flex">
                        <button
                            className={ "vpinsight__filter-button p-1 flex-grow flex justify-center items-center mr-2.5 border rounded-lg uppercase text-xs font-bold " + ( filter.comps ? "border-water-blue bg-water-blue text-white hover:bg-water-blue-hover hover:border-water-blue-hover" : "border-grey-border text-grey-border hover:bg-grey-border hover:text-white" ) }
                            onClick={ this.toggleComps }
                        >
                            { ( filter.comps ? (<IntlMessages id="filter.comps" />) : (<IntlMessages id="filter.showComps" />) ) }
                        </button>

                        <button
                            className={ "vpinsight__filter-button p-1 flex flex-grow justify-center items-center border rounded-lg uppercase text-xs font-bold bg-grey-border-2 border-grey-border-2 text-white leading-normal" }
                            onClick={ this.clearFilter }
                        >
                            <span className="vpinsight__filter-clear flex justify-center items-center mr-2.5 bg-white rounded-full w-4 h-4">
                                <Icon name="cross" class="text-grey-border text-1/2 leading-none" />
                            </span>

                            <span>Reset All</span>
                        </button>
                    </section>
                </section>
            </MobileModal>
            }
            {/* Amenities Modal */}
            {this.state.amenitiesModalVisible &&
            <MobileModal
                active={ this.state.amenitiesModalVisible }
                onHide={ this.hideAmenitiesModal }
            >
                <section className="rounded-lg bg-white h-auto w-3/4 mx-auto my-7 flex flex-col">
                    {/* Header */}
                    <section className="flex flex-no-shrink h-11 font-bold uppercase justify-center items-center text-lighter-grey-blue text-xs border-b">
                        Amenities
                    </section>

                    <section className="vpinsight__filter-amenities-overlay overflow-scroll">
                        <CheckboxGroup
                            options={ options.amenities }
                            defaultValue={this.state.defaultAmenities}
                            onChange={ this.setAmenities }
                            className="w-full h-auto"
                        />
                    </section>

                    {/* Footer */}
                    <section className="px-4 py-6 flex-no-shrink border-t">
                        <button
                            onClick={ this.hideAmenitiesModal }
                            className={ "w-full h-9.5 text-white text-xs font-bold uppercase rounded-lg " + ( filter.amenities.length > 0 ? "bg-water-blue" : "bg-light-grey-blue" )}
                        >
                            { filter.amenities.length === 0 && "Cancel" }

                            { filter.amenities.length > 0 && (
                                <span>Apply – { filter.amenities.length } Amenities</span>
                            ) }
                        </button>
                    </section>
                </section>
            </MobileModal>
            }
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    ...state.Filter,
    filterState: state.Auth.currentUser ? state.Auth.currentUser.current_user_property[0] : null,
    compsFilterState: state.Auth.currentUser ? state.Auth.currentUser.current_user_property[0].comp_filters : null
})

const mapDispatchToProps = {
    getFilterOptions,
    setFilter,
    setRentalType,
    setNightlyRate,
    setAmenities,
    setBedrooms,
    setGuests,
    setDistance,
    toggleComps,
    restoreFilterSilent
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterMobile)
