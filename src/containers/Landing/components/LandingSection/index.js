import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { InView } from 'react-intersection-observer';
import handleIntersectionObserver from '../../../../helpers/intersectionObserverHelper';

import { INTERSECTION_BLOCK_CLASS } from '../../config';
import { isMobile } from '../../../../redux/app/actions';
class LandingSection extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    sectionChange: PropTypes.func.isRequired,
    handleTopUp: PropTypes.func,
    handleTopDown: PropTypes.func,
    handleBottomUp: PropTypes.func,
    handleBottomDown: PropTypes.func,
  };

  /**
   * Unlike other sections, this one
   * also sets state for the header
   */
  topIntersectionHandler = (inView, entry) => {
    const { id, debugTop: debug } = this.props;

    const [newScroll, newEntry] = handleIntersectionObserver({
      observerID: `${id} Top`,
      entry,
      prevScrollY: this.prevScrollY,
      prevEntry: this.prevEntry,
      up: this.handleTopUp,
      down: this.handleTopDown,
      debug,
    });

    this.prevScrollY = newScroll;
    this.prevEntry = newEntry;
  };

  bottomIntersectionHandler = (inView, entry) => {
    const { id, debugBottom: debug } = this.props;

    const [newScroll, newEntry] = handleIntersectionObserver({
      observerID: `${id} Bottom`,
      entry,
      prevScrollY: this.prevScrollY,
      prevEntry: this.prevEntry,
      up: this.handleBottomUp,
      down: this.handleBottomDown,
      debug,
    });

    this.prevScrollY = newScroll;
    this.prevEntry = newEntry;
  };

  /**
   * When
   */
  handleTopUp = () => {
    const { id, handleTopUp, sectionChange } = this.props;

    if (typeof handleTopUp === 'function') {
      handleTopUp();
    }

    sectionChange(id);
  };

  handleTopDown = () => {
    const { handleTopDown } = this.props;

    if (typeof handleTopDown === 'function') {
      handleTopDown();
    }
  };

  handleBottomUp = () => {
    const { handleBottomUp } = this.props;

    if (typeof handleBottomUp === 'function') {
      handleBottomUp();
    }
  };

  handleBottomDown = () => {
    const { id, handleBottomDown, sectionChange } = this.props;

    if (typeof handleBottomDown === 'function') {
      handleBottomDown();
    }

    sectionChange(id);
  };

  constructor(props) {
    super(props);

    this.handleTopUpDebounced = _.debounce(this.handleTopUp, 250);
    this.handleTopDownDebounced = _.debounce(this.handleTopDown, 250);
    this.handleBottomUpDebounced = _.debounce(this.handleBottomUp, 250);
    this.handleBottomDownDebounced = _.debounce(this.handleBottomDown, 250);

    this.prevScrollY = false;
    this.prevEntry = false;
  }

  render() {
    const { mobile, children, id, className } = this.props;

    const inViewProps = {
      as: 'div',
      className: INTERSECTION_BLOCK_CLASS + 'relative',
    };

    return (
      <section id={id} className={`${className} relative pt-4 px-8 lg:px-0`}>
        {!mobile && (
          <InView
            onChange={this.topIntersectionHandler}
            threshold={[1, 0.25]}
            style={{ top: '0px' }}
            {...inViewProps}
          />
        )}
        {children}
        {!mobile && (
          <InView
            onChange={this.bottomIntersectionHandler}
            threshold={[0, 0.75]}
            style={{ bottom: '0px' }}
            {...inViewProps}
          />
        )}
      </section>
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
)(LandingSection);
