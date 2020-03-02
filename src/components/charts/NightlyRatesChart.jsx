import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import numeral from 'numeral';
//  Line chart
import { Line, Chart } from 'react-chartjs-2';

import propertiesActions from "../../redux/properties/actions";
import { isMobile } from "../../redux/app/actions";

import 'chartjs-plugin-style';

import CrosshairPlugin from '../../lib/crosshairPlugin';
import squareTicksPlugin from './helpers/squareTicksPlugin';

//  Importing SCSS here to separate concerns
import "../../scss/NightlyRatesChart.css";

import ButtonGroup from "../common/ButtonGroup";

//  Custom tooltip
//  Reason:
//      toolitips available for React as components are
//      generally act as tooltips :) Weird, right?
//      But we need HTML element that looks like a tooltip
//      than we can style and position anywhere via style prop
import CustomTooltip from "../common/CustomTooltip";

import BookingIndicator from "../common/BookingIndicator";
import FreePlanIcon from '../common/FreePlanIcon';
import InfoPopup from "../common/InfoPopup";

const { getMarketPricing } = propertiesActions;
//  Demo data until I can get any data from API :)
//  Right now I am getting empty array from pricing
// import demoData from "../../demo-data/NightyRatesChart";

const _ = require('lodash/lang');

class NightlyRatesChart extends Component {
    //  Placeholder data
    state = {
        // tooltipModel: {},
        hoverPoints: [],
        tooltipVisible: false,
        mode: "Month",
        noData: false,
        blurred: false
    };

    loadPricing = () => {
        const { getMarketPricing } = this.props;
        getMarketPricing();
    };

    componentDidMount() {
        const mobile = isMobile( this.props.view );
        //  Load pricing data when component is mointed
        this.loadPricing();

        Chart.defaults.global.defaultFontFamily = "Montserrat";
        // Chart.pluginService.register( crosshairPlugin( Chart ) );

        if ( mobile ) {
            this.chartContainer.current.addEventListener( "scroll", this.hideTooltip.bind( this ) );
        }
    }

    componentWillUnmount() {
        this.chartContainer.current.removeEventListener( "scroll", this.hideTooltip.bind( this ) );
    }

    componentDidUpdate( prevProps ) {
        //  If property changed, load pricing again
        if( prevProps.user && this.props.user && prevProps.user.current_property !== this.props.user.current_property ){
            this.loadPricing();
        }
    }

    //  This is a placeholder for data, that contains chart configuration
    //  We will get actual data in generate function in render()
    placeholderChartData = {
        labels: [ "", "", "", "", "", "", "", "", "", "", "" ],
        datasets: [
            {
                label: "main",
                data: [ 1000, 1000, 1500, 500, 1500, 500, 1500, 500, 1500, 1000, 1000 ],
                backgroundColor: "transparent",
                borderColor: "rgba(255, 99, 99, 1)",
                shadowOffsetX: 0,
                shadowOffsetY: 3,
                shadowBlur: 10,
                shadowColor: 'rgba(29, 111, 220, 0.5)',
                pointBorderColor: "rgba(255, 99, 99, 0)",
                pointBackgroundColor: "rgba(255, 99, 99, 0)",
                pointRadius: 7,
                pointHoverRadius: 7,
                pointBorderWidth: 1,
                pointHoverBorderColor: "#fff",
                pointHoverBackgroundColor: "#195FCA"
            },
            {
                label: "max",
                data: [ ],
                fill: 2,
                pointRadius: 0,
                // pointHoverRadius: 0,
                backgroundColor: "rgba(39, 132, 233, 0.2)",
                borderColor: "transparent",
            },
            {
                label: "min",
                data: [ ],
                fill: 'none',
                pointRadius: 0,
                // pointHoverRadius: 0,
                backgroundColor: "transparent",
                borderColor: "transparent",
            }
        ]
    };

