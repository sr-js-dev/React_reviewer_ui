import React, { Component } from 'react'

import "../../scss/CustomTooltip.css";

export default class CustomTooltip extends Component {

    constructor( props ) {
        super( props );
        this.container = React.createRef();
    }

    render() {
        const { className, style, onMouseEnter, onMouseLeave, content } = this.props
        return (
            <div
                className={ "vpinsights__tooltip " + className }
                style={ style }
                ref={ this.container }

                onMouseEnter={ onMouseEnter }
                onMouseLeave={ onMouseLeave }
            >
                <div className="vpinsights__tooltip-inside">
                    { content() }
                </div>
            </div>
        )
    }
}
