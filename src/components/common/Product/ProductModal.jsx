import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import StarRatings from 'react-star-ratings';
import PerfectScrollbar from "react-perfect-scrollbar";
import animateScrollTo from 'animated-scroll-to';
import { Modal, Tabs } from "antd";

//  Components
import Icon from '../Icon'
//  Actions
import { hideModal } from '../../../redux/products/actions';
import { isMobile } from '../../../redux/app/actions';
//  Assets
import { SVG_STAR } from '../../../settings';
//  Styles
import '../../../scss/Products/ProductModal.scss'
import MobileModal from "../MobileModal";

import { ReviewsTab, MainTab, Asin } from "./components";

class ProductModal extends PureComponent {

  state = {
    asinsExpanded: false,
    showTagsInput: false
  }

  handleClose = event => {
    const { hideModal } = this.props;
    hideModal();

    this.setState({
      asinsExpanded: false,
      showTagsInput: false
    })
  }

  /**
   * Scroll up when tags input becomes focused
   *
   * @param {object} event - 'onClick' event
   */
  onTagsFocus = event => {
    animateScrollTo( this.tagsInputContainer.current,
      {
        elementToScroll: this.mainContainer,
      });
  }

  /**
   * Update tags on each change
   *
   * @param {object} { addedTags, removedTags }
   */
  updateTags = ({ addedTags, removedTags }) => {
    this.tagsInput.current.update();
  }

  expandCollapseAsins = event => {
    this.setState({
      asinsExpanded: !this.state.asinsExpanded
    });
  }

  showTagsInput = event => {
    this.setState({ showTagsInput: true })
  }

  constructor( props ) {
    super( props );

    this.tagsInputContainer = React.createRef();
    this.tagsInput = React.createRef();
  }

  componentDidUpdate( prevProps, prevState ) {
    const { visible } = this.props;
    const { visible: prevVisible } = prevProps;

    if ( visible === true && visible !== prevVisible ) {
      if ( this.mainContainer ) this.mainContainer.scrollTop = 0;
      if ( this.reviewsContainer ) this.reviewsContainer.scrollTop = 0;
    }

    if ( this.state.showTagsInput === true && prevState.showTagsInput === false ) {
      this.onTagsFocus();
    }
  }

