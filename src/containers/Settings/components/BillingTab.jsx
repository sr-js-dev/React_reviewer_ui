import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StripeProvider, Elements } from 'react-stripe-elements';
import _ from "lodash";
import moment from "moment";
import numeral from "numeral";

//
import InjectedCheckoutForm from './checkoutForm';
import Alert from "../../../components/feedback/alert";

import settingsActions from '../../../redux/settings/actions';
import { isMobile } from '../../../redux/app/actions';

import LoadingIndicator from '../../../components/common/LoadingIndicator';

import "../../../scss/settings/BillingTab.scss";


const { addBilling, getBilling, getTransactionHistory } = settingsActions;


class BillingTab extends Component {

    loadBilling = () => {
        const { getBilling } = this.props;
        getBilling();
    };

    loadTransactionHistory = () => {
        const { getTransactionHistory } = this.props;
        getTransactionHistory();
    };

    billingLoaded = () => {
        this.setState({loadingBilling: !this.state.loadingBilling})
    }

    componentDidMount() {
        this.loadTransactionHistory();
        this.loadBilling();

    }

    render() {
        const { user, billing, transactionHistory, billingError, loadingBilling, addBilling, view } = this.props;
        const mobile = isMobile( view )

        const transactionHistoryAvailable = !_.isEqual( {}, transactionHistory ) && transactionHistory.data.length > 0
        const transactionsBlock = transactionHistoryAvailable && (
            <section className="flex flex-col justify-start items-center">
                <div className="text-lg text-slate font-medium my-6">Transactions History</div>

                <div>
                    { transactionHistory.data.map( (item, ind) => {
                        const transactionDate = moment.unix( item.date ).format( "MMM, D" );
                        const periodStart = moment.unix( item.lines.data[0].period.start ).format( "MMM D" );
                        const periodEnd = moment.unix( item.lines.data[0].period.end ).format( "MMM D" );
                        const description = item.lines.data[0].description;
                        return (
                            <div key={`${ind}-${transactionDate}`} className="vpinsight__transactions-item shadow-vp-default w-full h-18 rounded-lg bg-white flex items-center px-5 mb-2.5">
                                <div className="text-xs font-bold text-light-grey-blue flex-no-shrink uppercase">
                                    { transactionDate }
                                </div>

                                {/* Body */}
                                <div className="flex-grow leading-tight font-medium mx-5">
                                    <div className="text-slate text-sm">
                                        { description }
                                    </div>
                                    <div className="text-light-grey-blue text-sm">
                                        { periodStart } – { periodEnd }
                                    </div>
                                </div>

                                <div className="text-coral-pink font-bold flex-no-shrink">
                                    <span className="text-lg">
                                        ${ parseInt( item.amount_paid / 100 ).toFixed(0) }
                                    </span>

                                    <span className="text-sm">
                                        { numeral( item.amount_paid / 100 ).format( '.00' ) }
                                    </span>
                                </div>
                            </div>
                        );
                    } ) }
                </div>
            </section>
        );

        return (
            <section className={ "flex flex-col items-center " + ( mobile ? "w-full" : "py-16 my-auto" ) }>
                <section className={ "vpinsight__profile-form shadow-vp-settings-form bg-white " + ( mobile ? "p-6 rounded-2xl " : "p-10 rounded-3xl min-h-300px " ) }>

                    <LoadingIndicator visible={ loadingBilling } />

                    {/* Card not selected */}
                    { billing && !billing.card && (
                        <div>
                            { ( billingError && billingError.msg && (
                            <Alert
                                message="Billing Error"
                                description={ billingError.msg }
                                type="error"
                                closable
                                showIcon
                                className="mb-5"
                            /> ) ) }

                            <StripeProvider apiKey={billing.api_key}>
                                <Elements
                                    fonts={ [ { cssSrc: "https://fonts.googleapis.com/css?family=Montserrat:400,500" } ] }
                                >
                                    <InjectedCheckoutForm
                                        mobile={mobile}
                                        user={user}
                                        saveCard={addBilling}
                                        loadingBilling={() => this.setState({loadingBilling: !this.state.loadingBilling})}/>
                                </Elements>
                            </StripeProvider>
                        </div>
                    ) }

                    {/* Card selected */}
                    {billing && billing.card && (
                        <div>
                             { ( billingError && billingError.msg && (
                            <Alert
                                message="Billing Error"
                                description={ billingError.msg }
                                type="error"
                                closable
                                showIcon
                                className="mb-5"
                            /> ) ) }

                            <Alert
                                message="Card Info"
                                description={"Current card on file is a " + billing.card.brand + " ending in " + billing.card.last4 + ". If you would like to update your credit card, enter the information below."}
                                type="info"
                                showIcon
                                className="mb-5"
                            />

                            <StripeProvider apiKey={billing.api_key}>
                                <Elements
                                    fonts={ [ { cssSrc: "https://fonts.googleapis.com/css?family=Montserrat:400,500" } ] }
                                >
                                    <InjectedCheckoutForm
                                        mobile={mobile}
                                        user={user}
                                        saveCard={addBilling}
                                        loadingBilling={ this.billingLoaded }/>
                                </Elements>
                            </StripeProvider>
                        </div>
                    )}

                </section>

                { transactionsBlock }
            </section>
        )
    }
}

const mapStateToProps = (state) => ({
    //  User info
    user: state.Auth.currentUser,
    //  Billing specific info
    loadingBilling: state.Settings.loadingBilling,
    billingError: state.Settings.billingError,
    billing: state.Settings.billing,
    transactionHistory: state.Settings.transactionHistory,
    //  View state
    view: state.App.view
})

const mapDispatchToProps = {
    addBilling,
    getBilling,
    getTransactionHistory
}

export default connect(mapStateToProps, mapDispatchToProps)(BillingTab)
