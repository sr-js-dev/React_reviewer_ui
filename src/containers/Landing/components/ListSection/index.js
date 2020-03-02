import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import LandingSection from '../LandingSection';
import { LIST_ITEMS } from './config';
import ListItem from './components/ListItem';

import '../../../../scss/Landing/ListSection.scss';
import { HEADING_CLASS, SUBTITLE_CLASS } from '../../config';
import { isMobile, EXTENDED_MOBILE } from '../../../../redux/app/actions';

class ListSection extends Component {
  static propTypes = {
    sectionChange: PropTypes.func.isRequired,
  };

  render() {
    const { extendedMobile, sectionChange } = this.props;

    const list =
      LIST_ITEMS &&
      LIST_ITEMS.map((item, index) => <ListItem item={item} key={index} />);

    return (
      <LandingSection
        id={'List'}
        className="reviews__landing-list-section flex flex-col items-center"
        sectionChange={sectionChange}
      >
        {/* Title */}
        <h2 className={HEADING_CLASS(extendedMobile)}>How can we help you?</h2>

        {/* Subtitle */}
        <p className={SUBTITLE_CLASS}>
          We can make your sales and reviews monitoring easier and fun
        </p>

        {/* The List */}
        <section className="reviews__landing-list-section-list flex flex-col">
          {list}
        </section>
      </LandingSection>
    );
  }
}

const mapStateToProps = state => ({
  extendedMobile: isMobile(state.App.view, EXTENDED_MOBILE),
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListSection);
