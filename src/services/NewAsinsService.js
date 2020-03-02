import SecureAxios from './SecureAxios';

/**
 * @typedef {Object} ASINPollParams
 * @property {Boolean} [sample_data] - whether to use demo
 */

/**
 * @typedef {Object} ASINPollResponse
 * @property {Boolean} asins_processing - is any data being processed right now?
 * @property {Number} processed_pct - progress in percents
 * @property {Number} asins_processed - number of processed ASINs
 * @property {Number} total_asins - total number of ASINs in queue
 */

const API_URL = '/server/api/v1/new_asins/';

class NewAsinsService {
  /**
   * Get current progress
   *
   * @param {ASINPollParams} params
   * @returns {Promise<ASINPollResponse>}
   */
  poll(params = {}) {
    return SecureAxios.get(API_URL + 'poll', params);
  }
}

export default new NewAsinsService();
