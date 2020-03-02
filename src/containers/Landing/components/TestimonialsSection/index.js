import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import LandingSection from '../LandingSection';
import { TESTIMONIALS_LIST } from './config';

import '../../../../scss/Landing/TestimonialsSection.scss';
import Testimonial from './components/Testimonial';
import { isMobile } from '../../../../redux/app/actions';
import { HEADING_CLASS, SUBTITLE_CLASS } from '../../config';

const SECTION_ID = 'Testimonials';
class TestimonialsSection extends Component {
  static propTypes = {
    activeSection: PropTypes.string.isRequired,
    sectionChange: PropTypes.func.isRequired,
  };

  render() {
    const { mobile, sectionChange, activeSection } = this.props;

    const active = activeSection === SECTION_ID;

    const list =
      TESTIMONIALS_LIST &&
      TESTIMONIALS_LIST.map((item, index) => (
        <Testimonial item={item} key={index} active={active} />
      ));

    return (
      <LandingSection
        id={SECTION_ID}
        className="reviews__landing-testimonials-section flex flex-col items-center bg-white"
        sectionChange={sectionChange}
      >
        {/* Title */}
        <h2 className={HEADING_CLASS(mobile)}>What our users say</h2>

        {/* Subtitle */}
        <p className={SUBTITLE_CLASS}>
          Already <strong>19,831</strong> Satisfied Customers
        </p>

        {/* The List */}
        <section className="reviews__landing-testimonials-section-list flex flex-col flex-wrap relative my-10 lg:my-16">
          {list}
        </section>
      </LandingSection>
    );
  }
}

const mapStateToProps = state => ({
  mobile: isMobile(state.App.view),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestimonialsSection);
