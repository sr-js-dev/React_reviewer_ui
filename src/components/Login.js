import React from 'react';
import SecurityService from '../services/SecurityService';
import BaseFormComponent from './common/BaseFormComponent';
import {notify} from 'react-notify-toast';

class Login extends BaseFormComponent {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    SecurityService.authenticate(this.state.user, this.state.pass).then(token => {
      console.log(token);
      if (token) {
        this.setState({
          user: '',
          pass: ''
        });
        this.props.history.push('/');
        this.props.callback();
      } else {
        notify.show('Unable to login. Check your username and password.', "error");
      }
    }).catch(error => {
    });

    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div className="login-header d-flex justify-content-between align-items-center">
          <div className="company-name">VP Insight</div>
          <div className="product-name">RESERVATIONS</div>
        </div>
        <div className="container justify-content-center">
          <div className="mt-3 form-signin">
            <div className="card-body">
              <h3 className="card-title">Login</h3>
              <form id="loginForm" className="" noValidate onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" name="user" value={this.state.user} autoFocus="" className="form-control" required onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="pass" value={this.state.pass} className="form-control" required onChange={this.handleChange}/>
                </div>
                <button className="btn btn-md btn-primary btn-block" type="submit">Log in</button>
               </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
