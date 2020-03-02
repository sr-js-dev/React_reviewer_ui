import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from "lodash";

import IntlMessages from '../../components/utility/intlMessages';
import Spin from "../uielements/spin";
import InfoPopup from "../common/InfoPopup";

import { HorizontalBar } from 'react-chartjs-2';

export class SmallBarChart extends Component {
    static propTypes = {
        label1: PropTypes.string,
        label2: PropTypes.string,
        datasets: PropTypes.array
    }

    chartJSOptions = {
        cornerRadius: 4,
        maintainAspectRatio: false,
        plugins: {
            drawRoundedBars: {
                gradientMode: "dataset",
                gradients: [
                    [ "#0E4DC5", "#2784E9" ],
                    [ "#FA5F33", "#FBDC4F" ]
                ]
            }
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        },
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display: false,
                        drawTicks: false,
                        drawBorder: false
                    },
                    ticks: {
                        display: false
                    }
                }
            ],
            yAxes: [
                {
                    categoryPercentage: 1,
                    barPercentage: .9,
                    maxBarThickness: 14,
                    gridLines: {
                        display: false,
                        drawTicks: false,
                    }
                }
            ],
        }
    };

    chartJSPlaceholder = {
        labels: [ "" ],
        datasets: [
            {
                label: " ",
                data: [ 0 ]
            },
            {
                label: "  ",
                data: [ 0 ]
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

        let ret = _.cloneDeep( this.chartJSPlaceholder );

        if ( this.props.datasets ) {
            ret.datasets[0].data = this.props.datasets[0].data;
            ret.datasets[1].data = this.props.datasets[1].data;
        }

        return ret;
    }

    getChartOptions = () => {
        let options = _.cloneDeep( this.chartJSOptions );

        options.plugins.drawRoundedBars.chartName = this.props.label1;

        if ( this.props.datasets ) {
            options.scales.xAxes[0].ticks.max = Math.max( this.props.datasets[0].data[0], this.props.datasets[1].data[0] );
            options.scales.xAxes[0].ticks.min = 0;
        }

        return options;
    }

    shouldComponentUpdate( nextProps, nextState ) {
        const { datasets } = this.props;

        if ( datasets === null && nextProps.datasets === null ) {
            return false;
        }

        if ( datasets && datasets[0].data === nextProps.datasets[0].data && datasets[1].data === nextProps.datasets[1].data ) {
            return false;
        }

        return true;
    }

    render() {
        const options = ( this.getChartOptions() );
        const data = ( this.getChartData() );

        return (
            <section className="relative overflow-hidden rounded-lg bg-white shadow-vp-default w-1/3 h-full p-50px mr-5 flex flex-col flex-no-shrink">
                { this.props.isNightlyRates && <InfoPopup text={"infoPopup.avg_rate"} styleWrapper={{"top": "20px", "right": "20px"}} classWrapper={"absolute"}/>}
                { this.props.isDaysBooked && <InfoPopup text={"infoPopup.daysBooked"} styleWrapper={{"top": "20px", "right": "20px"}} classWrapper={"absolute"}/>}
                <section className="text-lg font-bold leading-none mb-8 flex-no-shrink">
                    <IntlMessages id={ this.props.label1 } />
                </section>

                <section className="flex flex-col justify-around flex-grow">
                    <Spin spinning={this.props.loading}>
                        <>
                            <section className="text-4.2xl font-bold leading-none">
                                {( this.props.datasets ? `${ this.props.prefix || "" }${this.props.datasets[0].data[0]}` : "Loading..." )}
                            </section>

                            <section className="h-13 w-full my-2">
                                <HorizontalBar data={ data } options={ options }/>
                            </section>

                            <section className="text-light-grey-blue">
                                {( this.props.datasets ? (
                                    <span className="text-lg font-bold mr-1">{ this.props.prefix || "" }{ this.props.datasets[1].data[0] }</span>
                                ) : (
                                    <span className="text-lg font-bold mr-1">Loading...</span>
                                ) )}

                                <span className="text-xs">
                                    <IntlMessages id={ this.props.label2 } />
                                </span>
                            </section>
                        </>
                    </Spin>
                </section>
            </section>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SmallBarChart)

