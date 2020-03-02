import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../../../scss/Landing/FeaturesSection.scss';
import LandingSection from '../LandingSection';

import FeatureCard from './components/FeatureCard';

import { FEATURE_CARDS } from './config';
import { HEADING_CLASS, SUBTITLE_CLASS } from '../../config';

export default class FeaturesSection extends Component {
  static propTypes = {
    sectionChange: PropTypes.func.isRequired,
  };

  state = {
    expandedCard: false,
  };

  /**
   * Expand a card on mobile
   *
   * @param {String} newCard - id of expanded card
   */
  expandCard = newCard => {
    const expandedCard = this.state.expandedCard === newCard ? false : newCard;
    this.setState({ expandedCard });
  };

  render() {
    const { mobile, sectionChange } = this.props;
    const { expandedCard } = this.state;

    const cards =
      FEATURE_CARDS &&
      FEATURE_CARDS.map(card => {
        const id = _.camelCase(card.title);
        const expanded = id === expandedCard;

        return (
          <FeatureCard
            id={id}
            key={id}
            expanded={expanded}
            expand={e => {
              this.expandCard(id);
            }}
            card={card}
            mobile={mobile}
          />
        );
      });

    return (
      <LandingSection
        id={'Features'}
        className="reviews__landing-features-section flex flex-col items-center"
        sectionChange={sectionChange}
      >
        {/* Title */}
        <h2 className={HEADING_CLASS(mobile)}>Our Features</h2>

        {/* Subtitle */}
        <p className={SUBTITLE_CLASS}>
          Get the Features you Need Without{mobile && <br />} Spending a Lot
        </p>

        {/* Feature Cards */}
        <section className="reviews__landing-features-block flex flex-wrap justify-center my-7 lg:my-12">
          {cards}
        </section>
      </LandingSection>
    );
  }
}
