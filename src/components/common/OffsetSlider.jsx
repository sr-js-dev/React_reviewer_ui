import React, { Component } from 'react'
import PropTypes from 'prop-types'

import '../../scss/components/OffsetSlider.scss';
import Slider from 'react-slick';

const sliderSettings = {
  centerMode: true,
  variableHeight: true,
  centerPadding: "10px",
  slidesToShow: 1,
  arrows: false,
  infinite: true,
  mobileFirst: true
};

export default class OffsetSlider extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired
  }

  render() {
    const { items } = this.props;
    return (
      <div className="reviews__offset-slider relative">
        <Slider {...sliderSettings}>
          { items }
        </Slider>
      </div>
    )
  }
}
