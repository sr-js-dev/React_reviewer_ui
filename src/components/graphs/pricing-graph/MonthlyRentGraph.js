import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import PropertyService from '../../../services/PropertyService';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid, Legend, Label } from 'recharts';
import moment from 'moment';

class MonthlyRentGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      rent: []
    };

    this.getMonthlyProjectedRent = this.getMonthlyProjectedRent.bind(this);
  }

  componentDidMount() {
    // this.getMonthlyProjectedRent();
  }

  componentWillReceiveProps() {
    this.setState({
      rent: []
    });
    this.getMonthlyProjectedRent();
  }

  getMonthlyProjectedRent() {
    PropertyService.getCurrentProjectedRent().then((rent_data) => {
      if(rent_data && rent_data.length > 0) {
        let compMax = this.findMax(rent_data, 'comp_rent').comp_rent;
        let compMin = this.findMin(rent_data, 'comp_rent').comp_rent;
        let rateMax = this.findMax(rent_data, 'my_rent').my_rent;
        let rateMin = this.findMin(rent_data, 'my_rent').my_rent;
        let yMax = compMax > rateMax ? compMax : rateMax;
        let yMin = (compMin && (compMin < rateMin)) ? compMin : rateMin;

        yMax = parseInt(yMax + 80, 10);
        yMin = (yMin === 0) ? 0: yMin - 20;

        this.setState({
          loading: false,
          rent: rent_data,
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
              <BarChart
                data={this.state.rent}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickFormatter={this.formatXAxis}/>
                <YAxis unit="$"/>
                <Tooltip/>
                <Legend />
                <Bar dataKey="my_rent" fill="#82ca9d" name='Property'/>
                <Bar dataKey="comp_rent" fill="#8884d8" name='Market Avg'/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }
}

export default MonthlyRentGraph;
