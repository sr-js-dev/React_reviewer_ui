import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LandingSection from '../LandingSection';

import { Auth0Context } from '../../../../components/utility/Auth0Wrapper';

import '../../../../scss/Landing/ActionSection.scss';

export default class ActionSection extends Component {
  static contextType = Auth0Context;

  static propTypes = {
    sectionChange: PropTypes.func.isRequired,
  };

  /**
   * Redirect to login page
   */
  logIn = event => {
    const { loginWithRedirect } = this.context;
    loginWithRedirect();
  };

  handleBottomUp = () => {
    this.props.sectionChange('Action');
  };

  render() {
    const { mobile, sectionChange } = this.props;

    return (
      <LandingSection
        id={'Action'}
        className="reviews__landing-action-section flex flex-col justify-center items-center bg-water-blue"
        sectionChange={sectionChange}
        handleBottomUp={this.handleBottomUp}
      >
        <h2
          className={
            'text-lg2 lg:text-4.2xl mx-0 mb-6 lg:mb-5 font-bold text-center text-white ' +
            (mobile ? 'leading-tight' : '')
          }
        >
          Maximize your revenue and build long term
          <br />
          relationships with your buyers!
        </h2>

        <button
          className="rounded-lg bg-white text-water-blue uppercase text-base lg:text-lg font-bold h-14 lg:h-16 lg:mt-6"
          style={{ minWidth: 244 }}
          onClick={this.logIn}
        >
          GET STARTED
        </button>
      </LandingSection>
    );
  }
}
