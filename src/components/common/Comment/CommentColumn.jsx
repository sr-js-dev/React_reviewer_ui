import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { showModal } from '../../../redux/comments/actions';

import Icon from "../Icon";
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';

function transform (node, index) {
  if(node.type === "tag" && node.name === "br") {
    return null;
  } else if(node.type === "text" && node.prev && node.prev.type === "tag" && node.prev.name === "br") {
    node.data = ` ${node.data}`;
    return convertNodeToElement(node, index, transform);
  }
}

class CommentColumn extends Component {
  static propTypes = {
    comment: PropTypes.object.isRequired,
    mobile: PropTypes.bool,
    modal: PropTypes.bool,
    list: PropTypes.bool,
  }

  static defaultProps = {
    modal: true
  }

  showModal = event => {
    const { showModal, comment } = this.props;
    showModal( comment );
  }

  render() {
    const { comment, mobile, modal, list } = this.props;
    const classes = {
      button: "flex items-center rounded-lg "
    }
    const option = {
      transform: (node, index) => {
        return transform(node, index)
      }
    };

    return (
      <div className={ "reviews__review reviews__review_modal relative w-full flex flex-col items-center bg-white p-4 lg:p-5 " + ( mobile && list ? "max-w-full-margin m-2.5 rounded-lg" : "" ) } >
        {/* Rating */}
        <section className="reviews__review-rating w-full flex justify-between items-center">
          <div>
            {/* Name */}
            <div className="font-semibold text-xs text-dusk leading-none">{comment.amazon_user_name || "Anonymous"}</div>
          </div>

          {/* Date */}
          <div className="font-semibold text-xxs text-light-grey-blue leading-none">{ moment( comment.comment_date, "YYYY-MM-DD" ).format( "MMM DD, YYYY" ) }</div>
        </section>

        {/* Body */}
        <section
          onClick={ modal ? this.showModal : null }
          className="flex-grow flex flex-col justify-between w-full mx-5 mt-3 mb-5"
        >
            {/* Body */}
            { mobile &&
              <div className="max-h-35-screen text-dusk opacity-80 text-sm font-medium mt-2.5 flex-grow overflow-y-scroll">
                {modal ?
                  (
                    <>
                    {(comment.comment_text && comment.comment_text.length > 180) ?
                      (
                        <>
                          {ReactHtmlParser(comment.comment_text.slice(0, 180),option)}...
                          <a href="!#" onClick={(e)=>{e.preventDefault()}} className="see-more hover:underline">See More</a>
                        </>
                      )
                      : ReactHtmlParser(comment.comment_text, option)
                    }
                    </>
                  )
                  :
                  ReactHtmlParser(comment.comment_text)
                }
              </div>
            }

            { !mobile &&
              <PerfectScrollbar className="max-h-35-screen text-dusk opacity-80 text-sm font-medium mt-2.5 flex-grow">
                { ReactHtmlParser(comment.comment_text) }
              </PerfectScrollbar>
            }

            {/* Positive / Negative counts */}
        </section>

        {/* Links and Actions */}
        <section className="w-full">
          {/* Desktop Product link */}
          { !mobile && (
            <a href={ comment.product_url } className={ classes.button + "px-2 min-h-11 rounded-lg block bg-light-grey-blue-15 hover:bg-light-grey-blue-30 font-xs text-dusk hover:text-dusk font-semibold leading-none" }>
              <img src={ comment.product_image_url } alt={ comment.asin } className="h-7 w-7 rounded"/>
              <span className="mx-2 flex-grow">{ comment.product_name || comment.asin }</span>
              <Icon name="arrow-right" class="text-xxs text-arrow opacity-60" />
            </a>
          )}

          <div className="flex lg:justify-end items-center mt-5">
            { mobile && (
              <a href={ comment.product_url } className={ classes.button + "px-2 min-h-11 rounded-lg block bg-light-grey-blue-15 hover:bg-light-grey-blue-30 font-xs text-dusk hover:text-dusk font-semibold leading-none flex-grow" } style={{minWidth: 162}}>
                <img src={ comment.product_image_url } alt={ comment.asin } className="h-7 w-7 rounded"/>
                <span className="mx-2 flex-grow">{ comment.product_name || comment.asin }</span>
                <Icon name="arrow-right" class="text-xxs text-arrow opacity-60" />
              </a>
            )}

            <a href={ comment.review_url } target="_blank" rel="noopener noreferrer" className={ classes.button + "h-11 bg-water-blue shadow-reviews-water-blue hover:bg-water-blue-dark ml-3.5"}>
              <div className={ "flex items-center h-11 justify-center rounded-l-lg px-4 font-bold uppercase text-white text-xs" }>
                <Icon name="amazon" class="mr-2.5 text-base"/>
                <span className="mb-px">
                  { mobile ? "Review" : "Review Page" }
                </span>
              </div>
            </a>
          </div>
        </section>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
  showModal
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentColumn);