import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

//  Actions
import { dismissReview, hideModal, getRecentCritical, getReviews } from '../../../redux/reviews/actions';
import { addToast, dismissToast } from '../../../redux/app/actions';
//  Components
import Icon from "../Icon";
import SavedResponsesDropDown from '../SavedResponsesDropDown';
import ReviewInsideCompact from "./ReviewInsideCompact";
import DismissButton from './DismissButton';
//  Config
import { DISMISS_TIMEOUT } from '../../../settings';

class ReviewColumn extends Component {
  static propTypes = {
    review: PropTypes.object.isRequired,
    mobile: PropTypes.bool,
    modal: PropTypes.bool,
    list: PropTypes.bool,
    closeOnUpdate: PropTypes.bool,
  }

  state = {
    trackButtonHovered: false,
    dismissMenuVisible: false,
    savedResponsesVisible: false,
    dismissAnimation: false,
    dismissProgress: 0,
  }

  trackButtonEnter = event => {
    this.setState({ trackButtonHovered: true })
  }

  trackButtonLeave = event => {
    this.setState({ trackButtonHovered: false })
  }

  showDismissMenu = selected_response_id => {
    this.setState({ dismissMenuVisible: true, selectedResponseID: selected_response_id })
  }

  hideDismissMenu = () => {
    this.setState({ dismissMenuVisible: false, selectedResponseID: null })
  }

  closeSavedResponsesDropdown = () => {
    this.setState( { savedResponsesVisible: false } );
  }

  handleClose = event => {
    const { onClose } = this.props;
    onClose();
  }

  recordResponse = () => {
    const { selectedResponseID } = this.state;
    const { recordResponse, review } = this.props;

    recordResponse( review.id, selectedResponseID );
    this.updateAndClose();
  }

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

    this.setState( {
      is_bookmarked: !review.is_bookmarked
    } );

