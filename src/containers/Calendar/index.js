import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import _ from 'lodash'
import ReactLoading from 'react-loading';

//  Components
import IntlMessages from '../../components/utility/intlMessages';
import Circle from '../../components/common/Circle';
import LoadingIndicator from '../../components/common/LoadingIndicator';
//  Actions
import { isMobile } from '../../redux/app/actions'
import reservationsActions from '../../redux/reservations/actions';
//  Styles
import "../../scss/calendar.scss";
import 'react-big-calendar/lib/css/react-big-calendar.css'
import LoadingAnimation from '../../components/common/LoadingAnimation';


const { getReservationsMonthly, getDailyStats } = reservationsActions;

const localizer = momentLocalizer(moment);

const EventComponent = (event) => { return (
  <div>
    <div className="text-center w-full booking-avg" style={{'backgroundColor': 'transparent', 'color': 'black'}}>
      {event.title && (
        <p className="calendar-text">{event.title}</p>
      )}
      {!event.title && (
        <p className="calendar-text">No Data</p>
      )}
    </div>
  </div>
) }

class ReservationCalendar extends Component {
    state = {
        interval: 1,
        info: null,
        selectedDay: null,
        monthDate: null
    }

    /**
     * Get the first day in current calendar
     *
     * @param {string} date - date in format "MM-DD-YYYY"
     * @returns {string} - date in format "MM-DD-YYYY"
     */
    getFirstDay = ( date ) => {
        if ( date !== null ) {
            date = moment( date, "MM-DD-YYYY" );
        } else {
            date = moment();
        }

        //  Get first day of the month
        //  and then get the first day of that week
        return date.date(1).day(0).format( "MM-DD-YYYY" )
    }

    /**
     * Get the last day in current calendar
     *
     * @param {string} date - date in format "MM-DD-YYYY"
     * @returns {string} - date in format "MM-DD-YYYY"
     */
    getLastDay = ( date ) => {
        if ( date !== null ) {
            date = moment( date, "MM-DD-YYYY" );
        } else {
            date = moment();
        }
        //  Get number of days in this month
        const daysInMonth = date.daysInMonth();
        //  Get last day of the month
        //  and then get next saturday
        //
        //  This was done to include cases where last day of month is saturday,
        //  but there is one more week in antd calendar
        return date.date( daysInMonth ).day(6+7).format( "MM-DD-YYYY" );
    }

    /**
     *  Handle change in Calendar state
     *
     *  @param {object} date - date Calendar changed to
     */
    calendarChanged = ( date ) => {
        const monthDate = this.getFirstDay( date );
        this.setState({ monthDate });
        this.getReservationsMonthly( monthDate );
    }

    /**
     *  Handle selecting date in Calendat
     *
     *  @param {object} selectedDay - date Calendar changed to
     */
    calendarDaySelected = ( selectedDay ) => {
        this.setState({ selectedDay });
        this.getDailyStats( selectedDay );
    }

    /**
     *  Redirect to reservation details page on event click
     *
     *  @param {object} reservation - reservation event object
     */
    calendarEventSelected = ( reservation ) => {
        const { history } = this.props;
        history.push( `/reservations/${ reservation.id }` )
    }

    getReservationsMonthly( date ) {
        const { getReservationsMonthly } = this.props;
        getReservationsMonthly( date );
    }

    getDailyStats( date ) {
        const { getDailyStats } = this.props;
        getDailyStats( date );
    }

    componentDidMount() {
        const monthDate = this.getFirstDay( moment() );
        this.setState( { monthDate } );
        this.getReservationsMonthly( monthDate );
    }

    componentDidUpdate( prevProps, prevState ) {
        const { user } = this.props;
        const { user: prevUser } = prevProps;

        if ( !_.isEqual( user, prevUser ) ) {
            this.getReservationsMonthly( this.state.monthDate );
        }
    }

