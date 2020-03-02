import React, { Component } from 'react'
import { connect } from 'react-redux';

import AutosizeInput from 'react-input-autosize';
import { Slider } from 'antd';
import IntlMessages from '../../components/utility/intlMessages';

class MinMaxFilterInput extends Component {
    /**
     * Handle change in minimum value of nightly rate
     * via input
     *
     * @param {object} event - Change event
     */
    handleMin = ( event ) => {
        const { values } = this.props;

        const minValue = this.props.min || 0;
        const minAlias = this.props.minAlias || "0";
        const prefix = this.props.prefix || null;

        const trimmedValue = event.target.value.replace( minAlias, "" ).replace( prefix, "" );

        let value = ( !event.target.value || event.target.value.length === 0 ? 0 : parseInt( trimmedValue, 10 ) );

        if ( value >= this.props.max ) {
            value = this.props.max - 1;
        }

        if ( isNaN( value ) ) {
            value = minValue;
        }

        this.props.handler( value, values[1] );
    }

    /**
     * Handle change in maximum value of nightly rate
     * via input
     *
     * @param {object} event - Change event
     */
    handleMax = ( event ) => {
        const { values } = this.props;

        const maxAlias = this.props.maxAlias || "∞";
        const prefix = this.props.prefix || null;

        const trimmedValue = event.target.value.replace( maxAlias, "" ).replace( prefix, "" );

        let value = ( !event.target.value || event.target.value.length === 0 ? this.props.max : parseInt( trimmedValue, 10 ) );

        if ( isNaN( value ) ) {
            value = this.props.max;
        }

        this.props.handler( values[0], value );
    }

    /**
     * Handle change of nightly rate value
     * via Slider component
     *
     * @param {object} event - Slider event
     */
    handleSlider = ( value ) => {
        const maxValue = ( value[1] > this.props.max ? this.props.max : value[1] );
        this.props.handler( value[0], maxValue );
    }

    render() {
        const { values, defaultValue, max, min, className, hideRange, width } = this.props;

        const labelClassName = "vpinsight__filter-label text-xxs uppercase leading-loose text-lighter-grey-blue font-bold";
        const blockClassName = "vpinsight__filter-block vpinsight__filter-block-inputs relative w-full border flex justify-around items-center rounded-lg border-grey-border text-slate font-semibold text-sm"

        let fontSize = 14;

        if ( width < 1200 ) {
            fontSize = 12;
        }

        if ( width < 1100 ) {
            fontSize = 10;
        }

        const autosizeInputStyle = {
            fontSize: fontSize,
            fontWeight: 700,
            height: "100%",
            display: "flex",
            alignItems: "center"
        }

        const minValue = this.props.min || 0;
        const minAlias = this.props.minAlias || "0";
        const maxAlias = this.props.maxAlias || "∞";

        const prefix = this.props.prefix || "";

        const displayMin = ( values[0] === minValue ? minAlias : prefix + values[0].toString() );
        const displayMax = ( values[1] === this.props.max ? maxAlias : prefix + values[1].toString() );

        return (
            <div className={ "flex-grow " + className } >
                <div className={ labelClassName }>
                <IntlMessages id={ this.props.title } />
                </div>
                <div className={ blockClassName }>
                    <div className="flex justify-center items-center h-full border-r border-grey-border w-1/2">
                        <AutosizeInput type="text" style={ autosizeInputStyle } value={ displayMin } onChange={ this.handleMin }/>
                    </div>
                    <div className="flex justify-center items-center h-full w-1/2">
                        <AutosizeInput type="text" style={ autosizeInputStyle } value={ displayMax } onChange={ this.handleMax }/>
                    </div>

                    { hideRange !== true && (
                        <div className="vpinsight__minmax-slider-input absolute">
                            <Slider
                                range
                                defaultValue={ defaultValue }
                                value={ values }
                                min={ min }
                                max={ max }
                                onChange={ this.handleSlider }
                                tooltipVisible={ false }
                            />
                        </div>
                    ) }
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    width: state.App.width
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(MinMaxFilterInput)
