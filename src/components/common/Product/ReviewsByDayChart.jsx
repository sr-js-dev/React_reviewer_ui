import React, { Component } from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import _ from 'lodash';
import numeral from 'numeral';

import ProductsService from "../../../services/ProductsService";

import leftAlignYTicks from '../../charts/helpers/leftAlignYTicks';

import CustomTooltip from "../CustomTooltip";
import { processReviewsChart } from "../../../redux/products/reducer";
import textAbovePointPlugin from "./textAbovePointPlugin";

const CHART_PLUGINS = [
  leftAlignYTicks( { axisRef: "chart" } ),
  textAbovePointPlugin
]

const CHART_OPTIONS = {
  plugins: {
    textAbovePointPlugin: {
      points: null,
      fillStyle: '#1d6fdc',
      textAlign: 'center',
      font: '700 13px Montserrat',
    }
  },
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  },
  hover: {
    mode: "index",
    intersect: false,
    animationDuration: 0
  },
  layout: {
    padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
          drawTicks: true,
          drawBorder: false,
        },
        ticks: {
          fontSize: 12,
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
          fontFamily: "Montserrat",
          fontStyle: "bold",
          fontColor: "transparent",
          // fontColor: "#AFB3C0",
          fontSize: 10,
          maxTicksLimit: 3,
          beginAtZero: true,
          callback: function(value, index, values) {
            if ( index === 0 ) return '';
            return numeral( value ).format( '0,0');
          }
        }
      }
    ]
  }
};

const CHART_DATA = {
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
      shadowColor: "rgba(29, 111, 220, 0.5)",
      pointRadius: 3,
      pointHoverRadius: 3,
      pointBorderWidth: 0,
      pointHoverBorderColor: "#fff",
      pointBackgroundColor: "rgb(29, 111, 220)",
      lineTension: 0.2
    }
  ]
};

export default class ReviewsByDayChart extends Component {
  static propTypes = {
    product_id: PropTypes.number.isRequired,
    visible: PropTypes.bool,
    totalReviewsCount: PropTypes.number
  };

  state = {
    // tooltipModel: {},
    hoverPoints: [],
    tooltipVisible: false,
    review_count: "",
    since_month: "",
    datasets: [{
      data: []
    }],
    labels: [],
    new_review_count: []
  };

  getChartData = canvas => {
    const { labels, datasets } = this.state;

    this.canvas = canvas;

    const data = _.cloneDeep( CHART_DATA )

    if ( !labels || !datasets ) {
      return data;
    }

    data.labels = this.addStartEndFills( labels, true );
    data.datasets[0].data = this.addStartEndFills( datasets[0].data );

    return data;
  }

  getChartOptions = () => {
    const { datasets, new_review_count } = this.state
    let options = _.cloneDeep( CHART_OPTIONS );

    if ( datasets ) {
      options.scales.xAxes[0].ticks.max = Math.max(...datasets[0].data);
      options.scales.xAxes[0].ticks.min = 0;
    }

    if ( new_review_count && new_review_count.length > 0 ) {
      options.plugins.textAbovePointPlugin.points = this.addStartEndFills( new_review_count );
    }

    options.onHover = (event, array) => { this.customTooltip(array); };

    return options;
  };

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
    let fillAmount = 1;

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

  /**
   * Set properties for custom toolip when Chart.JS requests it
   *
   * @param {object} tooltipModel - tooltip data provided by Chart.js
   * @returns {object}
   */
  customTooltip = hoverPoints => {
    const { labels } = this.state

    const shiftedLabels = this.addStartEndFills( labels, true );

    //  Don't do anything if tooltip is hovered over
    if (this.state.tooltipHovered) {
      // debugger;
      return;
    }

    if (hoverPoints.length === 0 || shiftedLabels[ hoverPoints[0]._index ] === " ") {
      this.tooltipTimeout = setTimeout(() => {
        this.setState({
          tooltipVisible: false
        });
      }, 300);
    } else {
      clearTimeout(this.tooltipTimeout);

      this.setState({
        tooltipVisible: true,
        hoverPoints
      });
    }
  };

  /**
   * Set state tooltipHovered to true while hovering over the tooltip (duh :D)
   *
   * @param {object} event - mouseenter event
   */
  tooltipMouseEnter = event => {
    this.setState({
      tooltipHovered: true
    });
  };

  /**
   * Set state tooltipHovered to false when mouse is no longer hovering the tooltip (duh :D)
   *
   * @param {object} event - mouseleave event
   */
  tooltipMouseLeave = event => {
    this.setState({
      tooltipHovered: false
    });
  };

  /**
   * Return tooltip style
   *
   * @returns {object}
   */
  tooltipStyle = () => {
    if (
      typeof this.canvas === "undefined" ||
      this.state.hoverPoints.length === 0
    ) {
      return {};
    }

    let transformX = this.state.hoverPoints[0]._model.x - 125;
    let transformY = this.state.hoverPoints[0]._model.y - 80;

    return {
      pointerEvents: this.state.tooltipVisible ? "auto" : "none",
      opacity: this.state.tooltipVisible ? 1 : 0,
      transform: `translateX( ${transformX}px ) translateY( ${transformY}px )`
    };
  };

  /**
   * Generate HTML for tooltip
   *
   * @returns {JSX}
   */
  getTooltipInside = () => {
    const { hoverPoints } = this.state;
    const { datasets } = this.getChartData();

    if (hoverPoints.length === 0) {
      return "";
    }

    const pointIndex = hoverPoints[0]._index;
    const pointValue = datasets[0].data[pointIndex];

    return (
      <div
        className="p-4 flex flex-col justify-center items-center"
        style={{ width: 100 }}
      >
        <span className="text-2xl leading-none text-dusk font-bold">
          {pointValue}
        </span>
      </div>
    );
  };

  getDatasets() {
    const { product_id } = this.props;

    return ProductsService.review_history( product_id )
      .then( res => {
        const processedResponse = processReviewsChart( res );
        this.setState( processedResponse );
      } )
  }

  componentDidMount() {
    this.getDatasets();
  }

  constructor( props ) {
    super( props );

    this.chart = React.createRef();
  }

  render() {
    const { visible, mobile, totalReviewsCount } = this.props;
    const { review_count, since_month } = this.state;
    const options = this.getChartOptions();

    const classes = {
      card: "relative w-full shadow-vp-default rounded-lg bg-white"
    };

    return (
      <section className={classes.card} style={{ height: 190 }}>
        {/* Title */}
        <section
          className="p-4 lg:p-5 flex justify-between items-center text-dusk text-xs lg:text-sm font-semibold"
          style={{ height: mobile ? 48 : 58 }}
        >
          <div>{totalReviewsCount} Total Reviews</div>

          <div>+{ review_count } Reviews since { since_month }</div>
        </section>
        {/* Chart container */}
        <section className="relative w-full" style={{ height: 132 }}>
          { visible && <>
            <div className="w-full h-full overflow-hidden">
              <div className="w-125% h-full -ml-17.5%">
                <Line
                  data={this.getChartData}
                  options={ options }
                  ref={ this.chart }
                  plugins={ CHART_PLUGINS }
                />
              </div>
            </div>

            <CustomTooltip
              content={this.getTooltipInside}
              style={this.tooltipStyle()}
              className={"reviews__rating-chart-tooltip z-40"}
              ref={el => {
                this.tooltip = el;
              }}
              onMouseEnter={this.tooltipMouseEnter}
              onMouseLeave={this.tooltipMouseLeave}
            />
          </>}
        </section>
      </section>
    );
  }
}
