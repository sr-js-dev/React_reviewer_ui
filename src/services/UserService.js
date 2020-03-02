import SecureAxios from './SecureAxios';

class UserService {
  getCurrentUser() {
    return SecureAxios.get('/server/api/v1/users/current_user');
  }

  markNotificationsRead() {
    return SecureAxios.post('/server/api/v1/users/mark_notifications_read', {});
  }

  billing() {
    return SecureAxios.get('/server/api/v1/users/get_billing');
  }

  billing_history() {
    return SecureAxios.get('/server/api/v1/users/billing_history');
  }

  saveUserProfile(userForm) {
    return SecureAxios.put('/server/api/v1/users/update_profile', {
      user: userForm,
    });
  }

  setPlan(plan) {
    return SecureAxios.post('/server/api/v1/users/set_plan', plan);
  }

  addBilling(stripeToken) {
    return SecureAxios.post('/server/api/v1/users/add_billing', {
      stripeToken: stripeToken,
    })
      .then(function(response) {
        return response;
      })
      .catch(error => {
        return { error: error.response.data };
      });
  }
}

export default new UserService();
