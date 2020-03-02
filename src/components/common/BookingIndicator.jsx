import React, { Component } from 'react'
import Icon from "./Icon";

import "../../scss/components/BookingIndicator.scss";

export default class BookingIndicator extends Component {
  render() {
    const size = this.props.size || "6.5";
    const iconSize = this.props.iconSize || "sm";
    let className = `vpsinsight__booking-indicator w-${ size } h-${ size } text-${ iconSize } rounded-full flex justify-center items-center ${ this.props.className }`;

    if ( this.props.booked ) {
      className = className + " active text-white";
    } else if ( this.props.emptyCircle ) {
      className = className + " bg-white text-white border";
    } else {
      className = className + " bg-white text-lighter-grey-blue";
    }

    return (
        <div className={ className } >
            <Icon name="property" class="leading-none"/>
        </div>
    )
  }
}
