import React from 'react';
import { Alert } from "antd";

class ErrorAlert extends React.Component {
    state = {
        errors: null,
        duration: 10
    };

    componentWillReceiveProps(nextProps) {
        let { errors, delay } = nextProps;
        if(errors) this.setErrors(errors, delay);
    }

    setErrors = (errors, delay) => {
        if(typeof errors === 'string') errors = { error: errors };
        this.setState({errors: errors});
        delay = delay ? delay * 1000 : this.state.duration * 1000;
        setTimeout(() => {
            Object.keys(this.state.errors).forEach(key => {
                setTimeout(() => {
                    this.removeError(key);
                }, 1000);
            })
        }, delay)
    };

    removeError = (key) => {
      let { errors } = this.state;
      if(errors.hasOwnProperty(key)) delete errors[key];
      this.setState({errors: errors});
    };

    render() {
        const {errors} = this.state;
        const errorsToShow = errors && Object.keys(errors).map(key => {
            let error = errors[key];
            let message = (<p className={'pr-2'}>
                <strong style={{paddingRight: "5px", textTransform: "capitalize"}}>{key.replace(/_/g,' ')}:</strong>
                {error}
            </p>);
            return (
                <div key={key} className={'pb-2'}>
                    <Alert closable message={message} type="error" onClose={() => this.removeError(key)}/>
                </div>
            )
        });
        return (errors && <div className="errors-container absolute flex flex-col w-full items-center p-2 z-1050">
            {errorsToShow}
        </div>);
    }
}

export default ErrorAlert;
