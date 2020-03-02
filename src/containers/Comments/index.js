import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { shape, render, timeline, play } from 'wilderness';
import SVG from 'react-inlinesvg';
import { InView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

import {
  getComments,
  getCommentsCount,
  setFilters,
  clearFilters,
} from '../../redux/comments/actions';

import Comment from '../../components/common/Comment';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import SortingBar from './components/SortingBar';

import '../../scss/Reviews.scss';
import '../../scss/Comments.scss';
import CommentModal from '../../components/common/Comment/CommentModal';
import {
  isMobile,
  setQueryParams,
  EXTENDED_MOBILE,
} from '../../redux/app/actions';
import CommentColumn from '../../components/common/Comment/CommentColumn';

const COMMENT_ICON = '/images/landing/features/4.svg';

export class Comments extends Component {
  state = {
    intersectionObserverPrevEntry: null,
  };

  /**
   * Callback for react-waypoint
   */
  intersectionHandler = (inView, entry) => {
    const { commentsLoading } = this.props;
    const { intersectionObserverPrevEntry } = this.state;

    //
    if (
      !commentsLoading &&
      intersectionObserverPrevEntry &&
      intersectionObserverPrevEntry.intersectionRect.height <
        entry.intersectionRect.height
    ) {
      this.getCommentsThrottled();
    }

    if (
      !intersectionObserverPrevEntry ||
      !_.isEqual(
        intersectionObserverPrevEntry.intersectionRect.toJSON(),
        entry.intersectionRect.toJSON()
      )
    ) {
      this.setState({
        intersectionObserverPrevEntry: entry,
      });
    }
  };

  getComments() {
    const { getComments, getCommentsCount } = this.props;
    getComments();
    getCommentsCount();
  }

  /**
   * Load more reviews
   *
   * @param {object} event - click event
   */
  loadMore = event => {
    this.getCommentsThrottled();
  };

  savedResponsesShow = () => {
    this.setState({ savedResponsesModalVisible: true });
  };

  savedResponsesClose = () => {
    this.setState({ savedResponsesModalVisible: false });
  };

  applyQueryParams() {
    const { queryParams, filters, setFilters } = this.props;
    setFilters(_.pick(queryParams, Object.keys(filters)));
  }

  onSVGLoad = () => {
    const { commentsLoading, comment_error } = this.props;

    const idle = this.svgRef.current.querySelector('#idle');
    const hover = this.svgRef.current.querySelector('#hover');

    this.idleTransform = idle.attributes.transform;
    this.hoverTransform = hover.attributes.transform;

    this.iconAnimation = timeline(shape({ el: idle }, { el: hover }));

    render(this.svgRef.current, this.iconAnimation);

    const error = !commentsLoading && comment_error && comment_error.length;

    if (error) {
      this.animateIconHover();
    }
  };

  animateIconHover = () => {
    const { commentsLoading, comment_error } = this.props;
    const reverse = !(
      !commentsLoading &&
      comment_error &&
      comment_error.length
    );

    play(this.iconAnimation, { duration: 2000, reverse });
  };

  constructor(props) {
    super(props);

    this.getCommentsThrottled = _.throttle(this.getComments, 1000);
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    const { comments } = this.props;

    if (comments.length === 0) {
      this.getComments();
    }
  }

  componentDidUpdate(prevProps) {
    const { commentsLoading, comment_error } = this.props;

    if (!_.isEqual(this.props.queryParams, prevProps.queryParams)) {
      this.applyQueryParams();
    }

    if (
      this.svgRef.current &&
      (commentsLoading !== prevProps.commentsLoading ||
        comment_error !== prevProps.comment_error)
    ) {
      this.animateIconHover(false);
    }
  }

  componentWillUnmount() {
    const { filters, setQueryParams, clearFilters, pathname } = this.props;
    //  Unset any filter query params,
    //  specific to Comments page when
    //  navigating away from it
    if (pathname !== '/comments') {
      clearFilters();
      setQueryParams({ $unset: Object.keys(filters) });
    }
  }

  render() {
    const {
      commentsLoading,
      comments: commentsProp,
      count,
      offset,
      mobile,
      extendedMobile,
      comment_error,
      filterLoading,
      mainPaddingTop,
    } = this.props;

    let comments = _.uniqBy(commentsProp, 'comment_id');

    const noComments = !comments || comments.length === 0 || comment_error;

    const commentsList = comments.map(comment => {
      return extendedMobile ? (
        <CommentColumn
          comment={comment}
          key={comment.comment_id}
          expanded
          mobile
          list
        />
      ) : (
        <Comment comment={comment} key={comment.comment_id} expanded />
      );
    });

    const classes = {
      count:
        'text-light-grey-blue hover:text-water-blue text-xs font-bold border-grey-border-50 hover:border-transparent border hover:bg-white hover:shadow-vp-default rounded flex items-center px-2.5 h-7 ml-2.5',
      container:
        'reviews__items-container flex flex-col w-full min-h-160px bg-white rounded-lg shadow-vp-default mt-7 ',
      accentButton:
        'flex justify-center items-center px-8 font-bold uppercase rounded-full min-w-120px h-14 text-base bg-water-blue text-white hover:text-white hover:bg-water-blue-hover mt-8',
    };
    const threshold = [0.25, 0.5, 0.75];
    return (
      <>
        {!commentsLoading && comment_error && comment_error.length > 0 && (
          <section
            className="reviews__comments-error w-full flex flex-col items-center justify-center"
            style={{
              height: `calc( 100vh - ${mainPaddingTop}px - ${
                mobile ? '4rem' : '5.25rem'
              } )`,
            }}
          >
            <div className="reviews__landing-features-card-icon flex-no-shrink">
              <SVG
                innerRef={this.svgRef}
                src={process.env.PUBLIC_URL + COMMENT_ICON}
                onLoad={this.onSVGLoad}
              />
            </div>
            <h2 class="text-3xl text-dusk font-bold my-0 text-center">
              {comment_error}
            </h2>
            <Link
              to="/settings?tab=Subscription"
              className={classes.accentButton}
            >
              Upgrade
            </Link>
          </section>
        )}

        {!comment_error && (
          <>
            <CommentModal />

            <section className="w-full min-h-full lg:p-7 z-10">
              {/* Main section */}
              <section className={extendedMobile ? '' : classes.container}>
                {/* Search / Sorting bar */}
                <SortingBar />

                {noComments && (commentsLoading || filterLoading) && (
                  <LoadingAnimation className="py-4" />
                )}

                {noComments && !(commentsLoading || filterLoading) && (
                  <div className="w-full text-2xl font-medium text-light-grey-blue text-center py-7">
                    There are no comments
                  </div>
                )}

                {!noComments && !filterLoading && (
                  <>
                    {commentsList}

                    {!extendedMobile && count > offset && (
                      <InView
                        as="div"
                        onChange={this.intersectionHandler}
                        threshold={threshold}
                      >
                        <div className="w-full flex items-center justify-center py-7">
                          {commentsLoading && <LoadingAnimation />}
                        </div>
                      </InView>
                    )}

                    {extendedMobile && !commentsLoading && (
                      <button
                        onClick={this.loadMore}
                        className="w-full max-w-full-margin mx-2.5 mb-2.5 h-11 flex items-center justify-center bg-water-blue-10 text-water-blue text-xs font-bold rounded-lg uppercase"
                      >
                        Load More
                      </button>
                    )}

                    {extendedMobile && commentsLoading && (
                      <LoadingAnimation className="mt-5" />
                    )}
                  </>
                )}
              </section>
            </section>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state.Comments,
  pathname: state.router.location.pathname,
  mobile: isMobile(state.App.view),
  extendedMobile: isMobile(state.App.view, EXTENDED_MOBILE),
  queryParams: state.App.queryParams,
  comment_error: state.Comments.comment_error,
  mainPaddingTop: state.App.mainPaddingTop,
});

const mapDispatchToProps = {
  getComments,
  getCommentsCount,
  setFilters,
  clearFilters,
  setQueryParams,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments);
