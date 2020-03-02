import _ from 'lodash';
import actions from './actions';
import tagActions from '../tags/actions';

const ASIN_POLL_DELAY = 3000;

const DEFAULT_FILTERS = {
  search: null,
  sort_by: null,
  marketplace: null,
};

const initState = {
  products: [],
  productsLoading: false,
  filterLoading: false,
  count: null,
  totalCountLoading: false,
  totalCount: null,

  filters: DEFAULT_FILTERS,

  offset: 0,

  selectedProducts: [],

  //  modal
  modalActive: false,
  modalProduct: {},

  //  ASIN processing
  asinProgress: {
    asins_processing: false,
    asins_processed: 0,
    total_asins: 0,
    processed_pct: 0,
  },

  prevAsinsProcessing: false,
  pollDelay: ASIN_POLL_DELAY,
};

/**
 * Insert reviews at the right place
 *
 * @param {array} reviews
 */
export function processIncomingProducts({ offset, products }, newComments) {
  if (offset === 0) {
    return newComments;
  }

  return _.concat(products, newComments);
}

export function processReviewsChart({ history, summary }) {
  return {
    since_month: summary[0].since_month,
    review_count: summary[0].review_count,
    new_review_count: _.map(history, 'new_review_count'),
    labels: _.map(history, 'month'),
    datasets: [
      {
        data: _.map(history, 'review_count'),
      },
    ],
  };
}

export default function productsReducer(state = initState, action) {
  switch (action.type) {
    case actions.CLEAR_PRODUCTS:
      return {
        ...state,
        products: [],
        offset: 0,
      };

    case actions.SET_PRODUCTS:
      const products = processIncomingProducts(state, action.products);
      const offset = products.length;

      return {
        ...state,
        products,
        offset,
      };

    case actions.SET_PRODUCTS_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.filters,
        },
        offset: 0,
        products: [],
        filterLoading: true,
      };

    case actions.CLEAR_PRODUCTS_FILTERS:
      return {
        ...state,
        filters: DEFAULT_FILTERS,
        offset: 0,
        products: [],
      };

    case actions.SET_PRODUCTS_COUNT:
      return {
        ...state,
        count: action.count,
      };

    case actions.GET_TOTAL_PRODUCTS_COUNT:
      return {
        ...state,
        totalCountLoading: true,
      };

    case actions.SET_TOTAL_PRODUCTS_COUNT:
      return {
        ...state,
        totalCountLoading: false,
        totalCount: action.totalCount,
      };

    case actions.SELECT_PRODUCT:
      if (action.ids === 'remove') {
        return {
          ...state,
          selectedProducts: [],
          selectActive: false,
        };
      }

      const selected = _.isArray(action.ids)
        ? false
        : state.selectedProducts.includes(action.ids);
      const selectedProducts = selected
        ? _.difference(state.selectedProducts, [action.ids])
        : _.union(
            state.selectedProducts,
            _.isArray(action.ids) ? [...action.ids] : [action.ids]
          );

      return {
        ...state,
        selectedProducts,
        selectActive: selectedProducts.length > 0,
      };

    /**
     * Loading indicators
     */
    case actions.SET_PRODUCTS_LOADING:
      return {
        ...state,
        productsLoading: true,
      };
    case actions.SET_PRODUCTS_LOADED:
      return {
        ...state,
        productsLoading: false,
        filterLoading: false,
      };

    /**
     * Modal
     */
    case actions.SET_PRODUCT_MODAL_ACTIVE:
      return {
        ...state,
        modalActive: true,
        modalProduct: action.product,
      };

    case actions.SET_PRODUCT_MODAL_INACTIVE:
      return {
        ...state,
        modalActive: false,
        modalProduct: {},
      };

    /**
     * ASIN Processing
     */
    case actions.SET_ASIN_PROGRESS:
      //  Save previous state of processing
      //  so we can tell if we should update products
      //  or not
      const prevAsinsProcessing = _.clone(state.asinProgress.asins_processing);

      return {
        ...state,
        asinProgress: action.asinProgress,
        prevAsinsProcessing,
      };

    case tagActions.SELECT_TAG:
      return {
        ...state,
        offset: 0,
        products: [],
        count: 0,
      };

    default:
      return state;
  }
}
