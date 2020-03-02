import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ReactHTMLParser from 'react-html-parser'

import { isMobile } from '../../../../../redux/app/actions'

class Testimonial extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    active: PropTypes.bool,
    mobile: PropTypes.bool
  }

  render() {
    const { mobile, active } = this.props;
    const {
      body,
      name,
      position,
      quotesPosition,
      style,
      initialRotation,
      activeRotation
    } = this.props.item;

    return (
      <article className="reviews__landing-testimonials-section-testimonial relative p-1" style={ mobile ? {} : style }>
        {/* SVG Background */}
        <div
          className="reviews__landing-testimonials-section-testimonial-bg absolute w-full h-full z-10 long-transition bg-white rounded-lg"
          style={{ transform: `rotate(${ active || mobile ? activeRotation : initialRotation }deg)`}}
        />
        {/* Testimonial body */}
        <div className={ "relative z-20 p-9 md:p-14 flex " + ( quotesPosition === "top" || mobile ? 'flex-col' : '' ) }>
          <div className="reviews__landing-testimonials-section-testimonial-quotes w-8 h-6.5 md:w-11 md:h-9 flex-no-shrink"/>
          <div className={ "flex-grow " + ( quotesPosition === "top" || mobile ? 'mt-6' : 'ml-8' ) }>
            <p className="text-sm md:text-lg text-dusk">
              { ReactHTMLParser( body ) }
            </p>

            <div className="bg-water-blue w-50px h-3px my-6"/>

            <div className="text-dusk-50 font-semibold text-sm md:text-lg leading-tight">{name}</div>
            <div className="text-dusk-50 font-medium text-xxs md:text-sm">{position}</div>
          </div>
        </div>
      </article>
    )
  }
}

const mapStateToProps = (state) => ({
  mobile: isMobile( state.App.view )
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Testimonial)
