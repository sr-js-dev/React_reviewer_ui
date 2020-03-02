import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import { showModal } from '../../../redux/comments/actions';

import Icon from '../Icon';

import '../../../scss/components/Review.scss';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';

function transform(node, index) {
  if (node.type === 'tag' && node.name === 'br') {
    return null;
  } else if (
    node.type === 'text' &&
    node.prev &&
    node.prev.type === 'tag' &&
    node.prev.name === 'br'
  ) {
    node.data = ` ${node.data}`;
    return convertNodeToElement(node, index, transform);
  }
}

class Review extends PureComponent {
  static propTypes = {
    comment: PropTypes.object.isRequired,
  };

  showModal = event => {
    const { showModal, comment } = this.props;
    showModal(comment);
  };

  render() {
    const { comment, expanded } = this.props;
    const classes = {
      button: 'flex items-center h-11 rounded-lg ',
    };
    const option = {
      transform: (node, index) => {
        return transform(node, index);
      },
    };

    return (
      <>
        <div
          className={
            'reviews__comment relative w-full flex items-center bg-white p-5 flex-no-shrink'
          }
        >
          {/* Rating */}
          <section className="reviews__review-rating h-full flex flex-col py-2.5 px-3.75 justify-center items-end text-right rounded-lg flex-no-shrink">
            {/* Name */}
            <div className="font-semibold text-xs text-dusk leading-none">
              {comment.amazon_user_name}
            </div>
            {/* Date */}
            <div className="mt-2 font-semibold text-xxs text-light-grey-blue leading-none">
              {moment( comment.comment_date ).format( 'MMM DD, YYYY' )}
            </div>
          </section>

          {/* Body */}
          <section
            onClick={this.showModal}
            className={
              'flex-grow flex flex-col justify-center h-full mx-5 ' +
              (expanded ? ' cursor-pointer ' : '')
            }
          >
            {/* Body */}
            <div className="text-dusk opacity-80 text-sm font-medium">
              {comment && comment.comment_text.length > 220 ? (
                <>
                  {ReactHtmlParser(comment.comment_text.slice(0, 220), option)}
                  ...
                  <a
                    href="!#"
                    onClick={e => {
                      e.preventDefault();
                    }}
                    className="see-more hover:underline"
                  >
                    See More
                  </a>
                </>
              ) : (
                ReactHtmlParser(comment.comment_text, option)
              )}
            </div>

            {/* Positive / Negative counts */}
          </section>

          {/* Links and Actions */}
          <section className="flex items-center">
            {/* Product link */}
            <a
              href={comment.product_url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                classes.button +
                'flex-no-shrink px-2 ml-3.5 rounded-lg block bg-light-grey-blue-15 hover:bg-light-grey-blue-30 font-xs text-dusk hover:text-dusk font-semibold leading-none asin-box'
              }
            >
              <img
                src={comment.product_image_url}
                alt={comment.asin}
                className="h-7 w-7 rounded"
              />
              <span className="mx-2">{comment.asin}</span>
              <Icon name="arrow-right" class="text-xxs text-arrow opacity-60" />
            </a>

            {/* Link to review */}
            <a
              href={comment.review_url}
              arget="_blank"
              rel="noref noopener"
              className={
                classes.button +
                'w-4 ml-6 text-base text-light-grey-blue-40 justify-center'
              }
            >
              <Icon name="arrow-right" className="" />
            </a>
          </section>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  showModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Review);