  render() {
    const { modalActive: visible, modalProduct: product, mobile, tags } = this.props;
    const { asinsExpanded } = this.state;
    const productReviewUrl = (product.review_page_url && product.review_page_url.length > 0) ? product.review_page_url : `${product.url}#customerReviews`
    const starRatingProps = {
      rating: product.amazon_rating ? parseFloat( product.amazon_rating, 10 ) : 0,
      starDimension: "16px",
      starSpacing: "0px",
      starEmptyColor: "#e5e8f0",
      starRatedColor: "#fec400",
      svgIconViewBox: "0 0 45 45",
      svgIconPath: SVG_STAR,
      className: "py-2.5"
    };

    const classes = {
      button: "flex items-center justify-center rounded-lg h-14 flex-grow text-white hover:text-white uppercase font-bold mx-2.5 text-base ",
      pill: "flex items-center justify-center rounded-full h-7 text-sm text-dusk-50 px-3.5 leading-none bg-white m-1"
    }

    const showTagsInput = this.state.showTagsInput || ( tags && tags.length > 0 );

    const manyChildren = product.child_products && product.child_products.length > 2;

    const childAsins = product.child_products && product.child_products.map( ({asin}, index ) => {
      return <Asin key={ asin + index } asin={ asin } grow={ manyChildren } />
    } );

    const mainTabProps = {
      product,
      mobile,
      visible,
      manyChildren,
      asinsExpanded,
      childAsins,
      showTagsInput,
      tagsInputContainerRef: this.tagsInputContainer,
      tagsInputRef: this.tagsInput,
      onTagsFocus: this.onTagsFocus,
      updateTags: this.updateTags,
      expandCollapseAsins: this.expandCollapseAsins,
      showTagsInputHandler: this.showTagsInput
    }

    const content = (<>
      <div className={ "reviews__product-modal-content relative w-full flex flex-col items-center bg-white rounded-lg" } >
        {/* header */}
        <section className="w-full rounded-t-lg">
          {/* image */}
          <div className="reviews__product-image-modal bg-white absolute pin-t pin-l overflow-hidden ml-7 mt-7">
            <img src={ product.image_url } alt={ product.name } className="w-full h-full object-contain"/>
          </div>
          {/* Title */}
          <section className="reviews__product-name-modal flex flex-col w-full rounded-t-lg bg-water-blue text-white pt-7 pr-7 text-sm font-semibold">
            <span>{ product.name }</span>
            <small className="text-xs font-semibold text-white-50">{ product.product_group }</small>
          </section>
          {/* Rating */}
          <section className="reviews__product-rating-modal flex items-center justify-between bg-white text-dusk pr-7 h-12">
            {/* Rating itself */}
            <div className="leading-none flex items-center">
              <StarRatings {...starRatingProps} />
              <div className="ml-2.5 text-sm font-semibold text-dusk min-w-6">
                {product.amazon_rating}
              </div>
            </div>
            {/* flag */}
            <div className="reviews__flag">
              <img
                src={`/images/Flags/${product.marketplace_code}.svg`}
                alt={`${product.marketplace_code} Amazon Marketplace`}
              />
            </div>
          </section>
        </section>

        {/* tabs */}
        <Tabs className="reviews__product-tabs-modal w-full">
          <Tabs.TabPane tab="MAIN INFO" key="1">
            { mobile ?
              <div ref={ ref => { this.mainContainer = ref } } className="reviews__product-modal-tab flex flex-col h-full overflow-y-scroll">
                <MainTab {...mainTabProps} />
              </div>
              :
              <PerfectScrollbar containerRef={ ref => { this.mainContainer = ref }} className="reviews__product-modal-tab flex flex-col">
                <MainTab {...mainTabProps} />
              </PerfectScrollbar>
            }
          </Tabs.TabPane>

          <Tabs.TabPane tab="REVIEWS HISTORY" key="2">
            { mobile ?
              <div ref={ ref => { this.reviewsContainer = ref } } className="reviews__product-modal-tab flex flex-col h-full overflow-y-scroll">
                <ReviewsTab product={ product } mobile={ mobile } />
              </div>
              :
              <PerfectScrollbar containerRef={ ref => { this.reviewsContainer = ref }} className="reviews__product-modal-tab flex flex-col">
                <ReviewsTab product={ product } mobile={ mobile } />
              </PerfectScrollbar>
            }
          </Tabs.TabPane>
        </Tabs>

        {/* buttons */}
        <section className="reviews__product-modal-buttons flex items-center w-full rounded-b-lg border-t flex-no-shrink px-5">
          <a href={ productReviewUrl } target="_blank" rel="noopener noreferrer" className={ classes.button + " w-1/2 bg-marigold hover:bg-marigold-hover" }>
            <Icon name="amazon" class="text-xl mr-2.5" />
            Reviews
          </a>
          <a href={ product.url } className={ classes.button + " w-1/2 bg-water-blue hover:bg-water-blue-hover" } target="_blank" rel="noopener noreferrer">
            <Icon name="amazon" class="text-xl mr-2.5" />
            Listing
          </a>
        </section>
      </div>
      {!mobile &&
      <button
        onClick={ this.handleClose }
        className="leading-normal block reviews__modal-close absolute pin-r pin-t w-9 h-9 bg-black-50 text-white text-xs -mt-5 -mr-4 rounded-full flex justify-center items-center"
      >
        <Icon name="cross" />
      </button>
      }
    </>);

    return (<>
      { !mobile &&
        <Modal
          title={ null }
          footer={ null }
          visible={ visible }
          onOk={ this.handleClose }
          onCancel={ this.handleClose }
          closable={ false }
          width={ 500 }
          centered={true}
          wrapClassName="reviews__review-modal-wrap"
          maskClosable={ true }
          maskStyle={ {
            backgroundColor: 'rgba( 0,0,0,0.82 )'
          } }
        >
          { content }
        </Modal>
      }

      { (mobile && visible) &&
        <MobileModal
          active={ visible }
          onHide={ this.handleClose }
          theme={ "dark" }
          containerClass={ "flex flex-col px-2.5 pt-4 pb-32 justify-center" }
        >
          { content }
        </MobileModal>
      }
    </>);
  }
}

const mapStateToProps = (state) => ({
  tags: state.Tags.tags,
  modalActive: state.Products.modalActive,
  modalProduct: state.Products.modalProduct,
  mobile: isMobile( state.App.view )
})

const mapDispatchToProps = {
  hideModal
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductModal);
