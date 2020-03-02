import React, {Component} from "react";
import { Redirect} from "react-router-dom";
import {connect} from "react-redux";
import Input from "../../components/uielements/input";

import authAction from "../../redux/auth/actions";
import appAction, { isMobile } from "../../redux/app/actions";

import Spin from '../Feedback/Spin/spin.style';
import ErrorAlerts from './../../components/errorAlerts';

import Logo from '../../components/common/Logo';

import './../../scss/login-and-signup/login-and-signup.scss';

const {login} = authAction;
const {clearMenu} = appAction;

class Login extends Component {
    state = {
        redirectToReferrer: false,
        user: '',
        pass: '',
        errors: "",
        isErrors: false,
    };

    componentWillReceiveProps(nextProps) {
        if (
            this.props.isLoggedIn !== nextProps.isLoggedIn &&
            nextProps.isLoggedIn === true
        ) {
            this.setState({redirectToReferrer: true});
        }

        if(!nextProps.isLoggedIn) {
            this.setState({isErrors: true})
        }
        if(nextProps.loginError) {
            this.setState({errors: nextProps.loginError})
        }
    }

    handleLogin = () => {
        const {login, clearMenu} = this.props;
        login(this.state);
        clearMenu();
    };

    onKeyPress = (e) => {
        if (e.which === 13) {
            this.handleLogin();
        }
    };

    onUserChange = event => {
        this.setState({isErrors: false});
        const value = event.target.value;
        this.setState({user: value});
    };

    onPassChange = event => {
        this.setState({isErrors: false});
        const value = event.target.value;
        this.setState({pass: value});
    };

    render() {
        const { view } = this.props;
        const from = {pathname: "/reservations"};
        const {redirectToReferrer, errors} = this.state;
        const copyData = new Date().getFullYear();
        const errorClass = this.state.isErrors ? 'has-error' : '';
        const mobile = isMobile( view );

        const containerStyle = {
            minWidth: !mobile && '370px',
            width: mobile && '100%'
        };

        if (redirectToReferrer) {
            return <Redirect to={from}/>;
        }

        return (
            <div className={'fixed pin-t pin-l flex w-screen h-screen bg-white'}>
                <ErrorAlerts errors={errors}/>

                <div className={'w-full px-6 h-screen pt-16 pb-12 flex flex-col items-center justify-between'}>
                    <Logo main/>
                    <div style={ containerStyle }>
                        <Spin spinning={this.props.loadingSignup} size="large">
                        <div className={'input-wrp mb-5'}>
                            <Input
                            size="large"
                            placeholder="Email"
                            className={errorClass}
                            value={this.state.user}
                            onChange={this.onUserChange}
                            autoFocus
                            />
                        </div>
                        <div className={'input-wrp'}>
                            <Input
                                size="large"
                                type="password"
                                placeholder="Password"
                                value={this.state.pass}
                                onChange={this.onPassChange}
                                onKeyPress={this.onKeyPress}
                                className={`mb-2 ${errorClass}`}
                            />

                            {/* <Link to={"/forgotpassword"}>
                                <span className={'forgot-password block text-right text-light-grey-blue font-bold text-xs mb-8 icon-password'}>FORGOT PASSWORD?</span>
                            </Link> */}

                        </div>

                        <div>
                            <div className={'input-wrp mb-10'}>
                                <button
                                    className={'w-full p-5 bg-water-blue text-white text-lg font-bold rounded shadow-vp-login'}
                                    onClick={this.handleLogin}
                                >
                                    SIGN IN
                                </button>
                            </div>

                            {/* <div className={'text-center text-light-grey-blue font-medium'}>
                                Don’t have an account? <Link to="/signup" > <span className={'font-bold text-water-blue inline-flex items-center'}>Register → </span></Link>
                            </div> */}
                        </div>

                        </Spin>
                    </div>

                    <div className={'text-lighter-grey-blue opacity-3 text-xxs font-semibold'}>
                        © {copyData} VPInsight. All right reserved.
                    </div>
                </div>
            </div>
        );
    }
}

// export default Login;

export default connect(
  state => ({
    isLoggedIn: !!(state.Auth.idToken),
    loginError: state.Auth.loginError,
    loadingSignup: state.Auth.loadingSignup,

    //  view data
    view: state.App.view
  }),
  {login, clearMenu}
)(Login);
