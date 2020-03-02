import axios from 'axios';

import { getSelectedTag } from '../redux/tags/reducer';

class SecureAxios {
  get(url, params = {}) {
    const tag = getSelectedTag();

    if (tag === 'untagged') {
      params.untagged = true;
    } else if (tag !== 'all') {
      params.tag = tag;
    }

    return axios
      .get(url, {
        headers: { Authorization: 'Bearer ' + this.getToken() },
        params,
      })
      .then(function(response) {
        return response.data;
      });
  }

  post(url, payload = {}) {
    const tag = getSelectedTag();

    if (tag === 'untagged') {
      payload.untagged = true;
    } else if (tag !== 'all') {
      payload.tag = tag;
    }

    return axios
      .post(url, payload, {
        headers: { Authorization: 'Bearer ' + this.getToken() },
      })
      .then(function(response) {
        return response.data;
      });
  }

  patch(url, payload = {}) {
    const tag = getSelectedTag();

    if (tag === 'untagged') {
      payload.untagged = true;
    } else if (tag !== 'all') {
      payload.tag = tag;
    }

    return axios
      .patch(url, payload, {
        headers: { Authorization: 'Bearer ' + this.getToken() },
      })
      .then(function(response) {
        return response.data;
      });
  }

  put(url, payload = {}) {
    const tag = getSelectedTag();

    if (tag === 'untagged') {
      payload.untagged = true;
    } else if (tag !== 'all') {
      payload.tag = tag;
    }

    return axios
      .put(url, payload, {
        headers: { Authorization: 'Bearer ' + this.getToken() },
      })
      .then(function(response) {
        return response.data;
      });
  }

  delete(url) {
    return axios
      .delete(url, { headers: { Authorization: 'Bearer ' + this.getToken() } })
      .then(function(response) {
        return response.data;
      });
  }

  getToken() {
    let token = localStorage.getItem('auth0_token');

    if (!token) {
      token = 'demo';
    }

    return token;
  }
}

export default new SecureAxios();
