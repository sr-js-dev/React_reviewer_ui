import SecureAxios from './SecureAxios';

const API_URL = '/server/api/v1/marketplaces/';

class MarketplacesService {
  index() {
    return SecureAxios.get(API_URL);
  }
}

export default new MarketplacesService();
