import SecureAxios from './SecureAxios';

const API_URL = '/server/api/v1/products/';

class ProductsService {
  index(params) {
    return SecureAxios.get(API_URL, params);
  }

  show(id) {
    return SecureAxios.get(API_URL + `${id}`);
  }

  create(product) {
    return SecureAxios.post(API_URL, { product });
  }

  update(id, params) {
    return SecureAxios.patch(API_URL + `${id}`, params);
  }

  total_user_product_count() {
    return SecureAxios.get(API_URL + 'total_user_product_count');
  }

  count(params) {
    return SecureAxios.get(API_URL + 'count', params);
  }

  delete_multiple(params) {
    return SecureAxios.post(API_URL + 'delete_multiple', params);
  }

  review_history(product_id) {
    return SecureAxios.get(API_URL + product_id + '/review_history');
  }

  //  Adding product APIs

  /**
   * Validate user input
   *
   * @param {string} product - can be ASIN or URL
   * @returns {Promise<object>}
   */
  validate(product) {
    return SecureAxios.get(API_URL + 'validate', { product });
  }

  /**
   * Create multiple products
   *
   * @param {array<Product>} products - array of valid Product objects
   */
  add(products) {
    return SecureAxios.post(API_URL + 'add', { products });
  }

  /**
   * Upload CSV or XLS/XLSX file to add multiple products
   *
   * @param {File} file - file to upload
   * @param {function} onProgress - progress callback
   * @returns {Promise<Object>}
   */
  upload(file, marketplace_id, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('marketplace_id', marketplace_id);

    return SecureAxios.post(API_URL + 'upload', formData, {
      onUploadProgress: onProgress,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get IDs of all products that are available for
   * selection for this user
   *
   * @returns {Promise<Array>}
   */
  select_all() {
    return SecureAxios.get(API_URL + 'select_all');
  }
}

export default new ProductsService();
