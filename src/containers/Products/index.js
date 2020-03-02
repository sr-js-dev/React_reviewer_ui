import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { InView } from 'react-intersection-observer';

import {
  getProducts,
  getProductsCount,
  setFilters,
  selectItem,
  clearFilters,
} from '../../redux/products/actions';
import settingsActions from '../../redux/settings/actions';

import Product from '../../components/common/Product';
import LoadingAnimation from '../../components/common/LoadingAnimation';
import SortingBar from './components/SortingBar';
import ActionsBar from './components/ActionsBar';

import '../../scss/Reviews.scss';
import AddProduct from '../../components/common/AddProduct';
import {
  isMobile,
  setQueryParams,
  EXTENDED_MOBILE,
} from '../../redux/app/actions';
import ProductModal from '../../components/common/Product/ProductModal';
import ASINProgress from './components/ASINProgress';
import Tour from 'reactour';

const { saveUserProfile } = settingsActions;
const steps = [
  {
    selector: '.reviews__add-product-tour-target',
    content: '',
  },
];
export class Products extends Component {
  state = {
    intersectionObserverPrevEntry: null,
    selectedIDs: [],
    show_tour: false,
  };

  /**
   * Callback for react-waypoint
   */
  intersectionHandler = (inView, entry) => {
    const { productsLoading } = this.props;
    const { intersectionObserverPrevEntry } = this.state;
    if (
      !productsLoading &&
      intersectionObserverPrevEntry &&
      intersectionObserverPrevEntry.intersectionRect.height <
        entry.intersectionRect.height
    ) {
      this.getProductsThrottled();
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

  getProducts = () => {
    const { getProducts } = this.props;
    getProducts();
  };

  /**
   * Load more reviews
   *
   * @param {object} event - click event
   */
  loadMore = event => {
    this.getProductsThrottled();
  };

  getProductsCount() {
    const { getProductsCount } = this.props;
    getProductsCount();
  }

  /**
   * Add or remove product.id from
   * the list of selected products
   *
   * @param { int | string } product_id -
   */
  onSelect = product_id => {
    const { selectItem } = this.props;
    selectItem(product_id);
  };

  applyQueryParams() {
    const { queryParams, filters, setFilters } = this.props;

    setFilters(_.pick(queryParams, Object.keys(filters)));
  }

  constructor(props) {
    super(props);

    this.getProductsThrottled = _.throttle(this.getProducts, 1000);
  }

  componentDidMount() {
    const { products } = this.props;

    if (products.length === 0) {
      this.getProducts();
      this.getProductsCount();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.show_tour === false &&
      !this.state.show_tour &&
      this.props.user &&
      this.props.user.current_user.settings.show_tour
    ) {
      this.setState({ show_tour: true });
    }

    if (!_.isEqual(this.props.queryParams, prevProps.queryParams)) {
      this.applyQueryParams();
    }
  }

  componentWillUnmount() {
    const { filters, setQueryParams, clearFilters, pathname } = this.props;
    //  Unset any filter query params,
    //  specific to Products page when
    //  navigating away from it
    if (pathname !== '/products') {
      clearFilters();
      setQueryParams({ $unset: Object.keys(filters) }, false);
    }
  }

  closeTour = () => {
    this.setState({ show_tour: false });
    this.props.saveUserProfile({ show_tour: false });
  };

  render() {
    const {
      productsLoading,
      products: productsProp,
      count,
      mobile,
      offset,
      filterLoading,
      selectedProducts,
    } = this.props;
    const { show_tour } = this.state;

    let products = _.uniqBy(productsProp, 'id');

    const noProducts = !products || products.length === 0;

    const selectActive = selectedProducts.length > 0;

    const productsList = products.map(product => {
      const props = {
        product,
        selectActive,
        selected: selectedProducts.includes(product.id),
        onSelect: this.onSelect,
        key: product.id,
      };

      return <Product {...props} mobile={mobile} />;
    });

    const classes = {
      container:
        'reviews__items-container flex flex-col w-full min-h-160px bg-white rounded-lg shadow-vp-default ',
    };
    const threshold = [0.25, 0.5, 0.75];
    return (
      <>
        <Tour
          steps={steps}
          isOpen={show_tour}
          onRequestClose={this.closeTour}
          showNumber={false}
          showButtons={false}
          showNavigation={false}
          showCloseButton={false}
          className="rounded-lg"
          children={
            <>
              <p className="mt-4 text-dusk text-base font-medium">
                Add your products, and then hang tight while we collect reviews.
                This usually takes under 10 minutes, depending on the number of
                reviews.
              </p>
              <button
                className="bg-water-blue hover:bg-water-blue-hover text-white font-bold rounded-lg border border-water-blue hover:border-water-blue-hover p-2 float-right mt-2"
                onClick={this.closeTour}
              >
                Done
              </button>
            </>
          }
        />

        <ProductModal />

        <section className="w-full min-h-full lg:p-7 z-10">
          {/* Title */}
          <div className="flex justify-start items-center h-17.5 lg:h-auto lg:mb-7">
            <div className="reviews__add-product-tour-target flex items-center">
              {/* Add button */}
              <AddProduct showCount={false} closeTour={this.closeTour} />
              {/* Page title */}
              <h1 className="text-xl font-bold text-dusk mx-2.5">
                Add Products
              </h1>
            </div>
          </div>

          <ASINProgress />

          {/* Main section */}
          <section className={mobile ? '' : classes.container}>
            {/* Search / Sorting bar */}
            <SortingBar mobile={mobile} />

            <ActionsBar mobile={mobile} />

            {noProducts && (productsLoading || filterLoading) && (
              <LoadingAnimation className="py-4" />
            )}

            {noProducts && !(productsLoading || filterLoading) && (
              <div className="w-full text-2xl font-medium text-light-grey-blue text-center py-7">
                There are no products
              </div>
            )}

            {!noProducts && !filterLoading && (
              <>
                {productsList}

                {!mobile && count > offset && (
                  <InView
                    as="div"
                    onChange={this.intersectionHandler}
                    threshold={threshold}
                  >
                    <div className="w-full flex items-center justify-center py-7">
                      {productsLoading && <LoadingAnimation />}
                    </div>
                  </InView>
                )}

                {mobile && !productsLoading && (
                  <button
                    onClick={this.loadMore}
                    className="w-full max-w-full-margin mx-2.5 mb-2.5 h-11 flex items-center justify-center bg-water-blue-10 text-water-blue text-xs font-bold rounded-lg uppercase"
                  >
                    Load More
                  </button>
                )}

                {mobile && productsLoading && (
                  <LoadingAnimation className="mt-5" />
                )}
              </>
            )}
          </section>
        </section>
      </>
    );
  }
}

const mapStateToProps = state => ({
  ...state.Products,
  pathname: state.router.location.pathname,
  queryParams: state.App.queryParams,
  mobile: isMobile(state.App.view, EXTENDED_MOBILE),
  user: state.Auth.currentUser,
});

const mapDispatchToProps = {
  getProducts,
  getProductsCount,
  setFilters,
  clearFilters,
  selectItem,
  saveUserProfile,
  setQueryParams,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Products);
