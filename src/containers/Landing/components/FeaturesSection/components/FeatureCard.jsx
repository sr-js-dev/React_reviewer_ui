import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SVG from 'react-inlinesvg'
import { shape, render, timeline, play } from 'wilderness'
import Icon from '../../../../../components/common/Icon'

import { Auth0Context } from '../../../../../components/utility/Auth0Wrapper'

export default class FeatureCard extends Component {
  static contextType = Auth0Context;

  static propTypes = {
    card: PropTypes.object.isRequired,
    accent: PropTypes.bool
  }

  state = {
    hovered: false,
    expandableSectionHeight: 100
  }

  /**
   * Redirect to login page
   */
  logIn = event => {
    const { loginWithRedirect } = this.context;
    loginWithRedirect();
  };

  onMouseEnter = () => {
    this.setState({ hovered: true })
  }

  onMouseLeave = () => {
    this.setState({ hovered: false })
  }

  onSVGLoad = () => {
    const idle = this.svgRef.current.querySelector( '#idle' );
    const hover = this.svgRef.current.querySelector( '#hover' );

    this.idleTransform = idle.attributes.transform;
    this.hoverTransform = hover.attributes.transform;

    this.iconAnimation = timeline( shape( { el: idle }, { el: hover } ) );

    render( this.svgRef.current, this.iconAnimation );
  }

  animateIconHover() {
    const { hovered } = this.state;
    const { expanded } = this.props;

    const reverse = !( hovered || expanded );

    play( this.iconAnimation, { duration: 600, reverse } );
  }

  setExpandablesectionHeight = () => {
    const expandableSectionHeight = this.expandableSection.current && this.expandableSection.current.scrollHeight;
    this.setState( { expandableSectionHeight } )
  }

  componentDidUpdate( prevProps, prevState ) {
    const { expanded } = this.props;
    const { hovered } = this.state;

    //  Animate SVG icon
    if (
      this.svgRef.current &&
        (
          hovered !== prevState.hovered ||
          expanded !== prevProps.expanded
        )
     ) {
      this.setExpandablesectionHeight();
      this.animateIconHover();
    }
  }

  constructor( props ) {
    super( props );

    this.svgRef = React.createRef();
    this.expandableSection = React.createRef();
  }

  render() {
    const { id, expanded, expand, mobile } = this.props;
    const { icon, title, subtitle, body, action, accent } = this.props.card;
    const { expandableSectionHeight } = this.state;

    const className = "reviews__landing-features-card px-8 pb-8 pt-4 flex flex-col items-center border rounded-lg justify-center hover:shadow-vp-default common-transition " + ( accent ? "reviews__landing-features-card_accent bg-water-blue" : "bg-white" );
    const mobileClass = "reviews__landing-features-card flex flex-col border rounded-lg w-full mx-0 mt-0 mb-2.5  " + ( accent ? "reviews__landing-features-card_accent bg-water-blue" : "bg-white" ) + ( expanded ? " reviews__landing-features-card_expanded" : "" );

    return (<>
      { mobile &&
        <div
          id={ id }
          onClick={ action ? this.logIn : expand }
          className={ mobileClass }
        >
          {/* Main section */}
          <section className="flex items-center">
            {/* Card Icon */}
            <div className="reviews__landing-features-card-icon flex-no-shrink">
              <SVG innerRef={ this.svgRef } src={ process.env.PUBLIC_URL + icon } onLoad={ this.onSVGLoad }/>
            </div>

            {/* Card Title */}
            <h3 className={ "text-left leading-tight text-sm font-semibold flex-grow " + ( accent ? "text-white" : "text-dusk" ) } >
              { title }
              { subtitle && <><br/><span className="text-marigold">{ subtitle }</span></> }
            </h3>

            <button className={ "mx-4 h-4 w-4 common-transition flex-no-shrink " + ( accent ? "text-white" : "text-light-grey-blue-40" ) } style={{ transform: expanded ? 'rotate(180deg)' : '' }}>
              <Icon name={ accent ? "arrow-right" : "arrow-down" } />
            </button>
          </section>
          {/* Expandable Section */}
          <section className={ "common-transition overflow-hidden flex-no-shrink mx-7 " + ( expanded ? "py-5 border-t" : "" ) }  ref={ this.expandableSection } style={{ maxHeight: expanded ? `calc(${ expandableSectionHeight }px + 2.5rem )` : 0 }}>
            <p className="text-left text-dusk-60 text-sm font-medium h-full">
              { body }
            </p>
          </section>
        </div>
      }

      { !mobile &&
        <div
          id={ id }
          onMouseEnter={ this.onMouseEnter }
          onMouseLeave={ this.onMouseLeave }
          className={ className }
        >
          {/* Card Icon */}
          <div className="reviews__landing-features-card-icon w-full flex-no-shrink">
            <SVG innerRef={ this.svgRef } src={ process.env.PUBLIC_URL + icon } onLoad={ this.onSVGLoad }/>
          </div>
          {/* Card Title */}
          <h3 className={ "text-center leading-tight text-xl font-bold pt-0 mb-4 h-15.5 " + ( accent ? "text-white" : "text-dusk" ) } >
            { title }
            { subtitle && <><br/><span className="text-marigold">{ subtitle }</span></> }
          </h3>

          <div className={ "flex flex-col flex-grow " + ( action ? "justify-center items-center" : "") } >
            { action &&
              <button
                onClick={ this.logIn }
                className="bg-white rounded-lg h-50px px-7 uppercase text-water-blue text-sm font-bold shadow-vp-default hover:shadow-vp-hover hover:opacity-80"
              >
                { action }
              </button>
            }

            {/* Card Body */}
            { !action &&
              <p className="text-center text-dusk-60 text-sm font-medium h-full">
                { body }
              </p>
            }
          </div>
        </div>
      }
    </>)
  }
}
