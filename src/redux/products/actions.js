const productsActions = {
  CLEAR_PRODUCTS: 'CLEAR_PRODUCTS',
  GET_PRODUCTS: 'GET_PRODUCTS',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_PRODUCTS_LOADING: 'SET_PRODUCTS_LOADING',
  SET_PRODUCTS_LOADED: 'SET_PRODUCTS_LOADED',

  GET_PRODUCTS_COUNT: 'GET_PRODUCTS_COUNT',
  SET_PRODUCTS_COUNT: 'SET_PRODUCTS_COUNT',

  GET_TOTAL_PRODUCTS_COUNT: 'GET_TOTAL_PRODUCTS_COUNT',
  SET_TOTAL_PRODUCTS_COUNT: 'SET_TOTAL_PRODUCTS_COUNT',

  SET_PRODUCTS_FILTERS: 'SET_PRODUCTS_FILTERS',
  CLEAR_PRODUCTS_FILTERS: 'CLEAR_PRODUCTS_FILTERS',

  SELECT_PRODUCT: 'SELECT_PRODUCT',
  REMOVE_PRODUCTS: 'REMOVE_PRODUCTS',

  SET_PRODUCT_MODAL_ACTIVE: 'SET_PRODUCT_MODAL_ACTIVE',
  SET_PRODUCT_MODAL_INACTIVE: 'SET_PRODUCT_MODAL_INACTIVE',

  GET_ASIN_PROGRESS: 'GET_ASIN_PROGRESS',
  SET_ASIN_PROGRESS: 'SET_ASIN_PROGRESS',
  CANCEL_ASIN_PROGRESS_POLL: 'CANCEL_ASIN_PROGRESS_POLL',
};

export const getProducts = function() {
  return {
    type: productsActions.GET_PRODUCTS,
  };
};

export const getProductsCount = function() {
  return {
    type: productsActions.GET_PRODUCTS_COUNT,
  };
};

export const getTotalProductsCount = function() {
  return {
    type: productsActions.GET_TOTAL_PRODUCTS_COUNT,
  };
};

export const getAsinsProgress = function() {
  return {
    type: productsActions.GET_ASIN_PROGRESS,
  };
};

export const cancelAsinProgressPoll = function() {
  return {
    type: productsActions.CANCEL_ASIN_PROGRESS_POLL,
  };
};

export const setFilters = function(filters) {
  return {
    type: productsActions.SET_PRODUCTS_FILTERS,
    filters,
  };
};

export const clearFilters = function() {
  return {
    type: productsActions.CLEAR_PRODUCTS_FILTERS,
  };
};

export const selectItem = function(ids) {
  return {
    type: productsActions.SELECT_PRODUCT,
    ids,
  };
};

export const removeProducts = function(ids) {
  return {
    type: productsActions.REMOVE_PRODUCTS,
    ids,
  };
};

export const showModal = function(product) {
  return {
    type: productsActions.SET_PRODUCT_MODAL_ACTIVE,
    product,
  };
};

export const hideModal = function() {
  return {
    type: productsActions.SET_PRODUCT_MODAL_INACTIVE,
  };
};

export default productsActions;
