import React, {Component} from 'react';
import { Line} from 'react-chartjs-2';
import IntlMessage from '../../components/utility/intlMessages';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ThirtyDaysBoolingChart extends Component {
      static propTypes ={
        label1: PropTypes.string,
        data1: PropTypes.array,
        data2: PropTypes.array
    };

    createPlaceholderData(min, max, length = 30, startFrom = 0) {
      return new Array(length).fill(0).map((item, i) => {
          return {
              x: i + startFrom,
              y: Math.floor(Math.random() * (max - min + 1)) + min
          }
      });
    };

    normalizeDataSet(data, start = 0) {
        return data.map((item, i) => {
            return {
                x: i + start,
                y: item
            }
        })
    }

   placeholderCharData = {
      labels: new Array(30).fill(""),
      datasets: [{
          data: this.createPlaceholderData(0, 100, 3),
          label: '',
          backgroundColor: "transparent",
          fill: 'origin',
          pointRadius: 0,
          borderWidth: 3,
          borderColor: '#1d6fdc'
      }, {
          data: this.createPlaceholderData(0, 100, 3, 3),
          label: '',
          backgroundColor: "transparent",
          fill: 'origin',
          pointRadius: 0,
          borderWidth: 1,
          borderColor: 'rgba(29, 111, 220, .1)'
      }]
   };

    charJSOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        elements: {
            line: {
                tension: 0
            }
        },
        scales: {
            xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    gridLines: {
                        display: false,
                        drawTicks: false,
                        drawBorder: false
                    },
                    ticks: { display: false }
                }],
            yAxes: [
                {
                    gridLines: {
                        display: false,
                        drawTicks: false,
                        drawBorder: false
                    },
                    ticks: {
                        display: false,
                        max: 100,
                        min: 0
                    }
                }
            ],
        },
        tooltips: { enabled: false },
        hover: { mode: null }
    };

    getChartData = (canvas) => {
        this.canvas = canvas;
        let ret = _.cloneDeep(this.placeholderCharData);

        if(this.props.data1 != null) {
            ret.datasets[0].data = this.normalizeDataSet(this.props.data1);
            if(this.props.data2.length === 0) ret.datasets.splice(1, 1);
            else ret.dataset[1].data = this.normalizeDataSet(this.props.data2, this.props.data1.length);
        }

        if(ret.datasets[1] && _.last(ret.datasets[0].data) !== ret.datasets[1].data[0]) {
            let lastVal = _.last(ret.datasets[0].data);
            let firstVal = ret.datasets[1].data[0];
            let center = (lastVal.y + firstVal.y) / 2;
            let xValue = ret.datasets[0].data.length - 1;
            ret.datasets[0].data[xValue] = {x: xValue, y: center};
            ret.datasets[1].data[0] = {x: xValue, y: center};
        }

        return ret
    };

    getCharOptions() {
        let options = _.cloneDeep(this.charJSOptions);
        return options;
    }

    render() {
        return (
            <section
                className={'vpinsight__map-card relative overflow-hidden rounded-lg bg-white shadow-vp-map-card flex-grow lg:px-8 px-3.5 py-3.5 lg:py-6 flex flex-col'}
            >
              <section className={'lg:text-xs text-xxs text-light-grey-blue text-center pb-4 font-bold leading-none flex-no-shrink'}>
                  <IntlMessage id={this.props.label1}/>
              </section>

             <section>
                 <span className={'text-xl lg:text-4.2xl font-bold text-dusk'}>64%</span>
             </section>

              <section style={{maxwidth: '80px', margin: 'auto'}} className={'relative'}>
                  <Line width={80} height={30} options={this.getCharOptions()} data={this.getChartData}/>
              </section>
            </section>
        )
    }
}

export default ThirtyDaysBoolingChart;
