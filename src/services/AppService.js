import SecureAxios from './SecureAxios';

const API_URL = '/server/api/v1/';

class AppService {
  //  plans
  plans(params) {
    return SecureAxios.get(API_URL + 'plans');
  }

  sendContactEmail(contactForm) {
    return SecureAxios.post(API_URL + 'contacts/send_mail', {
      contact_lead: { ...contactForm },
    });
  }
}

export default new AppService();
