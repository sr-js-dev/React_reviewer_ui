import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobile } from '../../../../../redux/app/actions';
import { InView } from 'react-intersection-observer';
import handleIntersectionObserver from '../../../../../helpers/intersectionObserverHelper';
import { INTERSECTION_BLOCK_CLASS } from '../../../config';
import ReactHtmlParser from 'react-html-parser';

class ListItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  }

  state = {
    visible: false
  }

  topIntersectionHandler = (inView, entry) => {
    const { debugTop: debug } = this.props;

    const [ newScroll, newEntry ] = handleIntersectionObserver({
      observerID: `List Section Item Top`,
      entry,
      prevScrollY: this.prevScrollY,
      prevEntry: this.prevEntry,
      up: this.handleTopUp,
      debug,
    });

    this.prevScrollY = newScroll;
    this.prevEntry = newEntry;
  };

  handleTopUp = () => {
    if ( this.state.visible === false ) {
      this.setState({ visible: true })
    }
  };

  constructor( props ) {
    super( props );

    this.prevScrollY = false;
    this.prevEntry = false;
  }

  render() {
    const { mobile } = this.props;
    const { visible } = this.state;
    const {
      picture,
      imageStyle,
      imageStyleMobile,
      title,
      body,
      action
    } = this.props.item;

    const imageBg = {
      backgroundImage: `url(${ process.env.PUBLIC_URL + picture })`
    };

    const pictureStyle = mobile ? { ...imageStyleMobile, ...imageBg } : { ...imageStyle, ...imageBg };

    const inViewProps = {
      as: 'div',
      onChange: this.topIntersectionHandler,
      threshold: [0.5,1],
      style:{ top: '16px' },
      className: INTERSECTION_BLOCK_CLASS + 'absolute',
    };

    const hiddenStyle = {
      transform: 'translateY(32px)',
      opacity: 0
    }

    return (
      <section className="reviews__landing-list-section-item relative py-9 px-8 md:p-0">
        { !mobile && <InView {...inViewProps} /> }

        <section className={ "relative flex justify-center items-center long-transition " + ( mobile ? 'flex-col' : '' ) } style={ !mobile && !visible ? hiddenStyle : {} }>
          {/* Picture */}
          <section className="reviews__landing-list-section-item-picture" style={ pictureStyle } />
          {/* Body */}
          <section className="flex flex-col text-center md:text-left items-center md:items-start">
            <h3 className="text-lg md:text-lg2 text-water-blue font-bold leading-tight my-6 md:mt-0 md:mb-8">{ title }</h3>
            <p className="text-sm md:text-lg text-dusk-80 leading-wider font-medium my-0">
              { ReactHtmlParser( body )}
            </p>

            { action &&
              <button className="bg-water-blue rounded-lg h-50px px-7 mt-7 uppercase text-white text-sm font-bold shadow-vp-blue hover:shadow-vp-blue-hover hover:bg-water-blue-hover">
                { action }
              </button>
            }
          </section>
        </section>

      </section>
    );
  }
}

const mapStateToProps = (state) => ({
  mobile: isMobile( state.App.view )
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ListItem)