    render() {
        const { view, reservationsMonthly, reservationsLoading, calendarBookingsMonthStat, loadingStat } = this.props;

        if ( reservationsLoading || reservationsMonthly == null ) {
            return <LoadingAnimation />
        }

        const mobile = isMobile( view );

        const cardClass = `relative rounded-lg bg-white shadow-vp-default flex flex-col ${ mobile ? "overflow-hidden w-auto p-8" : "p-50px" }`;
        const titleClassName = `flex justify-between  ${ mobile ? "flex-col pb-8" : "pb-50px"}`;

        const circleOptions = {
            width: 7,
            background: "#F4F4F4",
            className: "flex-no-shrink " + ( mobile ? "h-15.5 w-15.5" : "h-80px w-80px" )
        };

        if ( calendarBookingsMonthStat && calendarBookingsMonthStat[0] ) {
            var { comp_booked_pct, comp_avg_rate, comp_min_rate, comp_max_rate, my_avg_rate, my_booked_pct, booked_count, not_booked_count } = calendarBookingsMonthStat[0];

            var totalBookedDays = booked_count + not_booked_count;
            var bookingCircle = Math.round( booked_count / totalBookedDays * 100 );
            var bookingPercent = Math.round( parseFloat( my_booked_pct, 10 ) * 100 );

            comp_booked_pct = Math.round( parseFloat( comp_booked_pct, 10 ) * 100 );

            my_avg_rate = parseInt( my_avg_rate, 10 );
            comp_avg_rate = parseInt( comp_avg_rate, 10 );
            comp_min_rate = parseInt( comp_min_rate, 10 );
            comp_max_rate = parseInt( comp_max_rate, 10 );
        } else {
            var noData = true;
        }

        return (
            <div className="flex flex-col w-full h-full overflow-x-hidden">
                <div className={ cardClass + " flex-no-shrink" } >
                    <div className={ titleClassName }>
                        <h1>Reservations</h1>
                    </div>

                    <div className="vp-calendar mb-50px">
                        <Calendar
                            localizer={ localizer }
                            events={ reservationsMonthly }
                            views={['month']}
                            step={60}
                            showMultiDayTimes
                            components={{
                                event: EventComponent
                            }}
                            defaultDate={new Date()}
                            onNavigate={ this.calendarChanged }
                            onSelectEvent={ this.calendarEventSelected }
                        />
                    </div>
                </div>

                <section className={ "relative " + ( mobile ? "flex flex-col-reverse" : "" ) } >

                    { noData && (
                        <section className={ "flex " + ( mobile ? "p-2.5 flex-wrap" : "pb-7 pt-5" ) } >
                            <section className={ "vpinsight__calendar-card vpinsight__calendar-card_small rounded-lg flex flex-col justify-center items-center bg-white shadow-vp-default " + ( mobile ? " mr-2.5 mb-2.5" : "flex-grow mb-5" ) }>
                                <div className={ "text-light-grey-blue text-center font-bold uppercase " + ( mobile ? "text-xxs" : "text-sm" ) }>
                                    <IntlMessages id="calendar.noData" />
                                </div>
                            </section>
                        </section>
                    ) }

                    { !noData && (
                        <>
                        {/* Cards top row */}
                        <section className={ "flex " + ( mobile ? "p-2.5 flex-wrap" : "pb-7 pt-5" ) } >
                            { calendarBookingsMonthStat && (<>
                            <section className={ "vpinsight__calendar-card vpinsight__calendar-card_small rounded-lg flex flex-col justify-center items-center bg-white shadow-vp-default " + ( mobile ? " mr-2.5 mb-2.5" : "flex-grow mr-5" ) }>
                                <div className={ "text-slate font-bold " + ( mobile ? "text-2xl" : "text-3.5xl" ) }>
                                    ${ my_avg_rate }
                                </div>
                                <div className={ "text-light-grey-blue text-center font-bold uppercase " + ( mobile ? "text-xxs" : "text-sm" ) }>
                                    <IntlMessages id="calendar.avgNightly" />
                                </div>
                            </section>
                            <section className={ "vpinsight__calendar-card vpinsight__calendar-card_small rounded-lg flex flex-col justify-center items-center bg-white shadow-vp-default " + ( mobile ? " mb-2.5" : "flex-grow mr-5" ) }>
                                <div className={ "text-slate font-bold " + ( mobile ? "text-2xl" : "text-3.5xl" ) }>
                                    ${ comp_min_rate }
                                </div>
                                <div className={ "text-light-grey-blue text-center font-bold uppercase " + ( mobile ? "text-xxs" : "text-sm" ) }>
                                    <IntlMessages id="calendar.compsLowest" />
                                </div>
                            </section>
                            <section className={ "vpinsight__calendar-card vpinsight__calendar-card_small rounded-lg flex flex-col justify-center items-center bg-white shadow-vp-default " + ( mobile ? " mr-2.5" : "flex-grow mr-5" ) }>
                                <div className={ "text-slate font-bold " + ( mobile ? "text-2xl" : "text-3.5xl" ) }>
                                    ${ comp_avg_rate }
                                </div>
                                <div className={ "text-light-grey-blue text-center font-bold uppercase " + ( mobile ? "text-xxs" : "text-sm" ) }>
                                    <IntlMessages id="calendar.compsAvg" />
                                </div>
                            </section>
                            <section className={ "vpinsight__calendar-card vpinsight__calendar-card_small rounded-lg flex flex-col justify-center items-center bg-white shadow-vp-default " + ( mobile ? "" : "flex-grow" ) }>
                                <div className={ "text-slate font-bold " + ( mobile ? "text-2xl" : "text-3.5xl" ) }>
                                    ${ comp_max_rate }
                                </div>
                                <div className={ "text-light-grey-blue text-center font-bold uppercase " + ( mobile ? "text-xxs" : "text-sm" ) }>
                                    <IntlMessages id="calendar.compsHighest" />
                                </div>
                            </section>
                            </>)}
                        </section>

                        {/* Cards bottom row */}
                        <section className={ "flex " + ( mobile ? "p-2.5 mt-2.5 w-auto flex-no-shrink flex-no-wrap overflow-x-scroll" : "px-7 py-5" ) }>
                            { calendarBookingsMonthStat && (<>
                            <section className={ "vpinsight__calendar-card flex-no-shrink rounded-lg flex justify-center items-center bg-white shadow-vp-default " + ( mobile ? "p-3.5 mr-2.5" : "flex-grow mr-5" ) }>
                                <Circle
                                    { ...circleOptions }
                                    id="calendar.occupancy"
                                    stroke="#9AE290"
                                    percentage={ bookingPercent }
                                />

                                <section className={ "flex flex-col justify-start items-start " + ( mobile ? "ml-4" : "ml-7" ) }>
                                    <div className={ "text-slate font-bold " + ( mobile ? "text-2xl" : "text-3.5xl" ) }>
                                        { bookingPercent }%
                                    </div>
                                    <div className={ "text-light-grey-blue font-bold uppercase " + ( mobile ? "text-xxs" : "text-sm" ) }>
                                        <IntlMessages id="calendar.occupancy" />
                                    </div>
                                </section>
                            </section>
                            <section className={ "vpinsight__calendar-card flex-no-shrink rounded-lg flex justify-center items-center bg-white shadow-vp-default " + ( mobile ? "p-3.5 mr-2.5" : "flex-grow mr-5" ) }>
                                <Circle
                                    { ...circleOptions }
                                    id="calendar.compOccupancy"
                                    stroke="#FA5F33"
                                    percentage={ comp_booked_pct }
                                />

                                <section className={ "flex flex-col justify-start items-start " + ( mobile ? "ml-4" : "ml-7" ) }>
                                    <div className={ "text-slate font-bold " + ( mobile ? "text-2xl" : "text-3.5xl" ) }>
                                        { comp_booked_pct }%
                                    </div>
                                    <div className={ "text-light-grey-blue font-bold uppercase " + ( mobile ? "text-xxs" : "text-sm" ) }>
                                        <IntlMessages id="calendar.compOccupancy" />
                                    </div>
                                </section>
                            </section>
                            <section className={ "vpinsight__calendar-card flex-no-shrink rounded-lg flex justify-center items-center bg-white shadow-vp-default " + ( mobile ? "p-3.5" : "flex-grow" ) }>
                                <Circle
                                    { ...circleOptions }
                                    id="calendar.daysBooked"
                                    stroke="#2784E9"
                                    percentage={ bookingCircle }
                                />

                                <section className={ "flex flex-col justify-start items-start " + ( mobile ? "ml-4" : "ml-7" ) }>
                                    <div className={ "text-slate font-bold " + ( mobile ? "text-2xl" : "text-3.5xl" ) }>
                                        { booked_count } <small className="text-2xl text-light-grey-blue">/{ totalBookedDays }</small>
                                    </div>
                                    <div className={ "text-light-grey-blue font-bold uppercase " + ( mobile ? "text-xxs" : "text-sm" ) }>
                                        <IntlMessages id="calendar.daysBooked" />
                                    </div>
                                </section>
                            </section>

                            {/* Padding for scroll on mobile */}
                            { mobile && (<section className="w-2.5 flex-no-shrink"></section>)}

                            </>)}
                        </section>
                        </>
                    ) }

                    <LoadingIndicator visible={ loadingStat } />
                </section>
            </div>
        );
    }

