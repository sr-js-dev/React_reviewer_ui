import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import PropertyService from '../../../services/PropertyService';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer,
  Tooltip, CartesianGrid, Legend, Label } from 'recharts';
import moment from 'moment';

class BookingGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      booking: []
    };

    this.getPropertyBooking = this.getPropertyBooking.bind(this);
  }

  componentDidMount() {
    this.getPropertyBooking();
  }

  componentWillReceiveProps() {
    this.setState({
      booking: []
    });
    this.getPropertyBooking();
  }

  getPropertyBooking() {
    PropertyService.getCurrentPropertyBooking().then((booking_data) => {
      if(booking_data && booking_data.length > 0) {
        this.setState({
          loading: false,
          booking: booking_data,
          yMax: 100,
          yMin: 0
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
                data={this.state.booking}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke='#f5f5f5' />
                <XAxis dataKey='booking_date' tickFormatter={this.formatXAxis} minTickGap={20}/>
                <YAxis yAxisId="left" type="number" unit="%" domain={[this.state.yMin, this.state.yMax]}>
                </YAxis>
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type='monotone' dataKey='rolled_count' name='Market Booking' stroke='blue' style={{'opacity': '0.5'}} strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }
}

export default BookingGraph;
