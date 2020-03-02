import axios from 'axios';

class SecurityService {
  authenticate(user, pass) {
    let url = '/server/api/v1/users/login';
    let body = 'username=' + user + '&password=' + pass;

    return axios
      .post(url, body, {
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded'
        },
      })
      .then(function(response) {
        console.log(response);
        let token_response = response.data;
        localStorage.setItem('access_token', token_response.access_token);
        return token_response.access_token;
      })
      .catch(error => {
        console.log(error.response);
        return { error: error.response.data };
      });
  }
}

export default new SecurityService();
