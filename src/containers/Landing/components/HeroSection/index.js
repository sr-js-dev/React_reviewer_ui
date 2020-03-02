import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../../../scss/Landing/HeroSection.scss';
import { setWindowScrolled } from '../../../../redux/app/actions';
import LandingSection from '../LandingSection';
import { HEADING_CLASS, SUBTITLE_CLASS } from '../../config';
import { Link } from 'react-router-dom';

class HeroSection extends Component {
  static propTypes = {
    sectionChange: PropTypes.func.isRequired,
  };

  state = {
    visible: false,
  };

  handleTopUp = () => {
    this.setWindowScrolled(true);
  };

  handleTopDown = () => {
    this.setWindowScrolled(false);
    this.props.sectionChange('Hero');
  };

  constructor(props) {
    super(props);

    this.setWindowScrolled = _.throttle(props.setWindowScrolled, 150);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ visible: true });
    }, 1250);
  }

  render() {
    const { mobile, sectionChange } = this.props;
    const { visible } = this.state;

    const classes = {
      accentButton:
        'flex justify-center items-center px-8 font-bold uppercase rounded-full min-w-120px h-14 text-sm bg-water-blue text-white hover:text-white hover:bg-water-blue-hover mt-8',
    };

    const heroPictureStyle = visible
      ? {}
      : { opacity: 0, transform: 'translateY(24px)' };

    return (
      <LandingSection
        id={'Hero'}
        className="reviews__landing-hero-section flex flex-col items-center pt-6"
        sectionChange={sectionChange}
        handleTopUp={this.handleTopUp}
        handleTopDown={this.handleTopDown}
      >
        {/* Title */}
        <h1
          className={HEADING_CLASS(mobile).replace(
            'mt-6 lg:mt-2 mb-4 lg:mb-4',
            'my-4'
          )}
        >
          Amazon review tracking {mobile && <br />}
          made easy
        </h1>

        {/* Subtitle */}
        <p className={SUBTITLE_CLASS}>
          Never miss the important alarms and{' '}
          <span className="text-coral-pink font-bold">negative</span> reviews
          from your buyers.
          {!mobile && <br />}
          The most valuable and probably{' '}
          <span className="text-leafy-green font-bold">best</span> customer{' '}
          <span className="text-leafy-green font-bold">satisfaction</span> tool.
        </p>

        {/* Sentiment blocks */}
        <section className="flex items-center justify-center mt-3 mb-1">
          <div className="h-1 w-2.5 mx-2px rounded-full bg-coral-pink"></div>
          <div className="h-1 w-2.5 mx-2px rounded-full bg-leafy-green"></div>
          <div className="h-1 w-2.5 mx-2px rounded-full bg-leafy-green"></div>
        </section>

        {/* Action button */}
        <Link to="/dashboard" className={classes.accentButton}>
          TRY THE DEMO
        </Link>

        {/* Picture */}
        <section
          className="reviews__landing-hero-picture mt-4 lg:mt-0 long-transition"
          style={heroPictureStyle}
        />

        {/* Counters */}
        <section className="flex items-center justify-center my-6 lg:-mt-10 lg:mb-50px">
          <div className="reviews__landing-counter-block flex flex-col items-center mr-4 lg:mr-20 flex-no-shrink">
            <span className="text-dusk text-2xl lg:text-4.75xl font-bold leading-none mb-2 lg:mb-4">
              360,483
            </span>
            <span className="text-light-grey-blue text-xxs lg:text-sm font-bold leading-none">
              {mobile ? 'PRODUCTS TRACKING' : 'TOTAL PRODUCTS TRACKING'}
            </span>
          </div>
          <div className="reviews__landing-counter-block flex flex-col items-center ml-4 lg:ml-20 flex-no-shrink">
            <span className="text-dusk text-2xl lg:text-4.75xl font-bold leading-none mb-2 lg:mb-4">
              46,892
            </span>
            <span className="text-light-grey-blue text-xxs lg:text-sm font-bold leading-none">
              {mobile ? 'REVIEWS RESPONDED' : 'NEGATIVE REVIEWS RESPONDED'}
            </span>
          </div>
        </section>
      </LandingSection>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = { setWindowScrolled };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeroSection);