    legacy() {
        return (
          <div className="ml-3 w-50" style={{marginTop: '68px'}}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Month Info</h5>
                {this.state.loadingMonthStat && (
                  <div className="loading m-auto">
                    <ReactLoading type='spokes' color='#4D5061' height='50' width='50' delay='0'/>
                  </div>
                )}
                {!this.state.loadingMonthStat && this.state.monthStat && this.state.monthStat[0] && (
                  <div>
                    <div className="d-flex justify-content-between mt-3">
                      <p className="listing-detail">
                        Your Avg. Rate
                      </p>
                      <p>
                        ${this.state.monthStat[0].property_price ? parseFloat(this.state.monthStat[0].property_price).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : 0}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <p className="listing-detail">
                        Comp. Avg. Rate
                      </p>
                      <p>
                        ${this.state.monthStat[0].average_price ? parseFloat(this.state.monthStat[0].average_price).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : 0}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <p className="listing-detail">
                        Comp. Highest Rate
                      </p>
                      <p>
                        ${this.state.monthStat[0].max_price ? parseFloat(this.state.monthStat[0].max_price).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : 0}
                      </p>
                    </div>
                    <div className="d-flex justify-content-between mt-1">
                      <p className="listing-detail">
                        Comp. Lowest Rate
                      </p>
                      <p>
                        ${this.state.monthStat[0].min_price ? parseFloat(this.state.monthStat[0].min_price).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) : 0}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )
    }
}


const mapStateToProps = (state) => ({
    user: state.Auth.currentUser,
    view: state.App.view,
    reservationsMonthly: state.Reservations.reservationsMonthly,
    reservationsLoading: state.Reservations.reservationsLoading,
})

const mapDispatchToProps = {
    getReservationsMonthly, getDailyStats
}

export default connect(mapStateToProps, mapDispatchToProps)(ReservationCalendar)
