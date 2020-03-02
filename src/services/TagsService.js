import SecureAxios from './SecureAxios';

const API_URL = '/server/api/v1/tags/';

/**
 * @typedef {Object} Tag
 * @property {Number} id: 8
 * @property {String} name: "Tag"
 * @property {String} created_at: "2019-12-21T09:43:01.952Z"
 * @property {String} updated_at: "2019-12-21T09:43:01.952Z"
 * @property {Number} user_id: 1
 */

/**
 * @typedef {Object} CreateAPIResponse
 * @property {Tag} tag
 */

/**
 * t0d0: document API response types
 */
class TagsService {
  /**
   * @returns {Promise<Array<Tag>>}
   */
  get() {
    return SecureAxios.get(API_URL);
  }

  /**
   * Create a new tag
   *
   * @param {String} name - name of new tag
   * @returns {Promise<CreateAPIResponse>}
   */
  create(name) {
    return SecureAxios.post(API_URL, { name });
  }

  /**
   * Get all common tags for a number of products
   *
   * @param {Array} product_ids
   * @return {Promise<Object>}
   */
  common(product_ids) {
    return SecureAxios.post(API_URL + 'common', { product_ids });
  }

  /**
   * Set tags for multiple products
   *
   * @param {Object} payload
   * @return {Promise<Object>}
   */
  bulk_save(payload) {
    return SecureAxios.post(API_URL + 'bulk_save', payload);
  }
}

export default new TagsService();
