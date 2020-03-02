import React, { Component } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";

//  Line chart
import { Line, Chart } from 'react-chartjs-2';
import IntlMessages from '../../components/utility/intlMessages';
import { isMobile } from "../../redux/app/actions";
import 'chartjs-plugin-style';

import propertiesActions from "../../redux/properties/actions";

import CrosshairPlugin from '../../lib/crosshairPlugin';
import squareTicksPlugin from './helpers/squareTicksPlugin';

//  Importing SCSS here to separate concerns
import "../../scss/components/MarketBookingChart.scss";

import ButtonGroup from "../common/ButtonGroup";
import BookingIndicator from "../common/BookingIndicator";
import FreePlanIcon from '../common/FreePlanIcon';

//  Custom tooltip
//  Reason:
//      toolitips available for React as components are
//      generally act as tooltips :) Weird, right?
//      But we need HTML element that looks like a tooltip
//      than we can style and position anywhere via style prop
import CustomTooltip from "../common/CustomTooltip";
import InfoPopup from "../common/InfoPopup";

const { getMarketBooking } = propertiesActions;

class MarketBookingChart extends Component {
    //  Placeholder data
    state = {
        // tooltipModel: {},
        hoverPoints: [],
        tooltipVisible: false,
        mode: "Month",
        noData: false,
        blurred: false,
    };

    loadBooking = () => {
        const { getMarketBooking } = this.props;
        getMarketBooking();
    };

