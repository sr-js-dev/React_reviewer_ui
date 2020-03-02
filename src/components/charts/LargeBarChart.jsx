import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from "lodash";

import { isMobile } from "../../redux/app/actions";

import IntlMessages from '../../components/utility/intlMessages';
import Spin from "../uielements/spin";

import { Chart, Bar } from 'react-chartjs-2';
import drawRoundedBars from "../../components/charts/helpers/roundedBars.js";

import CustomTooltip from '../common/CustomTooltip';

import numeral from 'numeral';

import "../../scss/components/LargeBarChart.scss";
import UpgradeModal from '../common/UpgradeModal';
import InfoPopup from "../common/InfoPopup";

export class LargeBarChart extends Component {
    static propTypes = {
        label1: PropTypes.string,
        label2: PropTypes.string,
        data: PropTypes.object
    }

    state = {
        tooltipVisible: false,
        hoverPoints: [],
        upgradeModalVisible: false
    }

    chartJSOptions = {
        maintainAspectRatio: false,
        cornerRadius: 4,
        plugins: {
            drawRoundedBars: {
                gradientMode: "dataset",
                gradients: [
                    [ "#0E4DC5", "#2784E9" ],
                    [ "#FA5F33", "#FBDC4F" ]
                ]
            }
        },
        hover: {
            mode: 'index',
            intersect: false,
            animationDuration: 0,
        },
        legend: {
            display: true,
            labels: {
                fontSize: 14,
                fontColor: "rgba(0, 0, 0, .65)",
                fontFamily: "Montserrat",
                fontStyle: "bold",
                boxWidth: 15,
                padding: 15,
                position: 'right'
            }
        },
        tooltips: {
            displayColors: false,
            backgroundColor: "#ffffff",
            enabled: true,
            mode: "single",
            bodyFontSize: 16,
            bodyFontFamily: "Montserrat-Bold",
            bodyFontColor: "#404966",
            yPadding: 10,
            xPadding: 20,
            cornerRadius: 6,
            caretPadding: 6,
            caretSize: 6,
            bodyFontStyle: "bold",
            borderWidth: 2,
            borderColor: "#f4f7f9",
            callbacks: {
                title: () => {
                  return "";
                },
                label: (tooltipItems, data) => {
                  return `$ ${tooltipItems.yLabel}`;
                }
            }
        },
        scales: {
            xAxes: [
                {
                    categoryPercentage: 0.4,
                    barPercentage: .9,
                    maxBarThickness: 14,
                    gridLines: {
                        display: false,
                        drawTicks: false,
                        drawBorder: false
                    },
                    ticks: {
                        fontFamily: "Montserrat",
                        fontStyle: "bold",
                        fontColor: "#AFB3C0",
                        fontSize: 13,
                        maxRotation: 0,
                        minRotation: 0
                    }
                }
            ],
            yAxes: [
                {
                    gridLines: {
                        color: "#EFF3F6",
                        drawBorder: false,
                        drawTicks: false,
                        zeroLineColor: "#EFF3F6"
                    },
                    ticks: {
                        maxTicksLimit: 3,
                        fontSize: 14,
                        fontFamily: "Montserrat",
                        fontStyle: "bold",
                        fontColor: "#AFB3C0",
                        min: 0,
                        callback: ( value, index, values ) => {
                            return ( this.props.prefix || "" ) + numeral( value ).format('0a').toLocaleUpperCase() + ( this.props.suffix || "" ) + "  ";
                        }
                    }
                }
            ],
        }
    };

    chartJSPlaceholder = {
        labels: [ "Jan, 2019", "Feb, 2019", "Mar, 2019", "Apr, 2019", "May, 2019", "Jun, 2019" ],
        datasets: [
            {
                label: "You",
                fill: true,
                backgroundColor: '#1e6fdb',
                data: [ 0, 0, 0, 0, 0, 0 ],
            },
            {
                label: "Market",
                fill: true,
                backgroundColor: '#f58139',
                data: [ 0, 0, 0, 0, 0, 0 ],
            }
        ]
    }