    buttons = [
        {
            key: 0,
            title: "Month",
            handler: () => {
                this.setState( {
                    mode: "Month",
                    tooltipVisible: false,
                    blurred: false
                });
            }
        },
        {
            key: 1,
            title: "60 Days",
            handler: () => {
                const blurred = this.props.user && this.props.user.settings.viewable_days < 60;

                this.setState( {
                    mode: "60 Days",
                    tooltipVisible: false,
                    blurred
                });
            }
        },
        {
            key: 2,
            title: "90 Days",
            handler: () => {
                const blurred = this.props.user && this.props.user.settings.viewable_days < 90;

                this.setState( {
                    mode: "90 Days",
                    tooltipVisible: false,
                    blurred
                });
            }
        }
    ];

    chartOptions = {
        plugins: {
            crosshair: {
                color: '#195FCA',  // crosshair line color
                width: 1,        // crosshair line width
                addHeight: 0
            }
        },

        maintainAspectRatio: false,
        onHover: ( event, array ) => {
            this.customTooltip( array );
        },
        hover: {
            mode: 'index',
            intersect: false,
            animationDuration: 0,
        },
        elements: {
            point: {
                hitRadius: 14
            }
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        layout: {
            padding: {
                left: -60,
                right: -60,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        color: "rgba( 64, 85, 102, 0.08 )"
                    },
                    ticks: {
                        fontFamily: "Montserrat",
                        fontStyle: "bold",
                        fontColor: "#AFB3C0",
                        maxTicksLimit: 14,
                        beginAtZero:true,
                        maxRotation: 0,
                        minRotation: 0,
                        minor: {
                            fontSize: 12
                        },
                        major: {
                            fontSize: 12,
                        }
                    }
                }
            ],
            yAxes: [{
                gridLines: {
                    offsetGridLines: false,
                    color: "rgba( 64, 85, 102, 0.08 )",
                    zeroLineColor: "#D9DDE0"
                },
                ticks: {
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    fontStyle: "bold",
                    fontColor: "transparent",
                    maxTicksLimit: 5,
                    callback: function(value, index, values) {
                        return "   $" + value;
                    }
                }
            }]
        }
    };

    /**
     * Set properties for custom toolip when Chart.JS requests it
     *
     * @param {object} tooltipModel - tooltip data provided by Chart.js
     * @returns {object}
     */
    customTooltip = ( hoverPoints ) => {
        //  Don't do anything if tooltip is hovered over
        if ( this.state.tooltipHovered ) {
            // debugger;
            return;
        }

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

    /**
     * Set state tooltipHovered to true while hovering over the tooltip (duh :D)
     *
     * @param {object} event - mouseenter event
     */
    tooltipMouseEnter = ( event ) => {
        this.setState({
            tooltipHovered: true
        })
    }

    /**
     * Set state tooltipHovered to false when mouse is no longer hovering the tooltip (duh :D)
     *
     * @param {object} event - mouseleave event
     */
    tooltipMouseLeave = ( event ) => {
        this.setState({
            tooltipHovered: false
        })
    }

    /**
     * Return tooltip style
     *
     * @returns {object}
     */
    tooltipStyle = () => {
        if ( typeof this.canvas === "undefined" || this.state.hoverPoints.length === 0 ) {
            return {};
        }

        const pointIndex = this.state.hoverPoints[0]._index - 4;

        if ( typeof this.placeholderChartData.labels[ pointIndex ] === "undefined" || this.placeholderChartData.labels[ pointIndex ] === " " ) {
            return {};
        }

        const mobile = isMobile( this.props.view );

        let transformX = this.state.hoverPoints[0]._model.x - 145;
        let transformY = this.state.hoverPoints[0]._model.y - 50;

        if ( mobile ) {
            transformX = transformX - this.chartContainer.current.scrollLeft;
        }

        return {
            pointerEvents: ( this.state.tooltipVisible ? "auto" : "none" ),
            opacity: ( this.state.tooltipVisible ? 1 : 0 ),
            transform: `translateX( ${ transformX }px ) translateY( ${ transformY }px )`,
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

        let fillAmount = 4;

        if ( this.state.mode === "60 Days" ) {
            fillAmount = 6;
        } else if ( this.state.mode === "90 Days" ) {
            fillAmount = 8;
        }

        let pointIndex = this.state.hoverPoints[0]._index - fillAmount;
        // let tooltipModel = this.state.hoverPoints[0]._chart.tooltip._model;

        let avg = Math.round( ( this.placeholderChartData.datasets[1].data[ pointIndex ] + this.placeholderChartData.datasets[2].data[ pointIndex ] ) / 2 * 100 ) / 100;

        return (
            <React.Fragment>
                <div className="nightlyRatesChart__tooltip-top">
                    <div className="nightlyRatesChart__tooltip-date">
                        {/* Label on X axis – Date */}
                        { this.placeholderChartData.labels[ pointIndex ] }
                    </div>
                    <div className="nightlyRatesChart__tooltip-main">
                        <BookingIndicator booked={ true }/>
                        <div className="nightlyRatesChart__tooltip-value">
                            {/* Label on Y axis – Value */}
                            ${ numeral( this.placeholderChartData.datasets[0].data[ pointIndex ] ).format( "0" ) }
                        </div>
                        <button className="nightlyRatesChart__button-edit">
                        <div className="vpinsights__icon vpinsights__icon_edit"></div>
                        </button>
                    </div>
                </div>
                <div className="nightlyRatesChart__tooltip-bottom">
                    <div className="nightlyRatesChart__tooltip-bottom-section">
                        <div className="nightlyRatesChart__tooltip-bottom-value">
                            ${ numeral( this.placeholderChartData.datasets[2].data[ pointIndex ] ).format( "0" ) }
                        </div>
                        <div className="nightlyRatesChart__tooltip-bottom-label">min</div>
                    </div>
                    <div className="nightlyRatesChart__tooltip-bottom-section">
                        <div className="nightlyRatesChart__tooltip-bottom-value">
                            ${ numeral( avg ).format( "0" ) }
                        </div>
                        <div className="nightlyRatesChart__tooltip-bottom-label">avg</div>
                    </div>
                    <div className="nightlyRatesChart__tooltip-bottom-section">
                        <div className="nightlyRatesChart__tooltip-bottom-value">
                            ${ numeral( this.placeholderChartData.datasets[1].data[ pointIndex ] ).format( "0" ) }
                        </div>
                        <div className="nightlyRatesChart__tooltip-bottom-label">max</div>
                    </div>
                </div>
            </React.Fragment>
        )
    }

    /**
     * Add actual data to placeholder config for Chart.JS
     *
     * @param {object} canvas - Chart.JS canvas
     *
     * @returns {object}
     */
    getChartData = ( canvas ) => {
        const ctx = canvas.getContext("2d")
        // Fill gradient for main line
        const mainLineBorder = ctx.createLinearGradient( 0, 0, canvas.width, 0 );
        // Fill gradient for backdrop area
        const areaFill = ctx.createLinearGradient( 0, 0, canvas.width, 0 );

        //  Save canvas in Component scope
        this.canvas = canvas;

        //  Add colors to fill gradient for main line
        mainLineBorder.addColorStop( 0, '#2784E9' );
        mainLineBorder.addColorStop( 1, '#0E4DC5' );
        //  Add colors to fill gradient for backdrop area
        areaFill.addColorStop( 0, "rgba(39,132,233,0.1)" );
        areaFill.addColorStop( 1, "rgba(14,77,197,0.1)" );
        //  Assign fills
        this.placeholderChartData.datasets[0].borderColor = mainLineBorder;
        this.placeholderChartData.datasets[1].backgroundColor = areaFill;

        if ( this.props.pricing != null ) {
            //  This block should get data from this.props.pricing
            //  Labels for X axis
            //      Get from demo data
            this.placeholderChartData.labels = this.props.pricing.dates;
            //  Main line data
            //      Get from demo data
            this.placeholderChartData.datasets[0].data = this.props.pricing.main;
            //  Max line data
            //      Get from demo data
            this.placeholderChartData.datasets[1].data = this.props.pricing.max;
            //  Min line data
            //      Get from demo data
            this.placeholderChartData.datasets[2].data = this.props.pricing.min;
        }

        return this.manipulateData( this.placeholderChartData );
    }

    /**
     * Slice data according to scope mode
     *
     * @param {object} input - input data
     * @returns {object} - object with sliced datasets
     */
    manipulateData = ( input ) => {
        //  Clone from placeholder
        let data = _.cloneDeep( input );
        let slice = 90;

        /**
         * Depending on mode, slice the necessary number of data points
         * before returning data object
         */
        switch (this.state.mode) {
            case "Month":
                slice = 30;
                break;

            case "60 Days":
                slice = 60;
                break;

            default:
                break;
        }

        //  And then, only allow scope that is available in current plan
        if ( this.props.user && this.props.user.settings.viewable_days < slice ) {
            slice = this.props.user.settings.viewable_days;
        }

        data.labels = data.labels.slice( 0, slice );
        data.datasets[0].data = data.datasets[0].data.slice( 0, slice );
        data.datasets[1].data = data.datasets[1].data.slice( 0, slice );
        data.datasets[2].data = data.datasets[2].data.slice( 0, slice );


        data.labels = this.addStartEndFills( data.labels, true );
        data.datasets[0].data = this.addStartEndFills( data.datasets[0].data );
        data.datasets[1].data = this.addStartEndFills( data.datasets[1].data );
        data.datasets[2].data = this.addStartEndFills( data.datasets[2].data );

        // debugger;
        return data;
    }

    /**
     * Add fills for start and end of chart.
     *
     * This is necessary because of styling - we need to have space at
     * the start and the end of the chart.
     *
     * @param {array} data - data
     */
    addStartEndFills = ( input, empty = false ) => {
        let data = input.slice(0);
        let fillAmount = 4;

        if ( this.state.mode === "60 Days" ) {
            fillAmount = 6;
        } else if ( this.state.mode === "90 Days" ) {
            fillAmount = 8;
        }

        //  For free plan, do not change fills
        if ( this.props.user && this.props.user.settings.selected_plan === "free" ) {
            fillAmount = 4;
        }

        for (let index = 0; index < fillAmount; index++) {
            if ( empty ) {
                data.unshift( " " );
                data.push( " " );
            } else {
                data.unshift( data[0] );
                data.push( data[ data.length -1 ] );
            }
        }

        return data;
    }

    hideTooltip = () => {
        this.setState( { tooltipVisible: false } );
    }

    constructor(props) {
        super(props);

        this.chart = React.createRef();
        this.chartAxis = React.createRef();
        this.buttonGroup = React.createRef();
        this.chartContainer = React.createRef();

        this.chartPlugins = [
            CrosshairPlugin(),
            squareTicksPlugin( {
                view: this.props.view,
                axisRef: this.chartAxis
            } )
        ]
    }

    /**
     * Hide "free plan" blur block by setting state back to month view
     */
    freePlanBlurHide = () => {
        this.setState( {
            mode: "Month",
            tooltipVisible: false,
            blurred: false
        });

        this.buttonGroup.current.setState( { activeButton: 0 } );
    }

    /**
     * Return JSX element for "No data available" message
     *
     * @return {JSX} element - the block
     */
    noDataBlur = () => {
        if ( this.state.noData ) {
            return (
                <div className="nightlyRatesChart__error-message absolute pin-l text-uppercase z-10 flex justify-center items-center w-full">
                    <span className="font-bold font-4.5xl">No data available</span>
                </div>
            );
        }

        return "";
    }

    getChartOptions = () => {
        const { view } = this.props;

        let options = _.cloneDeep( this.chartOptions );

        if ( isMobile( view ) ) {
            options.scales.yAxes[0].ticks.maxTicksLimit = 4;
        }

        return options;
    }

    render() {
        const { view, user } = this.props;

        const mobile = isMobile( view );
        const viewable_days = ( user && user.settings.viewable_days ? user.settings.viewable_days : 30 );

        /**
         * JSX element for free plan call to upgrade action
         */
        const freePlanBlur = (
            <div className={ "nightlyRatesChart__error-message absolute pin-l text-uppercase z-10 flex flex-col items-center w-full " + ( this.state.blurred && !this.state.noData ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none" ) + ( mobile ? " justify-around px-8 py-3.5" : " justify-center")}>
                <FreePlanIcon name="price-correction" />

                <div className={ "text-lg text-slate text-center " + ( mobile ? "" : "my-7" ) }>
                    Pricing Data is Limited
                </div>

                <div className={ "text-sm text-slate opacity-60 text-center " + ( mobile ? "" : "mb-8" ) }>
                    You are allowed to see only <strong>{ viewable_days } days</strong> of pricing data.
                    { !mobile && (<br/>) }
                    To get access to more data - upgrade your plan.
                </div>

                <div className={ "flex " + ( mobile ? "flex-col-reverse" : "" ) }>
                    <button className={ "font-bold text-sm uppercase text-white bg-light-grey-blue rounded-lg px-6 " + ( !mobile ? "mx-2.5 h-14" : "mt-2.5 h-12" ) } onClick={ this.freePlanBlurHide }>
                        CANCEL
                    </button>
                    <Link to="/dashboard/settings?tab=Subscriprion" className={ "text-sm flex justify-center items-center font-bold uppercase text-white hover:text-white bg-water-blue hover:bg-water-blue-hover rounded-lg px-6 shadow-vp-blue hover:shadow-vp-blue-active " + ( !mobile ? "mx-2.5 h-14" : "h-12" ) } >
                        VIEW PLANS
                    </Link>
                </div>
            </div>
        );

        const chartOptions = this.getChartOptions();

        return (
            <section className={ "nightlyRatesChart__container relative rounded-lg bg-white shadow-vp-default " + ( mobile ? "p-3.5 mb-3.5" : "p-50px mb-5" ) }>
                
                <InfoPopup text={"infoPopup.nightlyRates"} styleWrapper={{"top": "20px", "right": "20px"}} classWrapper={"absolute"} iconPlacement={"topRight"}/>
                
                <section className="nightlyRatesChart__top">
                    <section className={ "font-semibold text-center " + ( mobile ? "text-2xl mb-6 mt-2.5" : "text-2.5xl" ) }>
                        Nightly Rates
                    </section>

                    <ButtonGroup ref={ this.buttonGroup } buttons={this.buttons} />
                </section>

                <section className={ "nightlyRatesChart__chart-container relative overflow-hidden " + ( mobile ? "mb-3.5" : "" ) } ref={ this.chartContainer }>
                    <section className={ "nightlyRatesChart__chart " + ( this.state.blurred ? "nightlyRatesChart__chart_blurred" : '' ) }>
                        <Line
                            ref={this.chart}
                            data={this.getChartData}
                            options={chartOptions}
                            plugins={this.chartPlugins}

                            onMouseLeave={ () => { this.hideTooltip(); } }
                            onMouseOut={ () => { this.hideTooltip(); } }
                        />
                    </section>
                </section>

                <section className="nightlyRatesChart__chart-axis-container w-full absolute overflow-hidden pointer-events-none">
                    <canvas ref={ this.chartAxis } className="nightlyRatesChart__chart-axis relative pin-t pin-l w-full h-full pointer-events-none"></canvas>
                </section>

                { this.noDataBlur() }

                { freePlanBlur }

                <CustomTooltip
                    content={this.getTooltipInside}
                    style={this.tooltipStyle()}
                    className={"nightlyRatesChart__tooltip"}
                    ref={ ( el ) => { this.tooltip = el } }
                    onMouseEnter={ this.tooltipMouseEnter }
                    onMouseLeave={ this.tooltipMouseLeave }
                >
                </CustomTooltip>


            </section>
        );
    }
}

export default connect(
    state => ({
        user: state.Auth.currentUser,
        pricing: state.Properties.pricing,
        loadingPricingChart: state.Properties.loadingPricingChart,

        view: state.App.view
    }),
    { getMarketPricing }
  )(NightlyRatesChart);
