import React, { Component } from "react";
import { connect } from "react-redux";
import numeral from "numeral";
import moment from "moment";

import "../../../scss/Dashboard/CardsPanel.scss";

import RentalSizeChart from "../../../components/charts/RentalSizeChart";
import LoadingAnimation from "../../../components/common/LoadingAnimation";

import { getGraphs } from "../../../redux/reviews/actions";
import { isMobile, EXTENDED_MOBILE } from "../../../redux/app/actions";

import AvgRatingHistory from "../../../components/charts/AvgRatingHistory";

export class CardsPanel extends Component {
  componentDidMount() {
    const { getGraphs } = this.props;
    getGraphs();
  }

  render() {
    const { graphs, graphsLoading, mobile } = this.props;

    const classes = {
      card:
        "reviews__cards-card md:h-40 flex-no-shrink lg:flex-grow mr-2.5 md:mx-3.5 bg-white rounded-lg shadow-vp-default flex flex-col items-center justify-between p-2.5 md:py-6"
    };

    const avg_rating = {
      rating:
        graphs.avg_rating_graph &&
        numeral(graphs.avg_rating_graph[0].current_rating).format("0.00"),
      change:
        graphs.avg_rating_graph &&
        numeral(graphs.avg_rating_graph[0].pct_change).format("+0.0%"),
      positive:
        graphs.avg_rating_graph &&
        parseFloat(graphs.avg_rating_graph[0].pct_change) >= 0
    };

    const review_breakdown = {
      datasets: [{ data: [] }],
      labels: []
    };

    const avg_rating_history = {
      datasets: [{ data: [] }],
      labels: []
    };

    if (graphs.review_breakdown_graph) {
      for (
        let index = 0;
        index < graphs.review_breakdown_graph.length;
        index++
      ) {
        const element = graphs.review_breakdown_graph[index];

        review_breakdown.labels.push(element.rating);
        review_breakdown.datasets[0].data.push(element.count);
      }
    }

    if (graphs.avg_rating_history_graph) {
      for (
        let index = 0;
        index < graphs.avg_rating_history_graph.length;
        index++
      ) {
        const element = graphs.avg_rating_history_graph[index];

        avg_rating_history.labels.push(moment(element.month).format("MMM"));
        avg_rating_history.datasets[0].data.push(element.avg_rating);
      }
    }

    const reviews_last_30_days = {
      count:
        graphs.reviews_last_30_days_graph &&
        numeral(
          graphs.reviews_last_30_days_graph[0].current_review_count
        ).format("0,0"),
      change:
        graphs.reviews_last_30_days_graph &&
        numeral(graphs.reviews_last_30_days_graph[0].pct_change).format(
          "+0,0%"
        ),
      positive:
        graphs.reviews_last_30_days_graph &&
        parseFloat(graphs.reviews_last_30_days_graph[0].pct_change) >= 0
    };

    const total_reviews = {
      count:
        graphs.total_reviews_graph &&
        numeral(graphs.total_reviews_graph[0].review_count).format("0,0"),
      products:
        graphs.total_reviews_graph &&
        numeral(graphs.total_reviews_graph[0].product_count).format("0,0")
    };

    const cards = []

    /* AVG RATING */
    cards.push( (
      <div key="avg_rating" className={classes.card}>
        <div
          className={"lg:text-xs text-xxs text-light-grey-blue font-bold"}
        >
          AVG RATING
        </div>
        <div
          className={"color-dusk font-bold pt-0 text-2.5xl lg:text-3xl"}
        >
          {avg_rating.rating}
        </div>

        <div
          className={
            "leading-none font-bold text-xs lg:text-sm inline-block p-2 rounded " +
            (avg_rating.positive
              ? "text-leafy-green bg-leafy-green-10"
              : "text-coral-pink bg-coral-pink-10")
          }
        >
          {avg_rating.change}
        </div>
      </div>
    ) );

    /* AVG RATING HISTORY */
    cards.push( (
      <div  key="avg_rating_history" className={classes.card + " md:px-9"}>
        <div
          className={"lg:text-xs text-xxs text-light-grey-blue font-bold"}
        >
          AVG RATING HISTORY
        </div>
        <div className="w-full h-18 mt-2.5 lg:mt-4 flex-no-shrink">
          {graphs.avg_rating_history_graph && (
            <AvgRatingHistory
              datasets={avg_rating_history.datasets}
              labels={avg_rating_history.labels}
            />
          )}
        </div>
      </div>
    ) );

    /* REVIEW BREAKDOWN */
    cards.push( (
      <div key="review_breakdown" className={classes.card + " md:px-9"}>
        <div
          className={"lg:text-xs text-xxs text-light-grey-blue font-bold"}
        >
          REVIEW BREAKDOWN
        </div>
        <div className="w-full h-18 mt-2.5 lg:mt-4 flex-no-shrink">
          {graphs.review_breakdown_graph && (
            <RentalSizeChart
              datasets={review_breakdown.datasets}
              labels={review_breakdown.labels}
            />
          )}
        </div>
      </div>
    ) );

    /* REVIEWS IN 30 DAYS */
    cards.push( (
      <div key="30_revuews" className={classes.card}>
        <div
          className={"lg:text-xs text-xxs text-light-grey-blue font-bold"}
        >
          REVIEWS IN 30 DAYS
        </div>
        <div
          className={"color-dusk font-bold pt-0 text-2.5xl lg:text-3xl"}
        >
          {reviews_last_30_days.count}
        </div>

        <div
          className={
            "leading-none font-bold text-xs lg:text-sm inline-block p-2 rounded " +
            (reviews_last_30_days.positive
              ? "text-leafy-green bg-leafy-green-10"
              : "text-coral-pink bg-coral-pink-10")
          }
        >
          {reviews_last_30_days.change}
        </div>
      </div>
    ) );

    /* TOTAL REVIEWS */
    cards.push( (
      <div key="total_reviews" className={classes.card}>
        <div
          className={"lg:text-xs text-xxs text-light-grey-blue font-bold"}
        >
          TOTAL REVIEWS
        </div>
        <div
          className={"color-dusk font-bold pt-0 text-2.5xl lg:text-3xl"}
        >
          {total_reviews.count}
        </div>

        <div
          className={
            "leading-none text-dusk font-bold text-xs lg:text-sm inline-block p-2 bg-dusk-05 rounded"
          }
        >
          {total_reviews.products} PRODUCTS
        </div>
      </div>
    ) );

    return (<>
      <section className={ "reviews__cards-panel flex items-center p-2.5 md:px-3.5 " + ( mobile ? "overflow-y-scroll" : " justify-between" ) }>
        {graphsLoading && <LoadingAnimation />}

        { !graphsLoading && cards }
        { mobile && !graphsLoading && <div className="w-px h-7 flex-no-shrink"/>}
      </section>
    </>);
  }
}

const mapStateToProps = state => ({
  mobile: isMobile( state.App.view, EXTENDED_MOBILE ),
  graphs: state.Reviews.graphs,
  graphsLoading: state.Reviews.graphsLoading
});

const mapDispatchToProps = {
  getGraphs
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardsPanel);
