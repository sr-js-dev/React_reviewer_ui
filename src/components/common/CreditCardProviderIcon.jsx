import React, { Component } from 'react'
import PropTypes from 'prop-types'

import "../../scss/components/CreditCardProviderIcon.scss";

export default class CreditCardProviderIcon extends Component {
    static propTypes = {
        vendor: PropTypes.string.isRequired,
        className: PropTypes.string
    }

    render() {
        const { vendor, className } = this.props;

        return (
            <div className={ `vpsinsight__credit-card-provider-icon vpsinsight__credit-card-provider-icon_${ vendor } ` + className }></div>
        );
    }
}
