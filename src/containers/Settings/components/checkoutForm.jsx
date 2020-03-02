import React from 'react';
import { injectStripe, CardNumberElement, CardExpiryElement, CardCVCElement, HTMLStripeElement } from 'react-stripe-elements';

import message from "../../../components/feedback/message";
import MessageContent from "../../Feedback/Message/message.style";

import "../../../scss/settings/CheckoutForm.scss";
import IntlMessages from '../../../components/utility/intlMessages';
import CreditCardProviderIcon from '../../../components/common/CreditCardProviderIcon';

class CheckoutForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            brand: "",
            cardHolder: ""
        }
        message.config({
          duration: 2,
          maxCount: 1,
        });
    }
    /**
     * Handle form submission event
     *
     * @param {object} event - submit event of a form
     */
    handleSubmit = ( event ) => {
        const { stripe, saveCard } = this.props

        // We don't want to let default form submission happen here, which would refresh the page.
        event.preventDefault();
        if ( this.state.cardHolder.length === 0 ) {
            message.error(
                <MessageContent>
                    <span>Please enter a card holder name.</span>
                </MessageContent>
            );
        } else {
            // Within the context of `Elements`, this call to createToken knows which Element to
            // tokenize, since there's only one in this group.
            stripe.createToken({
                name: this.state.cardHolder
            })
                .then( ( { error, token } ) => {
                    if ( !token && error ) {
                        message.error(
                            <MessageContent>
                                <span>{error.message}</span>
                            </MessageContent>
                        );
                    } else {
                        saveCard(token);
                        this.cardNumber.clear();
                        this.cardExpiry.clear();
                        this.cardCvc.clear();
                        this.setState({cardHolder: ''});
                    }
                });
        }

    };

    handleFormChange = ( object ) => {
        if ( object.brand ) {
            this.setState( {
                brand: object.brand
            } );
        }
    }

    handleCardHolderChange = ( event ) => {
        this.setState( {
            cardHolder: event.target.value
        } );
    }

    render() {
        const { mobile } = this.props;

        const labelClassName = "text-xxs uppercase leading-loose text-lighter-grey-blue font-bold";
        const inputClass = "border border-grey-border rounded-lg flex flex-col justify-center items-stretch "

        const cardInputStyle = {
            base: {
                fontFamily: "Montserrat",
                fontSize: "24px",
                textAlign: "center",
                fontWeight: "500",
                color: "rgb( 64, 73, 102 )"
            },
            empty: {
                "::placeholder": {
                    color: "rgba( 64, 73, 102, 0.4 )"
                }
            }
        }

        const bottomRowInputStyle = {
            base: {
                fontFamily: "Montserrat",
                fontSize: "14px",
                fontWeight: "500",
                color: "rgb( 64, 73, 102 )"
            },
            empty: {
                "::placeholder": {
                    color: "rgba( 64, 73, 102, 0.4 )"
                }
            }
        }

        const bottomRowInputCentered = {
            base: {
                ...bottomRowInputStyle.base,
                textAlign: "center"
            },
            empty: {
                ...bottomRowInputStyle.empty
            }
        };

        return (
            <form
                onSubmit={this.handleSubmit}
                className={ "w-full h-full" }
            >
                {/* Card Number */}
                <CardNumberElement
                    onChange={ ( event ) => { this.handleFormChange( event ) } }
                    className={ inputClass + "vpinsight__card-number-input text-2xl text-slate font-bold " + ( mobile ? "mb-5" : "mb-7" ) }
                    style={ cardInputStyle }
                    onReady={(el: HTMLStripeElement) => this.cardNumber = el}
                />

                <section className={ "w-full flex "  + ( mobile ? "mb-5" : "mb-7" ) }>

                    <div className="flex-grow mr-5 overflow-hidden">
                        <div className={ labelClassName }>
                            <IntlMessages id="billing.cardHolder" />
                        </div>
                        <input onChange={ this.handleCardHolderChange } value={ this.state.cardHolder } placeholder="John Doe" name="name" type="text" className={ inputClass + "vpinsight__card-bottom-row-input px-5 w-full" } style={ bottomRowInputStyle } />
                    </div>

                    <div className="flex-grow mr-5" style={ { minWidth: "90px" } }>
                        <div className={ labelClassName }>
                            <IntlMessages id="billing.validThru" />
                        </div>
                        <CardExpiryElement
                            className={ inputClass + "vpinsight__card-bottom-row-input flex-no-shrink" }
                            style={ bottomRowInputCentered }
                            onReady={(el: HTMLStripeElement) =>  this.cardExpiry = el}
                        />
                    </div>

                    <div className="flex-grow" style={ { minWidth: "60px" } }>
                        <div className={ labelClassName }>
                            <IntlMessages id="billing.cvc" />
                        </div>
                        <CardCVCElement
                            className={ inputClass + "vpinsight__card-bottom-row-input flex-no-shrink" }
                            style={ bottomRowInputCentered }
                            onReady={(el: HTMLStripeElement) =>  this.cardCvc = el}
                        />
                    </div>

                </section>

                <section className="w-full flex">
                    <div className="flex-grow">
                        <CreditCardProviderIcon vendor={ this.state.brand } className=""/>
                    </div>

                    <button className="vpinsight__card-submit text-white bg-water-blue hover:bg-water-blue-hover shadow-vp-blue hover:shadow-vp-blue-active rounded-lg text-lg uppercase font-bold">
                        Save
                    </button>
                </section>
            </form>
        );
    }
}

export default injectStripe(CheckoutForm);
