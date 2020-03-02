import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import PropertyService from '../../../services/PropertyService';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid, Legend, Label } from 'recharts';
import moment from 'moment';

class PricingGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pricing: []
    };

    this.getPropertyPricing = this.getPropertyPricing.bind(this);
  }

  componentDidMount() {
    // this.getPropertyPricing();
  }

  componentWillReceiveProps() {
    this.setState({
      pricing: []
    });
    this.getPropertyPricing();
  }

  getPropertyPricing() {
    PropertyService.getCurrentPropertyPricing().then((pricing_data) => {
      if(pricing_data && pricing_data.length > 0) {
        let compMax = this.findMax(pricing_data, 'max_comp_rate').max_comp_rate;
        let compMin = this.findMin(pricing_data, 'min_comp_rate').min_comp_rate;
        let rateMax = this.findMax(pricing_data, 'rate').rate;
        let rateMin = this.findMin(pricing_data, 'rate').rate;
        let yMax = compMax > rateMax ? compMax : rateMax;
        let yMin = (compMin && (compMin < rateMin)) ? compMin : rateMin;

        yMax = parseInt(yMax + 80, 10);
        yMin = (yMin === 0) ? 0: yMin - 20;

        this.setState({
          loading: false,
          pricing: pricing_data,
          yMax: yMax,
          yMin: yMin
        });
      } else {
        this.setState({
          loading: false
        });
      }
    }).catch(error => {
      this.setState({
        loading: false
      });
      console.log("error");
      console.log(error);
    });
  }

  findMax(pricing, attribute) {
    return pricing.reduce(function (accumulator, currentValue){
      return (currentValue[attribute] && (currentValue[attribute] > accumulator[attribute])) ? currentValue : accumulator;
    });
  }

  findMin(pricing, attribute) {
    return pricing.reduce(function (accumulator, currentValue){
      if(!accumulator) {
        return currentValue;
      } else {
        return (currentValue[attribute] && (currentValue[attribute] < accumulator[attribute])) ? currentValue : accumulator;
      }
    });
  }

  formatXAxis(tickItem) {
    return moment(tickItem).format('MMM YY')
  }

  render() {
    return (
      <div className="container">
        {this.state.loading && (
          <div className="loading m-auto">
            <ReactLoading type='spokes' color='#4D5061' height='50' width='50'/>
          </div>
        )}
        {!this.state.loading && (
          <div className="m-auto" style={{height: '400px'}}>
            <ResponsiveContainer width='100%' minHeight='400'>
              <LineChart
                data={this.state.pricing}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke='#f5f5f5' />
                <XAxis dataKey='booking_date' tickFormatter={this.formatXAxis} minTickGap={20}/>
                <YAxis type="number" unit="$" domain={[this.state.yMin, this.state.yMax]}>
                  <Label value="Rate" position="insideLeft" angle={-90} />
                </YAxis>
                <Tooltip />
                <Legend />
                <Line type='monotone' dataKey='rolled_rate' name='Your Rate' stroke='green' strokeWidth={2} dot={false}/>
                <Line type='monotone' dataKey='rolled_avg_rate' name='Avg Rate' stroke='red' style={{'opacity': '0.3'}} strokeWidth={2} dot={false}/>
                <Line type='monotone' dataKey='rolled_min_rate' name='Min Rate' stroke='orange' style={{'opacity': '0.3'}} strokeWidth={2} dot={false}/>
                <Line type='monotone' dataKey='rolled_max_rate' name='Max Rate' stroke='blue' style={{'opacity': '0.3'}} strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }
}

export default PricingGraph;