    /**
     * Add actual data to placeholder config for Chart.JS
     *
     * @param {object} canvas - Chart.JS canvas
     *
     * @returns {object}
     */
    getChartData = ( canvas ) => {
        //  Save canvas in Component scope
        this.canvas = canvas;
        const mobile = isMobile( this.props.view );

        let ret = _.cloneDeep( this.chartJSPlaceholder );
        this.numberOfRestricted = 0;

        if ( this.props.data ) {
            //  multiline labels
            ret.labels = _.map( this.props.data.labels, function( label ) {

                if ( mobile ) {
                    return [ "", label.split(", ")[0] ];
                } else {
                    return [ "", label ];
                }
            } ).slice( 0, 6 );

            ret.datasets[0].data = this.props.data.datasets[0].data.slice( 0, 6 );
            ret.datasets[1].data = this.props.data.datasets[1].data.slice( 0, 6 );
        }

        // Handle restricted datasets
        for (let index = 0; index < ret.datasets[0].data.length; index++) {
            //  If data at index is restricted
            if ( ret.datasets[0].data[ index ] === "restricted" ) {
                //  Change "restricted" string to -1 value so ChartJS accepts it
                ret.datasets[0].data[ index ] = -10;
                ret.datasets[1].data[ index ] = -10;
                //  And add +1 to restricted count
                this.numberOfRestricted = this.numberOfRestricted + 1;
            }
        }

        return ret;
    }

    getChartOptions = () => {
        let options = _.cloneDeep( this.chartJSOptions );
        const mobile = isMobile( this.props.view );

        if ( this.props.data ) {
            const isNumber = ( value ) => ( typeof value === "number" );
            const values = [ ..._.filter( this.props.data.datasets[0].data, isNumber ), ..._.filter( this.props.data.datasets[1].data, isNumber ) ]

            options.scales.yAxes[0].ticks.suggestedMax = Math.max( ...values );
        }

        options.plugins.drawRoundedBars.chartName = this.props.label1;

        if ( mobile ) {
            options.scales.yAxes[0].ticks.display = false;
            options.scales.xAxes[0].ticks.fontSize = 10;

            options.scales.xAxes[0].barPercentage = 0.8;
            options.scales.xAxes[0].categoryPercentage = 0.2;
        }

        return options;
    }

    /**
     * Set properties for custom toolip when Chart.JS requests it
     *
     * @param {object} tooltipModel - tooltip data provided by Chart.js
     * @returns {object}
     */
    customTooltip = ( hoverPoints ) => {
        if ( hoverPoints.length === 0 ) {
            this.tooltipTimeout = setTimeout(() => {
                this.setState( {
                    tooltipVisible: false,
                } )
            }, 300 );
        } else {
            clearTimeout( this.tooltipTimeout );

            this.setState( {
                tooltipVisible: true,
                hoverPoints
            } );
        }
    }

    getTooltipTransform = () => {
        if ( typeof this.canvas === "undefined" || this.state.hoverPoints.length === 0 ) {
            return {
                transform: 0
            };
        }

        const mobile = isMobile( this.props.view );
        const containerWidth = ( this.container.current ? this.container.current.offsetWidth : 0 );

        let transform = ( mobile ?  this.state.hoverPoints[0]._model.x - 92 : this.state.hoverPoints[0]._model.x - 30 );
        let tooltipClass = "largeBarChart__tooltip";

        if ( mobile && containerWidth < ( transform + 140 ) ) {
            transform = containerWidth - 140;
            tooltipClass = tooltipClass + " largeBarChart__tooltip_right";
        } else if ( mobile && ( transform - 140 ) < 0 ) {
            transform = 0;
            tooltipClass = tooltipClass + " largeBarChart__tooltip_left";
        }

        return {
            transform, tooltipClass
        };
    }

    /**
     * Return tooltip style
     *
     * @returns {object}
     */
    tooltipStyle = ( transform ) => {
        if ( typeof this.canvas === "undefined" || this.state.hoverPoints.length === 0 ) {
            return {};
        }

        let pointIndex = this.state.hoverPoints[0]._index;
        //  Find value of this bar
        let thisValue = this.state.hoverPoints[0]._chart.config.data.datasets[ 0 ].data[ pointIndex ];
        //  If it's `null` – then it's a plan restricted
        let restricted = thisValue === -1;

        if ( restricted ) {
            return {};
        }

        return {
            opacity: ( this.state.tooltipVisible ? 1 : 0 ),
            transform: `translateX( ${ transform }px )`,
        }
    }

    /**
     * Generate HTML for tooltip
     *
     * @returns {JSX}
     */
    getTooltipInside = () => {
        if ( this.state.hoverPoints.length === 0 ) {
            return "";
        }

        const mobile = isMobile( this.props.view );

        let topValue, bottomValue;

        let pointIndex = this.state.hoverPoints[0]._index;
        // let tooltipModel = this.state.hoverPoints[0]._chart.tooltip._model;

        if ( this.props.data ) {
            topValue = this.props.data.datasets[0].data[ pointIndex ]
            bottomValue = this.props.data.datasets[1].data[ pointIndex ]
        } else {
            topValue = 0;
            bottomValue = 0;
        }

        return (
            <>
                <div className="flex flex-col justify-center items-center w-full h-full">
                    <div className={ "text-2xl font-bold text-slate " + ( mobile ? "text-xl" : "text-2xl") }>${ topValue }</div>
                    <div className={ "font-bold text-light-grey-blue " + ( mobile ? "text-xxs" : "text-xs") }>
                        ${ bottomValue } <IntlMessages id={ this.props.label2 } className="uppercase" />
                    </div>
                </div>
            </>
        )
    }

