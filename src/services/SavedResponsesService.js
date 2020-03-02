import SecureAxios from './SecureAxios';

const API_URL = '/server/api/v1/saved_responses/';

class SavedResponsesService {
  index() {
    return SecureAxios.get(API_URL);
  }
  create(saved_response) {
    return SecureAxios.post(API_URL, saved_response);
  }

  updateOrder(data) {
    return SecureAxios.post(`${API_URL}save_order/`, {
      payload: data.savedResponses,
    });
  }

  remove(data) {
    return SecureAxios.delete(`${API_URL}${data.saved_response}`);
  }

  update(data) {
    return SecureAxios.put(
      `${API_URL}${data.saved_response.id}`,
      data.saved_response
    );
  }
}

export default new SavedResponsesService();
