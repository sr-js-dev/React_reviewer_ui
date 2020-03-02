import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import _ from "lodash";

import { getRecentCritical } from "../../../redux/reviews/actions";
import Review from "../../../components/common/Review";
import LoadingAnimation from "../../../components/common/LoadingAnimation";
import { isMobile, EXTENDED_MOBILE } from "../../../redux/app/actions";
import ReviewColumn from "../../../components/common/Review/ReviewColumn";
import OffsetSlider from "../../../components/common/OffsetSlider";
import ReviewModal from "../../../components/common/Review/ReviewModal";

export class RecentCritical extends Component {
  componentDidMount() {
    const { getRecentCritical } = this.props;
    getRecentCritical();
  }

  render() {
    const { reviewsLoading, recentCritical, mobile, extendedMobile } = this.props;

    let reviews = _.uniqBy(recentCritical, "id");

    const noReviews = !reviewsLoading && reviews && reviews.length === 0;

    const reviewsList = reviews.slice(0, 5).map(review => {
      return extendedMobile ? (
        <ReviewColumn review={review} key={review.id} mobile className={ extendedMobile && !mobile ? "rounded-lg mb-3.5" : "" } />
      ) : (
        <Review review={review} key={review.id} />
      );
    });

    const classes = {
      count:
        "text-light-grey-blue hover:text-water-blue text-xs font-bold border-grey-border-50 hover:border-transparent border hover:bg-white hover:shadow-vp-default rounded flex items-center px-2.5 h-7 ml-2.5",
      container:
        "reviews__items-container flex flex-col w-full min-h-160px lg:bg-white rounded-lg lg:shadow-vp-default mt-7 " +
        (reviewsLoading ? "py-12" : "")
    };

    return (<>
      <ReviewModal expanded={ false } review={ reviewsList.length > 0 ? reviewsList[0] : {}} />

      <section className={ "w-full md:p-7 z-10 " + ( extendedMobile ? "" : "reviews__gradient-section" ) }>
        <div className="flex text-xl md:text-2.25xl font-semibold px-2.5 py-3.5 md:p-0 text-dusk items-center">
          Recent Critical Reviews
          {!reviewsLoading && reviews && (
            <Link to="/reviews" className={classes.count}>
              {reviews.length}
            </Link>
          )}
        </div>

        <section className={mobile ? "w-full" : classes.container}>
          {reviewsLoading && <LoadingAnimation />}

          {!reviewsLoading && noReviews && (
            <div className="w-full text-2xl font-medium text-light-grey-blue text-center py-7">
              There are no recent reviews
            </div>
          )}

          {!reviewsLoading && !noReviews && !mobile && <>{reviewsList}</>}
          {!reviewsLoading && !noReviews && mobile && (
            <OffsetSlider items={ reviewsList } />
          )}
        </section>
      </section>
    </>);
  }
}

const mapStateToProps = state => ({
  reviewsLoading: state.Reviews.reviewsLoading,
  recentCritical: state.Reviews.recentCritical,
  extendedMobile: isMobile(state.App.view, EXTENDED_MOBILE ),
  mobile: isMobile( state.App.view )
});

const mapDispatchToProps = {
  getRecentCritical
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecentCritical);
