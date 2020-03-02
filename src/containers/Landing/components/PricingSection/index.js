import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SubscriptionTab from '../../../Settings/components/SubscriptionTab';
import LandingSection from '../LandingSection';

import '../../../../scss/Landing/PricingSection.scss';
import { HEADING_CLASS, SUBTITLE_CLASS } from '../../config';

import { Auth0Context } from '../../../../components/utility/Auth0Wrapper';

export default class PricingSection extends Component {
  static contextType = Auth0Context;

  static propTypes = {
    sectionChange: PropTypes.func.isRequired,
  };

  buttonAction = event => {
    const { loginWithRedirect } = this.context;
    loginWithRedirect();
  };

  render() {
    const { mobile, sectionChange } = this.props;

    return (
      <LandingSection
        id={'Pricing'}
        className="reviews__landing-pricing-section vpinsight__settings-container flex flex-col items-center"
        sectionChange={sectionChange}
      >
        {/* Title */}
        <h2 className={HEADING_CLASS(mobile).replace('lg:mt-2', 'lg:mt-4')}>
          Pricing
        </h2>

        {/* Subtitle */}
        <p className={SUBTITLE_CLASS}>
          An Easy Monthly Flat Fee - No Percentage{mobile && <br />}Fees Here
        </p>

        <SubscriptionTab action={this.buttonAction} />
      </LandingSection>
    );
  }
}
