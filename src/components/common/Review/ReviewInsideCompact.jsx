import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import moment from 'moment'
import StarRatings from 'react-star-ratings';
import { Tooltip } from "antd";

import { showModal } from '../../../redux/reviews/actions';

import { SVG_STAR } from '../../../settings';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { isMobile } from '../../../redux/app/actions';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';

function transform (node, index) {
  if(node.type === "tag" && node.name === "br") {
    return null;
  } else if(node.type === "text" && node.prev && node.prev.type === "tag" && node.prev.name === "br") {
    node.data = ` ${node.data}`;
    return convertNodeToElement(node, index, transform);
  }
}

class ReviewInsideCompact extends Component {
  static propTypes = {
    review: PropTypes.object.isRequired,
    showModal: PropTypes.func,
  }

  static defaultProps = {
    modal: true
  }

  showModal = event => {
    const { showModal, review } = this.props;
    showModal( review );
  };

  render() {
    const { review, modal, mobile, productModal } = this.props;
    const starRatingProps = {
      rating: review.rating ? parseInt( review.rating, 10 ) : 0,
      starDimension: "12px",
      starSpacing: "0px",
      starEmptyColor: "#e5e8f0",
      starRatedColor: "#fec400",
      svgIconViewBox: "0 0 45 45",
      svgIconPath: SVG_STAR,
    };
    const option = {
      transform: (node, index) => {
        return transform(node, index)
      }
    };
    return (
      <>
        {/* Rating */}
        <section className="reviews__review-rating w-full flex justify-between items-start">
          <div>
            {/* Rating */}
            <StarRatings {...starRatingProps} />
            {/* Name */}
            <div className="font-semibold text-xs text-light-grey-blue leading-none pt-2">{review.amazon_user_name}</div>
          </div>

          {/* Date */}
          <div className="flex-no-shrink font-semibold text-xxs text-light-grey-blue leading-none pt-2">{ moment( review.review_date, "YYYY-MM-DD" ).format( "MMM DD, YYYY" ) }</div>
        </section>

        {/* Body */}
        <section
          onClick={ modal ? this.showModal : null }
          className="flex-grow flex flex-col justify-between w-full mx-5 mt-3 mb-5"
        >
            {/* Title */}
            <div className="text-sm font-semibold text-dusk">
                { review.verified && (
                    <Tooltip title="Verified Purchase">
                        <img className="w-3.5 h-3.5 mr-2" src="/images/reviews/verified.svg" alt="Verified Purchase"/>
                    </Tooltip>
                )}
                {(review.title && review.title.length > 40 && modal) ? review.title.slice(0, 40) : review.title}
            </div>

            {/* Body */}
            { mobile &&
              <div className="max-h-35-screen text-dusk opacity-80 text-sm font-medium mt-2.5 flex-grow overflow-y-scroll">
                {modal ?
                  (
                    <>
                    {(review.body && review.body.length > 180) ?
                      (
                        <>
                          {ReactHtmlParser(review.body.slice(0, 180),option)}...
                          <button className="see-more hover:underline">See More</button>
                        </>
                      )
                      : ReactHtmlParser(review.body, option)
                    }
                    </>
                  )
                  :
                  ReactHtmlParser(review.body)
                }

              </div>
            }

            { !mobile &&
              <PerfectScrollbar className={"text-dusk opacity-80 text-sm font-medium mt-2.5 flex-grow "+ (productModal ? 'max-h-24' : 'max-h-35-screen') }>
                { ReactHtmlParser(review.body) }
              </PerfectScrollbar>
            }

            {/* Positive / Negative counts */}
        </section>
      </>
    )
  }
}


const mapStateToProps = state => ({
  mobile: isMobile( state.App.view )
});

const mapDispatchToProps = {
  showModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewInsideCompact);
