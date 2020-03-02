import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from "lodash";

import {Chart, HorizontalBar} from 'react-chartjs-2';

import drawRoundedBars from "./helpers/roundedBars";
import IntlMessages from '../../components/utility/intlMessages';

export class RentalTypeChart extends Component {
    static propTypes = {
        label1: PropTypes.string,
        datasets: PropTypes.array,
        labels: PropTypes.array
    };



    chartJSOptions = {
        cornerRadius: 3.5,
        maintainAspectRatio: false,
        plugins: {
            drawRoundedBars: {
                gradientMode: "label",
                gradients: [
                    [ "#0e4dc5", "#2784e9" ],
                    [ "#fbdc4f", "#fa5f33" ],
                    [ "#ff0844", "#ffb199" ]
                ]
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
                left: 10,
                top: 15
            }
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
                },

            ],
            yAxes: [
                {
                    categoryPercentage: 1,
                    barPercentage: 0.8,
                    barThickness: 7,
                    maxBarThickness: 7,
                    gridLines: {
                        display: false,
                        drawTicks: false,
                    },

                    ticks: {
                        fontSize: 10,
                        fontFamily: "Montserrat",
                        fontColor: "#AFB3C0",
                        padding: 10,
                    }
                }
            ],
        }
    };

    chartJSPlaceholder = {
        labels: this.props.labels && [...this.props.labels],
        datasets: [
            {
                label: "",
                data: [ 824, 206, 50 ]
            }
        ]
    };

    componentDidMount() {
        Chart.elements.Rectangle.prototype.draw = drawRoundedBars;
    }

    componentWillReceiveProps(nextProps) {
        if(this.chartJSPlaceholder.labels !== nextProps.labels) this.chartJSPlaceholder.labels = nextProps.labels;
    }

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

        if (this.props.datasets) {
            ret.datasets[0].data = this.props.datasets[0].data;
        }
        return ret;
    };

    getChartOptions = () => {
        let options = _.cloneDeep(this.chartJSOptions);
        if (this.props.datasets[0].data && this.props.datasets[0].data.length !== 0) {
            options.scales.xAxes[0].ticks.max = Math.max(...this.props.datasets[0].data);
            options.scales.xAxes[0].ticks.min = 0;
        }

        return options;
    };

    render() {
        const options = this.getChartOptions();

        return (
            <section
                className="vpinsight__map-card relative overflow-hidden rounded-lg bg-white shadow-vp-map-card flex-grow py-3.5 pr-3.5 lg:px-8 px-0 lg:py-6 mr-5 flex flex-col"
            >
                <section className="lg:text-xs text-xxs text-light-grey-blue text-center font-bold leading-none flex-no-shrink">
                    <IntlMessages id={this.props.label1}/>
                </section>

                <section className="vpinsight__rental-type-chart relative h-16 mt-2 lg:mt-4">
                    <HorizontalBar
                        data={this.getChartData}
                        options={options}
                    />
                </section>
            </section>
        )
    }
}

export default RentalTypeChart
