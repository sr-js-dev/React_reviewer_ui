import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import {Chart, Line} from 'react-chartjs-2';

import CustomTooltip from '../../components/common/CustomTooltip';
import drawRoundedBars from "./helpers/roundedBars";

class AvgRatingHistory extends Component {
    static propTypes = {
        datasets: PropTypes.array,
        labels: PropTypes.array
    };

    state = {
        // tooltipModel: {},
        hoverPoints: [],
        tooltipVisible: false,
    };

    chartJSOptions = {
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        onHover: ( event, array ) => {
            this.customTooltip( array );
        },
        hover: {
            mode: 'index',
            intersect: false,
            animationDuration: 0,
        },
        scales: {
            xAxes: [
                {
                    categoryPercentage: 1,
                    barPercentage: 0.8,
                    barThickness: 14,
                    maxBarThickness: 14,
                    gridLines: {
                        display: false,
                        drawTicks: false,
                        drawBorder: true,
                    },
                    ticks: {
                        fontSize: 10,
                        fontFamily: "Montserrat",
                        fontColor: "#AFB3C0",
                        fontStyle: "bold",
                        maxRotation: 0,
                        minRotation: 0,
                        autoSkip: false
                    }
                }
            ],
            yAxes: [
                {
                    gridLines: {
                        display: true,
                        drawTicks: false,
                        drawBorder: false,
                        color: "rgba( 64, 85, 102, 0.08 )"
                    },
                    ticks: {
                        display: false,
                        maxTicksLimit: 1
                    }
                },
            ],
        }
    };

    chartJSPlaceholder = {
        labels: ["loading"],
        datasets: [
            {
                label: "#0E4DC5, #2784E9",
                data: [8000, 16000, 29000, 18000, 22000],
                backgroundColor: "rgba(39, 132, 233, 0.2)",
                borderColor: "rgb(29, 111, 220)",
                shadowOffsetX: 0,
                shadowOffsetY: 3,
                shadowBlur: 10,
                shadowColor: 'rgba(29, 111, 220, 0.5)',
                pointRadius: 0,
                pointHoverRadius: 0,
                pointBorderWidth: 0,
                pointHoverBorderColor: "#fff",
                pointHoverBackgroundColor: "#195FCA",
                lineTension: 0,
            }
        ]
    };


    /**
     * Add actual data to placeholder config for Chart.JS
     *
     * @param {object} canvas - Chart.JS canvas
     *
     * @returns {object}
     */
    getChartData = (canvas) => {
        //  Save canvas in Component scope
        this.canvas = canvas;

        let ret = _.cloneDeep(this.chartJSPlaceholder);

        if (this.props.datasets && this.props.datasets[0].data) {
            ret.labels = _.map(this.props.labels, function (label) {
                return ["", label];
            }).slice(0, 6);

            ret.datasets[0].data = this.props.datasets[0].data.slice(0, 6);
        }

        return ret;
    };

    getChartOptions = () => {
        let options = _.cloneDeep(this.chartJSOptions);

        if (this.props.datasets) {
            options.scales.xAxes[0].ticks.max = Math.max(...this.props.datasets);
            options.scales.xAxes[0].ticks.min = 0;
        }

        return options;
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

        let transformX = this.state.hoverPoints[0]._model.x - 50;
        let transformY = this.state.hoverPoints[0]._model.y - 80;

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
        const { datasets } = this.props;
        const { hoverPoints } = this.state;

        if ( hoverPoints.length === 0 ) {
            return "";
        }

        const pointIndex = hoverPoints[0]._index;
        const pointValue = datasets[0].data[ pointIndex ];

        return (
            <div className="p-4 flex flex-col justify-center items-center" style={ { width: 100 } }>
                <span className="text-2xl leading-none text-dusk font-bold">{ pointValue }</span>
            </div>
        )
    }

    componentDidMount() {
        Chart.elements.Rectangle.prototype.draw = drawRoundedBars;
    }


    render() {
        const options = this.getChartOptions();

        return (
            <section className="vpinsight__rental-type-chart relative h-full w-full">
                <Line
                    data={this.getChartData}
                    options={options}
                />

                <CustomTooltip
                    content={this.getTooltipInside}
                    style={this.tooltipStyle()}
                    className={"reviews__rating-chart-tooltip z-40"}
                    ref={ ( el ) => { this.tooltip = el } }
                    onMouseEnter={ this.tooltipMouseEnter }
                    onMouseLeave={ this.tooltipMouseLeave }
                />
            </section>
        )
    }

}

export default AvgRatingHistory
