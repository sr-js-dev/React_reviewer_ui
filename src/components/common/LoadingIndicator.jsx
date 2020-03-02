import React, { Component } from 'react'

import LoadingAnimation from "./LoadingAnimation";

import "../../scss/components/LoadingIndicator.scss";

export default class LoadingIndicator extends Component {
    render() {
        return (
            <div
                className={ "vpinsight__loading-indicator absolute pin-t pin-l w-full h-full bg-white-50 z-50 " + ( this.props.visible ? "opacity-100" : "opacity-0 pointer-events-none")}
            >
                <LoadingAnimation />
            </div>
        )
    }
}
