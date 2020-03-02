import React, { Component } from 'react'

//
import "../../scss/misc/iconfont.scss";

/**
 * Icon component
 */
export default class Icon extends Component {
    render() {
        return (
            <span
                className={ "icon-" + this.props.name + " " + this.props.class }
                style={ this.props.style }
                onClick={this.props.onClick}
            />
        )
    }
}


Icon.defaultProps = {
	onClick: () => {},
}