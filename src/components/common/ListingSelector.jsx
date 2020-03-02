import React, { Component } from 'react'
import { connect } from "react-redux";

import appActions from "../../redux/app/actions";

//  New components
import ButtonGroup from './ButtonGroup'

import { getVrboType } from '../utility/propertyListing';

//  SCSS
import "../../scss/components/ListingSelector.scss";

const { changeListing } = appActions;

/**
 * This component handles changing listing from AirBnB to VRBO
 */
class ListingSelector extends Component {

    buttons = [];

    componentWillMount() {
        const current_property = this.props.user.current_user_property[0];

        if ( current_property.airbnb_listing_id !== null ) {
            this.buttons.push( {
                key: 0,
                title: "AIR",
                handler: () => {
                    this.props.changeListing( {
                        key: String( current_property.airbnb_listing.id )
                    } )
                }
            } )
        }

        if ( current_property.vrbo_listing_id !== null ) {
            const { type } = getVrboType(current_property.vrbo_listing)
            this.buttons.push( {
                key: 1,
                title: type,
                handler: () => {
                    this.props.changeListing( {
                        key: String( current_property.vrbo_listing.id )
                    } )
                }
            } )
        }
    }

    render() {
        const { currently_selected_market_id } = this.props.user.current_user_property[0];

        const buttonsClass = "vpinsight__listing-buttons " + ( currently_selected_market_id === 2 ? "vrbo_selected" : "" );
        const activeButton = ( currently_selected_market_id === 1 ? 0 : 1 );

        if ( this.buttons.length === 0 ) {
            return ""
        }

        return (
            <ButtonGroup buttons={this.buttons} activeButton={activeButton} class={buttonsClass}/>
        );
    }
}


export default connect(
    state => ({
      ...state.App,
      user: state.Auth.currentUser
    }),
    { changeListing }
  )(ListingSelector);
