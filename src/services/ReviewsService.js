import SecureAxios from './SecureAxios';

const API_URL = '/server/api/v1/reviews/';

class ReviewsService {
  //  Member
  patch({ review_id, params }) {
    return SecureAxios.patch(API_URL + `${review_id}`, params);
  }

  record_response({ review_id, params }) {
    return SecureAxios.post(API_URL + `${review_id}/record_response`, params);
  }

  //  Collection
  index(params) {
    return SecureAxios.get(API_URL, params);
  }

  count(params) {
    return SecureAxios.get(API_URL + 'count', params);
  }

  recent_critical() {
    return SecureAxios.get(API_URL + 'recent_critical', {
      hide_ignored_reviews: true,
    });
  }

  dashboard_graphs() {
    return SecureAxios.get(API_URL + 'dashboard_graphs');
  }
}

export default new ReviewsService();