    bookmarkReview( review.id, review.is_bookmarked );
    this.update();
  }

  update = () => {
    const { getRecentCritical, getRecent, expanded, hideModal, closeOnUpdate } = this.props;
    if ( expanded ) {
      getRecent();
    } else {
      getRecentCritical();
    }

    if ( closeOnUpdate ) {
      hideModal();

      this.setState({
        dismissAnimation: false,
        dismissProgress: 150 / DISMISS_TIMEOUT
      })
    }
  }

  updateAndClose = () => {
    const { onClose } = this.props;

    this.update();
    onClose();
  }

  componentDidMount() {
    const { review } = this.props;

    this.setState( {
      is_bookmarked: review.is_bookmarked,
      is_ignored: review.is_ignored,
      dismissProgress: 150 / DISMISS_TIMEOUT
    } );
  }

  componentDidUpdate( prevProps ) {
    const { review } = this.props;
    const { review: prev_review } = prevProps;

    if ( review.is_bookmarked !== prev_review.is_bookmarked ) {
      this.setState( { is_bookmarked: review.is_bookmarked } );
    }
  }

  render() {
    const { review, expanded, mobile, modal, list, className } = this.props;
    const { trackButtonHovered, dismissMenuVisible, is_bookmarked, dismissAnimation, dismissProgress } = this.state;

    const classes = {
      button: "flex items-center rounded-lg "
    }

    const dismissButtonProps = {
      column: true,
      mobile,
      dismissAnimation,
      dismissProgress,
      action: this.dismiss,
    }

    return (
      <div className={ "reviews__review reviews__review_modal w-full relative flex flex-col items-center bg-white p-4 lg:p-5 " + ( mobile && list ? "max-w-full-margin m-2.5 rounded-lg" : "" ) + ` ${ className }` } >
        <ReviewInsideCompact review={ review } modal={ modal }/>

        {/* Links and Actions */}
        <section className="w-full">
          {/* Product link */}
          { !list &&
            <a href={ review.product_url } className={ classes.button + "px-2 min-h-11 rounded-lg block bg-light-grey-blue-15 hover:bg-light-grey-blue-30 font-xs text-dusk hover:text-dusk font-semibold leading-none" }>
              <img src={ review.product_image_url } alt={ review.asin } className="h-7 w-7 rounded"/>
              <span className="mx-2 flex-grow">{ review.product_name || review.asin }</span>
              <Icon name="arrow-right" class="text-xxs text-arrow opacity-60" />
            </a>
          }

          <div className="flex justify-between items-center mt-5">
            {/* Dismiss review */}
            { !expanded && <DismissButton {...dismissButtonProps}/> }

            { expanded && !list &&
              <div className="mr-3.5 leading-none flex items-center relative flex-no-shrink">
                <div className="mr-2 text-sm font-semibold text-dusk min-w-6 text-right">
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
            }

            { expanded && list &&
              <a href={ review.product_url } className={ classes.button + "flex-grow px-2 min-h-11 rounded-lg block bg-light-grey-blue-15 hover:bg-light-grey-blue-30 font-xs text-dusk hover:text-dusk font-semibold leading-none" }>
                <img src={ review.product_image_url } alt={ review.asin } className="h-7 w-7 rounded"/>
                <span className="mx-2 flex-grow">{ review.product_name || review.asin }</span>
                <Icon name="arrow-right" class="text-xxs text-arrow opacity-60" />
              </a>
            }

            <div className={ "flex justify-end " + ( mobile && list ? " ml-4" : " flex-grow")}>
              {/* Track review */}
              <button
                onClick={ this.bookmark }
                onMouseEnter={ this.trackButtonEnter }
                onMouseLeave={ this.trackButtonLeave }
                className={ classes.button + "px-2 h-11 w-11 text-base justify-center hover:bg-ice-blue hover:text-light-grey-blue hover:border-transparent " + ( is_bookmarked ? "bg-water-blue-10 text-water-blue" : "border text-light-grey-blue" ) }>
                <Icon name={ trackButtonHovered ? "track-hov" : "track" } class=""/>
              </button>
              {/* Saved responses */}
              <SavedResponsesDropDown
                reviewUrl={review.review_url}
                close={this.closeSavedResponsesDropdown}
                newTab={this.showDismissMenu}
              >
                <button className={ classes.button + "h-11 bg-water-blue shadow-reviews-water-blue hover:bg-water-blue-dark ml-3.5"}>
                  <div className={ "flex items-center h-11 justify-center rounded-l-lg font-bold uppercase text-white text-xs " + ( mobile ? "w-11" : "w-32") }>
                    <Icon name="comments" class={ "text-base " + ( mobile ? "" : "mr-2.5" ) } />
                    { !mobile && <span className="mb-px">Respond</span> }
                  </div>

                  <div className={ "flex items-center h-11 w-6.5 justify-center rounded-r-lg text-xxs text-white bg-black-10" }>
                    <Icon name="arrow-down" class=""/>
                  </div>
                </button>
              </SavedResponsesDropDown>
            </div>
          </div>
        </section>

        { dismissMenuVisible && (<section className="reviews__review-overlay bg-white absolute pin-t pin-r z-20 p-5 h-full w-full flex flex-col items-center justify-center rounded-lg">
          <span className="text-base opacity-80 text-dusk font-semibold">Did you respond to this review?</span>
          <div className="flex mt-3.5">
            <button
              onClick={ this.hideDismissMenu }
              className={ classes.button + "px-2 h-11 font-semibold text-base bg-coral-pink-10 hover:bg-coral-pink-30 w-16 text-xs text-coral-pink justify-center" }>
              No
            </button>
            <button
              onClick={ this.recordResponse }
              className={ classes.button + "px-2 ml-3.5 h-11 font-semibold text-base bg-leafy-green-10 hover:bg-leafy-green-30 w-16 text-xs text-leafy-green justify-center" }>
              Yes
            </button>
          </div>
        </section>) }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
  dismissReview, addToast, dismissToast, hideModal, getRecentCritical, getReviews
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewColumn)
