import React from 'react';
import settingsActions from '../../../redux/settings/actions';
import { connect } from 'react-redux';
import Spin from '../../Feedback/Spin/spin.style';
import Modal from '../../../components/feedback/modal';
import Input, { Textarea } from '../../../components/uielements/input';
import { Fieldset, Label } from './properties.style';
import Icon from '../../../components/common/Icon';
import _ from 'lodash';
import Alert from '../../../components/feedback/alert';

import { MODAL_CLOSE_CLASSNAME } from '../../../settings';

const {
  toggleContactModal,
  contactFormUpdate,
  sendContactMail,
} = settingsActions;

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

class ContactUs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form_error: null,
      form_success: false,
    };
  }
  componentDidMount() {}

  toggleContactModal = () => {
    const { toggleContactModal } = this.props;
    toggleContactModal();
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.modalContactActive !== this.props.modalContactActive) {
      this.setState({ form_success: false, form_error: null });
    }
  }

  onRecordChange = (key, event) => {
    this.setState({ form_success: false, form_error: null });
    let { contactForm } = _.cloneDeep(this.props);
    if (key) {
      contactForm[key] = event.target.value;
    }
    this.props.contactFormUpdate(contactForm);
  };

  onButtonClick = contactForm => {
    const { sendContactMail } = this.props;
    sendContactMail(contactForm);
  };

  handleSubmit = e => {
    this.setState({ form_success: false, form_error: null });
    let { contactForm } = _.cloneDeep(this.props);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({ 'form-name': 'contactform', ...contactForm }),
    })
      .then(() => this.setState({ form_success: true }))
      .catch(error => this.setState({ form_error: error }));
    e.preventDefault();
  };

  render() {
    const { form_success, form_error } = this.state;
    const { modalContactActive, user } = this.props;
    const { contactForm } = _.cloneDeep(this.props);
    if (user && user.current_user) {
      if (
        user.current_user.settings.first_name &&
        user.current_user.settings.last_name
      ) {
        contactForm.name =
          user.current_user.settings.first_name +
          ' ' +
          user.current_user.settings.last_name;
      }
      contactForm.email = user.current_user.settings.email;
    }

    return (
      <div className="">
        <Modal
          visible={modalContactActive}
          onClose={this.toggleContactModal.bind(this)}
          title={'CONTACT US'}
          okText={'Send'}
          onOk={this.onButtonClick.bind(this, contactForm)}
          onCancel={this.toggleContactModal.bind(this)}
          closable={false}
          footer={null}
        >
          <Spin spinning={this.props.loadingContacts} size="large">
            {form_error && (
              <Alert
                message="Error"
                description={form_error}
                type="error"
                closable
                showIcon
                className="mb-5"
              />
            )}
            {form_success && (
              <Alert
                message="Data Submited"
                description="Thank you for contacting us, We will get back to you soon."
                type="success"
                closable
                showIcon
                className="mb-5"
              />
            )}
            <form
              id="template-contactform"
              name="contactform"
              method="POST"
              netlify
              data-netlify-recaptcha="true"
              onSubmit={this.handleSubmit}
            >
              <input type="hidden" name="form-name" value="contactform" />
              <Fieldset>
                <Label>Name</Label>
                <Input
                  label="Name"
                  name="name"
                  placeholder="Name"
                  value={contactForm.name}
                  required
                  onChange={this.onRecordChange.bind(this, 'name')}
                />
              </Fieldset>
              <Fieldset>
                <Label>Email</Label>
                <Input
                  name="email"
                  label="Email"
                  placeholder="Email"
                  value={contactForm.email}
                  required
                  onChange={this.onRecordChange.bind(this, 'email')}
                />
              </Fieldset>
              <Fieldset>
                <Label>Phone</Label>
                <Input
                  name="phone"
                  label="Phone"
                  placeholder="Phone"
                  value={contactForm.phone}
                  required
                  onChange={this.onRecordChange.bind(this, 'phone')}
                />
              </Fieldset>
              <Fieldset>
                <Label>Subject</Label>
                <Input
                  name="subject"
                  label="Subject"
                  placeholder="Subject"
                  value={contactForm.subject}
                  required
                  onChange={this.onRecordChange.bind(this, 'subject')}
                />
              </Fieldset>
              <Fieldset>
                <Label>Message</Label>
                <Textarea
                  name="message"
                  placeholder="Message"
                  value={contactForm.message}
                  required
                  onChange={this.onRecordChange.bind(this, 'message')}
                />
              </Fieldset>
              <div data-netlify-recaptcha="true"></div>
              <div className="-mx-6 border-t border-gray-700 border-solid"></div>
              <div className="text-right mt-4 pt-2">
                <button
                  type="button"
                  className="ant-btn mr-2"
                  onClick={this.toggleContactModal}
                >
                  <span>Cancel</span>
                </button>

                <button type="submit" className="ant-btn ant-btn-primary">
                  Send Message
                </button>
              </div>
            </form>
          </Spin>
          <button
            onClick={this.toggleContactModal.bind(this)}
            className={MODAL_CLOSE_CLASSNAME}
          >
            <Icon name="cross" />
          </button>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.Auth.currentUser,
    contactForm: state.Settings.contactForm,
    modalContactActive: state.Settings.modalContactActive,
    loadingContacts: state.Settings.loadingContacts,
  };
}
export default connect(
  mapStateToProps,
  {
    toggleContactModal,
    contactFormUpdate,
    sendContactMail,
  }
)(ContactUs);