    hideTooltip = () => {
        this.setState( { tooltipVisible: false } );
    }

    constructor(props) {
        super(props);

        this.chart = React.createRef();
        this.container = React.createRef();

        Chart.elements.Rectangle.prototype.draw = drawRoundedBars;

        this.chartJSOptions.plugins.drawRoundedBars.restrictedImage = new Image();
        this.chartJSOptions.plugins.drawRoundedBars.restrictedImage.src = "/images/patterns/stripes.png";
    }

    toggleUpgradeModal = () => {
        this.setState( {
            upgradeModalVisible: !this.state.upgradeModalVisible
        } )
    }

    shouldComponentUpdate( nextProps, nextState ) {
        if ( this.props.data === null && nextProps.data === null ) {
            return false;
        }

        if ( this.props.data ) {
            const { datasets } = this.props.data;
            const { newDatasets } = nextProps.data;

            if ( datasets && newDatasets && datasets[0].data === newDatasets[0].data && datasets[1].data === newDatasets[1].data ) {
                return false;
            }
        }

        return true;
    }

    render() {
        const { view } = this.props;
        const options = ( this.getChartOptions() );
        const data = ( this.getChartData() );

        const mobile = isMobile( view );

        // let planOverlayWidth = `${ ( this.numberOfRestricted * 15 ) }%`;

        let containerClass = "relative rounded-lg bg-white shadow-vp-default flex flex-col ";

        if ( mobile ) {
            containerClass = containerClass + "";
        } else {
            containerClass = containerClass + "overflow-hidded flex-grow h-full p-50px pb-8"
        }

        const planOverlay = (
            <div
                className={ "vpinsight__large-bar-plan-overlay float-right " + ( this.numberOfRestricted > 0 ? "" : "opacity-0 pointer-events-none" ) }
            >
                <span>
                    <span className="text-water-blue hover:text-water-blue-hover underline cursor-pointer" onClick={ this.toggleUpgradeModal }>Upgrade</span> to see more data
                </span>
            </div>
        );

        const tooltipTransform = this.getTooltipTransform();
        const tooltipStyle = this.tooltipStyle( tooltipTransform.transform )

        return (
            <>
                <section className={ "vpinsight__large-bar-chart-container " + containerClass } ref={ this.container }>
                    {this.props.isExpectedRevenue && <InfoPopup text={"infoPopup.expectedRevenue"} styleWrapper={{"top": "20px", "right": "20px"}} classWrapper={"absolute"} iconPlacement={"topRight"}/>}
                    {this.props.isBookingRate && <InfoPopup text={"infoPopup.bookingRate"} styleWrapper={{"top": "20px", "right": "20px"}} classWrapper={"absolute"} iconPlacement={"topRight"}/>}
                    <section className={ "leading-none flex-no-shrink " + ( mobile ? "text-sm font-semibold p-3.5" : "text-lg font-bold mb-8" ) }>
                        <IntlMessages id={ this.props.label1 } />
                        { planOverlay }
                    </section>
                    
                    <section className="vpinsight__large-bar-chart flex flex-col justify-around relative flex-grow w-full pb-3.5 z-10">
                        <Spin spinning={this.props.loading} wrapperClassName="z-10">
                            <Bar
                                data={ data }
                                options={ options }
                                onMouseLeave={ () => { this.hideTooltip(); } }
                                onMouseOut={ () => { this.hideTooltip(); } }
                            />
                        </Spin>
                    </section>

                    <CustomTooltip content={this.getTooltipInside} style={ tooltipStyle } className={ tooltipTransform.tooltipClass } ref={ ( el ) => { this.tooltip = el } }></CustomTooltip>
                </section>

                <UpgradeModal
                    visible={ this.state.upgradeModalVisible }
                    onClose={ this.toggleUpgradeModal }
                    onCancel={ this.toggleUpgradeModal }
                    planDataIcon={ this.props.planDataIcon }
                    label={ this.props.label1 }
                />
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.Auth.currentUser,
    view: state.App.view
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(LargeBarChart)
