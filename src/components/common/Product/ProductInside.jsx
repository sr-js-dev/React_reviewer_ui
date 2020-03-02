import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import _ from 'lodash';
import StarRatings from "react-star-ratings";
import { Line } from "react-chartjs-2";
import { Dropdown } from "antd";
import ClampLines from 'react-clamp-lines';

//  Actions
import { showModal } from '../../../redux/products/actions';
//  Components
import Icon from "../Icon";
//  Assets
import { SVG_STAR } from "../../../settings";

const CHART_OPTIONS = {
  maintainAspectRatio: false,
  legend: {
    display: false
  },
  tooltips: {
    enabled: false
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: false,
          drawTicks: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
          drawTicks: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      }
    ]
  }
};

const CHART_DATA = {
  labels: [""],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 0],
      borderColor: "rgb(29, 111, 220)",
      backgroundColor: "transparent",
      pointRadius: 0,
      pointHoverRadius: 0,
      pointBorderWidth: 0,
      lineTension: 0
    }
  ]
};

class ProductInside extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
    onExpand: PropTypes.func,
    child: PropTypes.bool,
    expanded: PropTypes.bool
  };

  state = {
    hovered: false
  }

  constructor( props ) {
    super( props );

    this.clampedName = React.createRef();
    this.productContainer = React.createRef();
  }

  onMouseEnter = event => {
    const { hovered } = this.state;

    const isViewScrolling = this.productContainer.current && this.productContainer.current.matches( '.ps--scrolling-y *' );

    if(!isViewScrolling && !hovered)
      this.setState( { hovered: true } );
  }

  onMouseLeave = event => {
    const { hovered } = this.state;

    const isViewScrolling = this.productContainer.current && this.productContainer.current.matches( '.ps--scrolling-y *' );

    if(!isViewScrolling && hovered)
      this.setState( { hovered: false } );
  }

  onSelect = event => {
    const { product, onSelect } = this.props;
    onSelect( product.id );
  }

  getChartData = () => {
    const { product } = this.props;

    let data = _.cloneDeep( CHART_DATA );

    data.datasets[0].data = [
      product.graph_x1,
      product.graph_x2,
      product.graph_x3,
      product.graph_x4,
    ]

    return data;
  }

  showModal = event => {
    const { showModal, product } = this.props;
    showModal( product );
  }

  getStarRatingMob = rating => {
    const percent = (rating/5)*100;
    return rating ? (percent/100)*1 : 0;
  }

  render() {
    const { product, child, onExpand, expanded, selectedProducts, selectActive, mobile } = this.props;
    const { hovered } = this.state;

    const selected = selectedProducts.includes( product.id );
    const showCheckbox = !mobile && ( selectActive || hovered || selected );

    const starRatingMobProps = {
      rating: this.getStarRatingMob(product.amazon_rating),
      starDimension: "14px",
      starSpacing: "0px",
      starEmptyColor: "#e5e8f0",
      starRatedColor: "#fec400",
      svgIconViewBox: "0 0 45 45",
      svgIconPath: SVG_STAR,
      className: "py-2.5",
      numberOfStars: 1
    };

    const starRatingProps = {
      rating: product.amazon_rating ? parseFloat(product.amazon_rating, 10) : 0,
      starDimension: "12px",
      starSpacing: "0px",
      starEmptyColor: "#e5e8f0",
      starRatedColor: "#fec400",
      svgIconViewBox: "0 0 45 45",
      svgIconPath: SVG_STAR,
      className: "py-2.5"
    };

    const nameClampLines = mobile ? 3 : 2;

    const classes = {
      container: "reviews__product relative w-full flex items-center flex-no-shrink px-4 lg:px-5 " + ( child ? "reviews__product_child" : "bg-white" ) + ( expanded ? " reviews__product_expanded" : "" ) + ( mobile ? " flex-col h-auto max-w-full-margin m-2.5 rounded-lg" : "" ) + (showCheckbox ? 'pointer-events-none' : 'pointer-events-auto'),
      image: "reviews__product-image flex-no-shrink bg-white border flex rounded-sm " + ( child ? "h-10 w-10 ml-5" : "h-15.5 w-15.5" ),
      button: "flex items-center h-7 rounded-lg ",
      checkbox: "reviews__product-checkbox common-transition w-7 overflow-hidden flex items-center flex-no-shrink " + ( showCheckbox ? "max-w-7" : "max-w-0" )
    };

    const childrenOverlay =
      <div className="bg-white rounded-lg shadow-vp-default" style={{ minWidth: 84 }}>
      <div key={ product.asin } className="h-7 w-full flex items-center justify-center text-xs font-bold text-dusk">
        { product.asin }
      </div>
      { product.child_products && product.child_products.map( child => {
        return <div key={ child.asin } className="h-7 w-full flex items-center justify-center text-xs font-bold text-dusk border-t">
          { child.asin }
        </div>
      } )}
    </div>


    return (

      <div className={ classes.container } onMouseEnter={ this.onMouseEnter } onMouseLeave={ this.onMouseLeave } onMouseMove={ this.onMouseEnter } ref={ this.productContainer }>
        {/* Checkbox */}
        { !child && <section className={ classes.checkbox }  onClick={ this.onSelect }>
          <div className={ "flex items-center justify-center rounded border w-4 h-4 text-xxs text-white " + ( selected ? "border-water-blue bg-water-blue" : "bg-white" ) }>
            <Icon name="check" class="-mt-px" />
          </div>
        </section> }
        {/* This section becomes top section on mobile */}
        <section className={ "flex flex items-center w-full lg:w-auto lg:flex-grow " + ( mobile ? "border-b pb-2.5" : "" ) }>
          {/* Image */}
          <section className={ classes.image }>
            <img
              src={product.image_url}
              alt={product.name}
              className="m-auto h-full object-contain"
            />
          </section>

          {/* Body */}
          <section
            onClick={ this.showModal }
            className="flex-grow cursor-pointer flex flex-col justify-center h-full mx-5"
          >
            {/* Name */}
            <ClampLines
              text={ product.name }
              lines={ nameClampLines }
              ellipsis="&hellip;"
              buttons={ false }
              className="text-sm font-semibold text-dusk"
              ref={ this.clampedName }
            />

            {/* Group */}
            <div className="text-dusk opacity-80 text-sm font-medium mt-1">
              {product.product_group}
            </div>
          </section>

          { mobile && <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              classes.button +
              "leading-none w-4 ml-2 text-base text-light-grey-blue-40 hover:text-water-blue justify-center"
            }
          >
            <Icon name="arrow-right" class="" />
          </a> }
        </section>

        {/* Links and Actions */}
        <section className="flex justify-between lg:justify-start items-center py-2.5 lg:py-0 h-50px lg:h-full w-full lg:w-auto flex-no-shrink">

          {/*  Flag */}
          { !child &&
            <div className="reviews__flag mr-2.5 md:mr-4">
              <img
                src={`/images/Flags/${product.marketplace_code}.svg`}
                alt={`${product.marketplace_code} Amazon Marketplace`}
              />
            </div>
          }

          {/* Child products */}
          { !mobile && (<>
            { product.child_products && product.child_products.length > 0 && (
              <div
                onClick={ onExpand }
                className={
                  classes.button +
                  "reviews__asin-button reviews__asin-button_multiple cursor-pointer mr-3.5 justify-center px-2 rounded-lg block text-xs font-semibold leading-none " + ( expanded ? "reviews__asin-button_multiple-expanded bg-light-grey-blue-95 hover:bg-light-grey-blue-95 text-white" : "bg-light-grey-blue-15 hover:bg-light-grey-blue-30 text-dusk hover:text-dusk" )
                }
              >
                {/* Child product count */}
                <span className="mr-2">{product.asin}</span>
                <Icon
                  name={ expanded ? "arrow-up" : "arrow-down" }
                  class={ "text-xxs " + ( expanded ? "text-white" : "opacity-60 text-arrow" ) }
                />
                <div className="reviews__asin-button-count flex justify-center items-center">
                  <span>{product.child_products.length}</span>
                </div>
              </div>
            )}

            { !child && ( !product.child_products || product.child_products.length === 0 ) && (
              <div
                className={
                  classes.button +
                  "reviews__asin-button mr-3.5 justify-center px-2 rounded-lg block bg-light-grey-blue-15 text-xs text-dusk font-semibold leading-none"
                }
              >
                {product.asin}
              </div>
            )}

            { child && (<div
              className={
                classes.button +
                "reviews__asin-button reviews__asin-button_child mr-3.5 justify-center px-2 rounded-lg block bg-light-grey-blue-15 text-xs text-dusk font-semibold leading-none " +
                ( expanded ? "reviews__asin-button_child-expanded" : "" )
              }
            >
              <span className="mr-2">{product.asin}</span>
              <div className="reviews__asin-button-dot relative" />
            </div>)}
          </>)}

          {/* Child products mobile */}
          { mobile && (<>
            { product.child_products && product.child_products.length > 0 && (
              <Dropdown
                overlay={ childrenOverlay }
              >
                <div
                  className={
                    classes.button +
                    "reviews__asin-button reviews__asin-button_multiple cursor-pointer md:mr-2.5 justify-center px-1 md:px-2 rounded-lg block text-xs font-semibold leading-none " + ( expanded ? "reviews__asin-button_multiple-expanded bg-light-grey-blue-95 hover:bg-light-grey-blue-95 text-white" : "bg-light-grey-blue-15 hover:bg-light-grey-blue-30 text-dusk hover:text-dusk" )
                  }
                >
                <span className="mr-2">{product.child_products.length + 1} ASINs</span>
                <Icon
                  name={ expanded ? "arrow-up" : "arrow-down" }
                  class={ "text-xxs " + ( expanded ? "text-white" : "opacity-60 text-arrow" ) }
                />
                </div>
              </Dropdown>
            )}

            { ( !product.child_products || product.child_products.length === 0 ) &&
              <div
                className={
                  classes.button +
                  "reviews__asin-button cursor-pointer md:mr-2.5 justify-center px-1 md:px-2 rounded-lg block text-xs font-semibold leading-none " + ( expanded ? "reviews__asin-button_multiple-expanded bg-light-grey-blue-95 hover:bg-light-grey-blue-95 text-white" : "bg-light-grey-blue-15 hover:bg-light-grey-blue-30 text-dusk hover:text-dusk" )
                }
              >
                {product.asin}
              </div>
            }
          </>) }



          {/* Comments count */}
          <div className="mx-0 lg:mx-3.5 leading-none flex items-center relative">
            <div className="mr-2 lg:mr-0.5 text-xxs lg:text-sm font-semibold text-dusk min-w-6 text-right">
              {product.num_comments}
            </div>

            <Icon name="comments" class="text-comments-grey text-xl leading-none" />

            {/* Unread notification dot */}
            { product.unread_comments && <div className="vpinsight__topbar-notification-dot absolute pin-t pin-r border-3 border-white rounded-full mt-1.5 -mr-4" /> }
          </div>

          {/* Rating */}
          <div className="mx-2.5 md:mx-3.5 leading-none flex items-center text-center">
            { !mobile && <StarRatings {...starRatingProps} /> }
            { mobile && <StarRatings {...starRatingMobProps} />}

            <div className="ml-2 lg:ml-2.5 text-xxs lg:text-sm font-semibold text-dusk min-w-4 lg:min-w-6 mt-1">
              {product.amazon_rating}
            </div>
          </div>

          {/* Reviews chart */}
          <div className="relative min-w-16 xl:min-w-100px h-7 xl:h-9 border border-water-blue-10 flex items-center rounded p-1 xl:mx-3.5">
            {/* Chart */}
            <div className="reviews__very-small-chart relative bg-water-blue-10 rounded">
              <Line data={this.getChartData} options={CHART_OPTIONS} />
            </div>

            <div className="text-dusk text-xxs lg:text-sm font-semibold text-center leading-none min-w-7 lg:min-w-13 mx-px">
              {product.num_reviews}
            </div>
          </div>

          {/* Link to product */}
          { !mobile && <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              classes.button +
              "leading-none w-4 ml-2 text-base text-light-grey-blue-40 hover:text-water-blue justify-center"
            }
          >
            <Icon name="arrow-right" class="" />
          </a> }
        </section>
      </div>

    );
  }
}

const mapStateToProps = state => ({
  selectActive: state.Products.selectActive,
  selectedProducts: state.Products.selectedProducts,
});

const mapDispatchToProps = { showModal };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductInside);
