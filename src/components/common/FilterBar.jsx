import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Dropdown, Menu, Checkbox, Slider } from "antd";
import IntlMessages from '../../components/utility/intlMessages';

import filterActions from "../../redux/filter/actions";

import Icon from "./Icon";

import "../../scss/components/FilterBar.scss";
import MinMaxFilterInput from './MinMaxFilterInput';

const {
    getFilterOptions,
    setFilterRestored,
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

export class FilterBar extends Component {

    state = {
        amenitiesOverlayVisible: false,
        distanceOverlayVisible: false,
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
     * Toggle comps filter:
     *   This sets filter values to match competition
     *   available for selected listing
     */
    toggleComps = () => {
        const { toggleComps } = this.props;
        toggleComps();
    }


    /**
     * Handle change in dropdown visibility of amenities
     *
     * @param {boolean} flag - overlay visible?
     */
    handleAmenitiesVisibleChange = (flag) => {
        this.setState( { amenitiesOverlayVisible: flag } );
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
                    <Icon name={ type.icon } class="text-base mr-2" /> { type.name }
                </Menu.Item>
            );
        } )

        const rentalTypeOverlay = (
            <Menu onClick={ this.setRentalType }>
                { rentalTypeMenu }
            </Menu>
        );

        const amenitiesOverlay = (
            <div className="vpinsight__filter-amenities-overlay rounded-lg bg-white overflow-hidder">
                <CheckboxGroup
                    options={ options.amenities }
                    defaultValue={this.state.defaultAmenities}
                    onChange={ this.setAmenities }
                    className="w-full h-full flex flex-col flex-wrap"
                />
            </div>
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

        return (
            <div className="vpinsight__filter-bar flex z-10 justify-between items-center w-full h-28 px-7 bg-white absolute pin-l shadow-vp-header">

                {/* Loading overlay */}
                <div className={ "absolute pin-t pin-l w-full h-full bg-white z-30 " + ( loading ? "opacity-50" : "opacity-0 pointer-events-none" ) }></div>

                <Dropdown overlay={rentalTypeOverlay} trigger={['click']}>
                    <div className="mr-5 vpinsight__filter-block-container flex-grow">
                        <div className={ labelClassName }>
                            <IntlMessages id="filter.rentalTypes" />
                        </div>
                        <div className={blockClassName}>
                            { filter.rentalType == null ? "Loading..." : (
                                <><Icon name={ filter.rentalType.icon } class="text-base" /> { filter.rentalType.name } <Icon name="arrow-down" class="text-arrow text-xxs"/></>
                            ) }
                        </div>
                    </div>
                </Dropdown>

                <MinMaxFilterInput
                    title="filter.nightlyRate"
                    handler={ this.setNightlyRate }
                    defaultValue={[0,1000]}
                    max={1000}
                    maxAlias={"∞"}
                    prefix={"$"}
                    values={ filter.nightlyRate }
                    className="mr-5 vpinsight__filter-block-container"
                />

                <Dropdown
                    overlay={amenitiesOverlay}
                    trigger={['click']}
                    onVisibleChange={this.handleAmenitiesVisibleChange}
                    visible={this.state.amenitiesOverlayVisible}
                >
                    <div className="mr-5 vpinsight__filter-block-container flex-grow">
                        <div className={ labelClassName }>
                            <IntlMessages id="filter.amenities" />
                        </div>
                        <div className={ blockClassName }>
                            <Icon name="amenities" class="text-base"/> { filter.amenities.length } Selected <Icon name="arrow-down" class="text-arrow text-xxs"/>
                        </div>
                    </div>
                </Dropdown>

                <MinMaxFilterInput
                    title="filter.bedrooms"
                    handler={ this.setBedrooms }
                    defaultValue={[0,15]}
                    min={0}
                    max={15}
                    minAlias={"Studio"}
                    maxAlias={"∞"}
                    values={ filter.bedrooms }
                    className="mr-5 vpinsight__filter-block-container"
                />

                <MinMaxFilterInput
                    title="filter.guests"
                    handler={ this.setGuests }
                    defaultValue={[1,35]}
                    min={1}
                    max={35}
                    values={ filter.guests }
                    className="mr-5 vpinsight__filter-block-container"
                />

                <Dropdown
                    overlay={distanceOverlay}
                    trigger={['click']}
                >
                    <div className="mr-5 vpinsight__filter-block-container flex-grow">
                        <div className={ labelClassName }>
                            <IntlMessages id="filter.distance" />
                        </div>
                        <div className={ blockClassName }>
                            <Icon name="map" class="text-base"/>
                            <span>
                                { filter.distance } <IntlMessages id="filter.distanceMeasure" />
                            </span>

                            <Icon name="arrow-down" class="text-arrow text-xxs"/>

                            <div className="vpinsight__minmax-slider-input absolute">
                                <Slider
                                    defaultValue={ 15 }
                                    value={ filter.distance }
                                    min={ 1 }
                                    max={ 15 }
                                    onChange={ this.setDistance }
                                    tooltipVisible={ false }
                                />
                            </div>
                        </div>
                    </div>
                </Dropdown>

                <button
                    className={ "vpinsight__filter-button p-1 flex justify-center items-center mr-5 mt-5 border rounded-lg uppercase text-xxs font-bold " + ( filter.comps ? "border-water-blue bg-water-blue text-white hover:bg-water-blue-hover hover:border-water-blue-hover" : "border-grey-border text-grey-border hover:bg-grey-border hover:text-white" ) }
                    onClick={ this.toggleComps }
                >
                    { ( filter.comps ? (<IntlMessages id="filter.comps" />) : (<IntlMessages id="filter.showComps" />) ) }
                </button>

                <button
                    className="vpinsight__filter-clear bg-grey-border rounded-full w-4 h-4 mt-4 hover:bg-grey-border-50 flex-no-shrink"
                    onClick={ this.clearFilter }
                >
                    <Icon name="cross" class="text-white text-1/2 leading-none" />
                </button>


            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    ...state.Filter,
    filterState: state.Auth.currentUser ? state.Auth.currentUser.current_user_property[0] : null,
    compsFilterState: (state.Auth.currentUser && state.Auth.currentUser.current_user_property.length) ? state.Auth.currentUser.current_user_property[0].comp_filters : null
});

const mapDispatchToProps = {
    getFilterOptions,
    setFilterRestored,
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

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar)
