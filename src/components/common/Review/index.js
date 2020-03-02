import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';
import moment from 'moment';
import { Tooltip } from 'antd';

import {
  dismissReview,
  bookmarkReview,
  recordResponse,
  getRecentCritical,
  getReviews,
  showModal,
} from '../../../redux/reviews/actions';
import {
  showSavedResponsesModal,
  addToast,
  dismissToast,
} from '../../../redux/app/actions';

import '../../../scss/components/Review.scss';

import Icon from '../Icon';
import SavedResponsesDropDown from '../SavedResponsesDropDown';
import DismissButton from './DismissButton';

import { SVG_STAR, DISMISS_TIMEOUT } from '../../../settings';
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
    review: PropTypes.object.isRequired,
    expanded: PropTypes.bool,
  };

  state = {
    modalVisible: false,
    trackButtonHovered: false,
    dismissMenuVisible: false,
    savedResponsesVisible: false,
    dismissAnimation: false,
    dismissProgress: 0,
  };

  trackButtonEnter = event => {
    this.setState({ trackButtonHovered: true });
  };

  trackButtonLeave = event => {
    this.setState({ trackButtonHovered: false });
  };

  showDismissMenu = selected_response_id => {
    this.setState({
      dismissMenuVisible: true,
      selectedResponseID: selected_response_id,
    });
  };

  hideDismissMenu = () => {
    this.setState({ dismissMenuVisible: false, selectedResponseID: null });
  };

  closeSavedResponsesDropdown = () => {
    this.setState({ savedResponsesVisible: false });
  };

  onSavedResponsesVisibleChange = savedResponsesVisible => {
    this.setState({ savedResponsesVisible });
  };

  showModal = event => {
    const { showModal, review } = this.props;
    showModal(review);
  };

  recordResponse = () => {
    const { selectedResponseID } = this.state;
    const { recordResponse, review } = this.props;

    recordResponse(review.id, selectedResponseID);
    this.update();
  };

  dismiss = () => {
    const { addToast } = this.props;

    addToast({
      delayTime: 5000,
      body: 'Review dismissed.',
      icon: 'cross',
      iconClass: 'text-xxs leading-none',
      iconBg: 'coral-pink',
      countdown: true,
      action: {
        title: 'Undo',
        handler: this.cancelDismiss,
      },
    });

    this.setState({
      dismissAnimation: true,
    });

    this.dismissTime = 150;
    this.dismissInterval = setInterval(this.dismissIntervalHandler, 150);
    this.dismissTimeout = setTimeout(this.confirmDismiss, DISMISS_TIMEOUT);
  };

  dismissIntervalHandler = () => {
    this.dismissTime = this.dismissTime + 150;

    this.setState({
      dismissProgress: Math.round((this.dismissTime / DISMISS_TIMEOUT) * 100),
    });
  };

  cancelDismiss = (e, toast_id) => {
    const { dismissToast } = this.props;

    clearTimeout(this.dismissTimeout);
    clearInterval(this.dismissInterval);

    dismissToast(toast_id);

    this.setState({
      dismissAnimation: false,
      dismissProgress: 150 / DISMISS_TIMEOUT,
    });
  };

  confirmDismiss = () => {
    const { dismissReview, review } = this.props;
    dismissReview(review.id);
    this.update();
    this.setState({ is_ignored: true });
  };

  bookmark = () => {
    const { bookmarkReview, review } = this.props;

    this.setState({
      is_bookmarked: !review.is_bookmarked,
    });

    bookmarkReview(review.id, review.is_bookmarked);
    this.update();
  };

  update = () => {
    const { getRecentCritical, getReviews, expanded } = this.props;

    if (expanded) {
      getReviews();
    } else {
      getRecentCritical();
    }
  };

  componentDidMount() {
    const { review } = this.props;

    this.setState({
      is_bookmarked: review.is_bookmarked,
      is_ignored: review.is_ignored,
      dismissProgress: 150 / DISMISS_TIMEOUT,
    });
  }

  componentDidUpdate(prevProps) {
    const { review } = this.props;
    const { review: prev_review } = prevProps;

    if (review.is_bookmarked !== prev_review.is_bookmarked) {
      this.setState({ is_bookmarked: review.is_bookmarked });
    }
  }

  render() {
    const { review, expanded } = this.props;
    const {
      trackButtonHovered,
      dismissMenuVisible,
      is_ignored,
      is_bookmarked,
      dismissAnimation,
      dismissProgress,
    } = this.state;

    if (is_ignored) {
      return '';
    }

    const starRatingProps = {
      rating: review.rating ? parseInt(review.rating, 10) : 0,
      starDimension: '13px',
      starSpacing: '0px',
      starEmptyColor: '#e5e8f0',
      starRatedColor: '#fec400',
      svgIconViewBox: '0 0 45 45',
      svgIconPath: SVG_STAR,
      className: 'py-2.5',
    };

    const classes = {
      button: 'flex items-center h-11 rounded-lg ml-3.5 ',
    };

    const dismissButtonProps = {
      dismissAnimation,
      dismissProgress,
      action: this.dismiss,
    };

    const option = {
      transform: (node, index) => {
        return transform(node, index);
      },
    };

    const date = moment(review.review_date, 'YYYY-MM-DD').format(
      'MMM DD, YYYY'
    );

    return (
      <div
        className={
          'reviews__review relative w-full flex items-center bg-white p-5 flex-no-shrink ' +
          (is_ignored ? 'reviews__review_dismissed' : '')
        }
      >
        {/* Rating */}
        <section className="reviews__review-rating h-full border flex flex-col py-2.5 px-3.75 justify-between items-center rounded-lg flex-no-shrink">
          {/* Name */}
          <div className="font-semibold text-xs text-dusk leading-none text-center">
            {review.amazon_user_name}
          </div>

          {/* Rating */}
          <div className="pt-1 pb-1">
            <StarRatings {...starRatingProps} />
          </div>

          {/* Date */}
          <div className="font-semibold text-xxs text-light-grey-blue leading-none">
            {date}
          </div>
        </section>

        {/* Body */}
        <section
          onClick={this.showModal}
          className="flex-grow cursor-pointer flex flex-col justify-between h-full mx-5"
        >
          {/* Title */}
          <div className="text-sm font-semibold text-dusk">
            {review.verified && (
              <Tooltip title="Verified Purchase">
                <img
                  className="w-3.5 h-3.5 mr-2"
                  src="/images/reviews/verified.svg"
                  alt="Verified Purchase"
                />
              </Tooltip>
            )}
            {review.title.length > 95
              ? review.title.slice(0, 95)
              : review.title}
          </div>

          {/* Body */}
          <div className="text-dusk opacity-80 text-sm font-medium mt-2.5 flex-grow">
            {review.body.length > 170 ? (
              <>
                {ReactHtmlParser(review.body.slice(0, 170), option)}...
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
              ReactHtmlParser(review.body, option)
            )}
          </div>

          {/* Positive / Negative counts */}
        </section>

        {/* Links and Actions */}
        <section className="flex items-center">
          {/* Product link */}
          <a
            href={review.product_url}
            className={
              classes.button +
              'flex-no-shrink px-2 rounded-lg block bg-light-grey-blue-15 hover:bg-light-grey-blue-30 font-xs text-dusk hover:text-dusk font-semibold leading-none asin-box'
            }
          >
            <img
              src={review.product_image_url}
              alt={review.asin}
              className="h-7 w-7 rounded"
            />
            <span className="mx-2">{review.asin}</span>
            <Icon name="arrow-right" class="text-xxs text-arrow opacity-60" />
          </a>

          {/* Dismiss review */}
          {!expanded && <DismissButton {...dismissButtonProps} />}

          {/* Comments count */}
          {expanded && (
            <div className="ml-0 lg:ml-3.5 leading-none flex items-center relative flex-no-shrink">
              <div className="mr-2 text-xxs lg:text-sm font-semibold text-dusk min-w-6 text-right">
                {review.num_comments}
              </div>

              <Icon
                name="comments"
                class="text-comments-grey text-xl leading-none"
              />

              {/* Unread notification dot */}
              {review.has_unread_comments && (
                <div className="vpinsight__topbar-notification-dot absolute pin-t pin-r border-3 border-white rounded-full mt-1.5 -mr-4" />
              )}
            </div>
          )}

          {/* Track review */}
          <button
            onMouseEnter={this.trackButtonEnter}
            onMouseLeave={this.trackButtonLeave}
            onClick={this.bookmark}
            className={
              classes.button +
              'px-2 w-11 text-base justify-center hover:bg-ice-blue hover:text-light-grey-blue hover:border-transparent ' +
              (is_bookmarked
                ? 'bg-water-blue-10 text-water-blue'
                : 'border text-light-grey-blue')
            }
          >
            <Icon name={trackButtonHovered ? 'track-hov' : 'track'} class="" />
          </button>

          {/* Saved responses */}
          <SavedResponsesDropDown
            reviewUrl={review.review_url}
            close={this.closeSavedResponsesDropdown}
            newTab={this.showDismissMenu}
          >
            <button
              className={
                classes.button +
                'bg-water-blue shadow-reviews-water-blue hover:bg-water-blue-dark'
              }
            >
              <div
                className={
                  'flex items-center h-11 justify-center rounded-l-lg w-11 text-base text-white'
                }
              >
                <Icon name="comments" class="" />
              </div>

              <div
                className={
                  'flex items-center h-11 w-6.5 justify-center rounded-r-lg text-xxs text-white bg-black-10'
                }
              >
                <Icon name="arrow-down" class="" />
              </div>
            </button>
          </SavedResponsesDropDown>
        </section>

        {dismissMenuVisible && (
          <section className="reviews__review-overlay absolute pin-t pin-r z-20 p-5 h-full w-full flex items-center justify-end">
            <span className="text-base opacity-80 text-dusk font-semibold">
              Did you respond to this review?
            </span>
            <button
              onClick={this.hideDismissMenu}
              className={
                classes.button +
                'px-2 font-semibold text-base bg-coral-pink-10 hover:bg-coral-pink-30 w-16 text-xs text-coral-pink justify-center'
              }
            >
              No
            </button>
            <button
              onClick={this.recordResponse}
              className={
                classes.button +
                'px-2 font-semibold text-base bg-leafy-green-10 hover:bg-leafy-green-30 w-16 text-xs text-leafy-green justify-center'
              }
            >
              Yes
            </button>
          </section>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  dismissReview,
  bookmarkReview,
  recordResponse,
  getRecentCritical,
  getReviews,
  showSavedResponsesModal,
  showModal,
  addToast,
  dismissToast,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Review);
