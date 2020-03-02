import SecureAxios from './SecureAxios';

const API_URL = '/server/api/v1/comments/';

class CommentsService {
  //  Collection
  index(params) {
    return SecureAxios.get(API_URL, params);
  }

  count(params) {
    return SecureAxios.get(API_URL + 'count', params);
  }

  recent() {
    return SecureAxios.get(API_URL + 'recent');
  }
}

export default new CommentsService();
