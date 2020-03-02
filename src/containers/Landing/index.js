import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  HeroSection,
  FeaturesSection,
  ListSection,
  TestimonialsSection,
  PricingSection,
  ActionSection,
  SectionLinks,
  Footer,
} from './components';
import { isMobile, EXTENDED_MOBILE } from '../../redux/app/actions';

export class Landing extends Component {
  state = {
    activeSection: 'Hero',
  };

  sectionChange = activeSection => {
    this.setState({ activeSection });
  };

  render() {
    const { mobile } = this.props;

    const sectionProps = {
      sectionChange: this.sectionChange,
      activeSection: this.state.activeSection,
    };

    return (
      <>
        {!mobile && <SectionLinks {...sectionProps} />}
        <HeroSection {...sectionProps} mobile={mobile} />
        <FeaturesSection {...sectionProps} mobile={mobile} />
        <ListSection {...sectionProps} mobile={mobile} />
        <PricingSection {...sectionProps} mobile={mobile} />
        <TestimonialsSection {...sectionProps} />
        <ActionSection {...sectionProps} mobile={mobile} />
        <Footer mobile={mobile} />
      </>
    );
  }
}

const mapStateToProps = state => ({
  mobile: isMobile(state.App.view, EXTENDED_MOBILE),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Landing);