    componentDidMount() {
        const mobile = isMobile( this.props.view );
        //  Load pricing data when component is mointed
        this.loadBooking();

        Chart.defaults.global.defaultFontFamily = "Montserrat";

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
            this.loadBooking();
        }
    }

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
                shadowColor: 'rgba(254, 99, 0, 0.5)',
                pointBorderColor: "rgba(255, 99, 99, 0)",
                pointBackgroundColor: "rgba(255, 99, 99, 0)",
                pointRadius: 7,
                pointHoverRadius: 7,
                pointBorderWidth: 1,
                pointHoverBorderColor: "#fff",
                pointHoverBackgroundColor: "#F8BF49",
                fill: 'origin'
            }
        ]
    };

    bottomLinePlaceholderData = {
        labels: [ "", "", "", "", "", "", "", "", "", "", "" ],
        datasets: [
            {
                label: "main",
                data: [ 1, null, 1, 1, null, 1, 1, null, 1, 1, null ],
                spanGaps: false,
                backgroundColor: "transparent",
                borderColor: "rgba(255, 99, 99, 1)",
                pointBackgroundColor: "rgba(255, 99, 99, 1)",
                borderWidth: 14,
                pointRadius: 6,
                pointHoverRadius: 6,
                pointBorderWidth: 0,
                pointHoverBorderWidth: 0,
                pointHoverBorderColor: "rgba(255, 99, 99, 1)",
                pointBorderColor: "rgba(255, 99, 99, 1)",
                fill: false
            }
        ]
    };

    syncCrosshairs = {
        crosshairX: null,
        crosshairY: null
    }

    chartOptions = {
        plugins: {
            crosshair: {
                color: '#F8BF49',  // crosshair line color
                width: 1,          // crosshair line width
                addHeight: -4
            }
        },
        maintainAspectRatio: false,
        onHover: ( event, array ) => {
            console.log( array );

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
                        offsetGridLines: false,
                        color: "rgba( 64, 85, 102, 0.08 )"
                    },
                    ticks: {
                        fontFamily: "Montserrat",
                        fontStyle: "bold",
                        fontColor: "#AFB3C0",
                        maxTicksLimit: 10,
                        maxRotation: 0,
                        minRotation: 0
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
                    max: 100,
                    min: 0,
                    maxTicksLimit: 4,
                    fontFamily: "Montserrat",
                    fontSize: 12,
                    fontStyle: "bold",
                    fontColor: "transparent",
                    callback: function(value, index, values) {
                        return "    " + value + "%";
                    }
                }
            }]
        }
    };

    bottomLineOptions = {
        maintainAspectRatio: false,
        linearGradientLine: true,
        plugins: {
            crosshair: {
                color: '#F8BF49',
                width: 1,
                offsetLeft: -1.5,
                addHeight: 12,
                offsetTop: 50,
                disableEvent: true,
                fullHeight: true
            }
        },
        onHover: ( event, array ) => {
            // console.log( array );

            // this.customTooltip( array );
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
                        offsetGridLines: false,
                        color: "rgba( 64, 85, 102, 0.08 )",
                        drawBorder: false,
                        zeroLineColor: "rgba( 64, 85, 102, 0.08 )"
                    },
                    ticks: {
                        display: false,
                        fontFamily: "Montserrat",
                        fontStyle: "bold",
                        fontColor: "#AFB3C0",
                        maxTicksLimit: 10,
                        maxRotation: 0,
                        minRotation: 0
                    }
                }
            ],
            yAxes: [{
                gridLines: {
                    display: false,
                    offsetGridLines: false,
                    color: "rgba( 64, 85, 102, 0.08 )"
                },
                ticks: {
                    display: false,
                    max: 2,
                    min: 0,
                    maxTicksLimit: 3,
                }
            }]
        }
    }

    /**
     * Set properties for custom toolip when Chart.JS requests it
     *
     * @param {object} tooltipModel - tooltip data provided by Chart.js
     * @returns {object}
     */
    customTooltip = ( hoverPoints ) => {

        //  Don't do anything if tooltip is hovered over
        if ( this.state.tooltipHovered ) {
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

        // const transformX = this.state.hoverPoints[0]._model.crosshairX - 136;
        // const transformY = this.state.hoverPoints[0]._model.y - 140;

        const mobile = isMobile( this.props.view );

        let transformX = this.state.hoverPoints[0]._model.x - 135;
        let transformY = this.state.hoverPoints[0]._model.y - 0;

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

        let pointIndex = this.state.hoverPoints[0]._index;
        // let tooltipModel = this.state.hoverPoints[0]._chart.tooltip._model;

        let label = this.placeholderChartData.labels[ pointIndex ]
        let value = this.placeholderChartData.datasets[0].data[ pointIndex ]

        return (
            <React.Fragment>
                <div className="flex w-16 h-full bg-greyish justify-center items-center rounded-l-lg">
                    <BookingIndicator booked={ ( this.bottomLinePlaceholderData.datasets[0].data[ pointIndex ] === 1 ) }/>
                </div>
                <div className="flex-grow flex flex-col items-center justify-center h-full bg-white rounded-r-lg">
                    <div className="text-xs font-bold text-light-grey-blue uppercase">{ label }</div>
                    <div className="text-4xl font-bold text-slate">{ value }%</div>
                    <div className="text-xs font-bold text-light-grey-blue uppercase">
                        <IntlMessages id="dashboard.booked" />
                    </div>
                </div>
            </React.Fragment>
        )
    }

    /**
     * Add actual data to placeholder config for Chart.JS
     *
     * @param {object} canvas - Chart.JS canvas
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
        mainLineBorder.addColorStop( 0, '#FA5F33' );
        mainLineBorder.addColorStop( 1, '#FBDC4F' );
        //  Add colors to fill gradient for backdrop area
        areaFill.addColorStop( 0, "rgba(250,95,51,0.2)" );
        areaFill.addColorStop( 1, "rgba(251,220,79,0.2)" );
        //  Assign fills
        this.placeholderChartData.datasets[0].borderColor = mainLineBorder;
        this.placeholderChartData.datasets[0].backgroundColor = areaFill;

        if ( this.props.bookings != null ) {
            this.placeholderChartData.labels = this.props.bookings.dates;
            //  Main line data
            this.placeholderChartData.datasets[0].data = this.props.bookings.market_booking_percent;
        }

        return this.manipulateData( this.placeholderChartData );
    }

    /**
     * Add data to bottom line placeholder
     *
     * @param {object} canvas - Chart.JS canvas
     * @returns {object}
     */
    bottomLineData = ( canvas ) => {
        const ctx = canvas.getContext("2d")
        // Fill gradient for main line
        const mainLineBorder = ctx.createLinearGradient( 0, 20, 0, 34 );
        const pointFill = ctx.createLinearGradient( 0, -7, 0, 7 );

        //  Add colors to fill gradient for main line
        mainLineBorder.addColorStop( 0, '#FBDC4F' );
        mainLineBorder.addColorStop( 1, '#FA5F33' );

        //  Add colors to fill gradient for main line
        pointFill.addColorStop( 0, '#FBDC4F' );
        pointFill.addColorStop( 1, '#FA5F33' );

        this.bottomLinePlaceholderData.datasets[0].borderColor = mainLineBorder;
        this.bottomLinePlaceholderData.datasets[0].pointBackgroundColor = pointFill;
        this.bottomLinePlaceholderData.datasets[0].pointHoverBackgroundColor = pointFill;
        this.bottomLinePlaceholderData.datasets[0].pointBorderColor = pointFill;
        this.bottomLinePlaceholderData.datasets[0].pointHoverBorderColor = pointFill;

        if ( this.props.bookings != null ) {
            this.bottomLinePlaceholderData.labels = this.props.bookings.dates;
            this.bottomLinePlaceholderData.datasets[0].data = this.props.bookings.listing_booking;
        }

        return this.manipulateData( this.bottomLinePlaceholderData );
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

        data.labels[0] = "";
        data.labels[ data.labels.length - 1 ] = "";

        return data;
    }

    getChartOptions = () => {
        const { view } = this.props;

        let options = _.cloneDeep( this.chartOptions );

        // if ( this.props.bookings.market_booking_percent ) {
        //     options.scales.yAxes[0].ticks.max = Math.max( ...this.props.bookings.market_booking_percent ) + 10;
        // }

        if ( isMobile( view ) ) {
            options.scales.yAxes[0].ticks.maxTicksLimit = 4;
        }

        return options;
    }

    hideTooltip = () => {
        this.setState( { tooltipVisible: false } );
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

    componentWillMount() {
        /**
         * Set default font family for ChartJS
         */
        Chart.defaults.global.defaultFontFamily = "Montserrat";
    }

    componentWillReceiveProps = ( nexProps ) => {

        let noData = nexProps.bookings == null || nexProps.bookings.dates.length === 0;

        this.setState({
            noData,
            blurred: noData
        })
    }

    constructor(props) {
        super(props);

        this.chart = React.createRef();
        this.chartAxis = React.createRef();
        this.bottomChart = React.createRef();
        this.chartContainer = React.createRef();

        this.chartPlugins = [
            CrosshairPlugin( this.syncCrosshairs ),
            squareTicksPlugin( {
                view: this.props.view,
                axisRef: this.chartAxis
            } )
        ]

        this.bottomChartPlugins = [
            CrosshairPlugin( this.syncCrosshairs )
        ]
    }

    render() {
        const { view, user } = this.props;

        const mobile = isMobile( view );
        const chartOptions = this.getChartOptions();
        const viewable_days = ( user && user.settings.viewable_days ? user.settings.viewable_days : 30 );

        const freePlanBlur = (
            <div className={ "nightlyRatesChart__error-message absolute pin-l text-uppercase z-10 flex flex-col items-center w-full " + ( this.state.blurred && !this.state.noData ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none" ) + ( mobile ? " justify-around px-8 py-3.5" : " justify-center")}>
                <FreePlanIcon name="cal" />

                <div className={ "text-lg text-slate text-center " + ( mobile ? "" : "my-7" ) }>
                    Booking Data is Limited
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

        return (
            <section className={ "nightlyRatesChart__container marketBookingChart__container flex flex-col relative rounded-lg bg-white shadow-vp-default " + ( mobile ? "p-3.5 pb-0" : "p-50px pb-0" ) }>

                <InfoPopup text={"infoPopup.marketBookingTrend"} styleWrapper={{"top": "20px", "right": "20px"}} classWrapper={"absolute"} iconPlacement={"topRight"}/>

                <section className="nightlyRatesChart__top text-center">
                    <section className={ "font-semibold text-center " + ( mobile ? "text-2xl mb-6 mt-2.5" : "text-2.5xl" ) }>
                        <IntlMessages id="dashboard.marketBookingTrend" />
                    </section>

                    <ButtonGroup buttons={this.buttons} class="marketBookingChart__buttons"/>
                </section>

                <section className={ "marketBookingChart__chart-container relative flex-grow overflow-hidden" } ref={ this.chartContainer }>
                    <section className={ "marketBookingChart__chart relative h-full " + ( this.state.blurred ? "nightlyRatesChart__chart_blurred" : '' ) }>
                        <Line ref={this.chart} data={this.getChartData} options={chartOptions} plugins={this.chartPlugins} onMouseLeave={ () => { this.hideTooltip(); } } onMouseOut={ () => { this.hideTooltip(); } } />
                    </section>
                    <section className={ "marketBookingChart__chart-bottom relative h-16 -mt-2 " + ( this.state.noData ? "" : "" ) }>
                        <Line ref={this.bottomChart} data={this.bottomLineData} options={this.bottomLineOptions} plugins={this.bottomChartPlugins} />
                    </section>
                </section>

                <section className="nightlyRatesChart__chart-axis-container marketBookingChart__chart-axis-container w-full absolute overflow-hidden pointer-events-none">
                    <canvas ref={ this.chartAxis } className="nightlyRatesChart__chart-axis relative pin-t pin-l w-full h-full pointer-events-none"></canvas>
                </section>

                { this.noDataBlur() }

                { freePlanBlur }

                <CustomTooltip
                    content={this.getTooltipInside}
                    style={this.tooltipStyle()}
                    className={"marketBookingChart__tooltip"}
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
        bookings: state.Properties.bookings,
        loadingBookingChart: state.Properties.loadingBookingChart,

        view: state.App.view
    }),
    { getMarketBooking }
  )( MarketBookingChart );
