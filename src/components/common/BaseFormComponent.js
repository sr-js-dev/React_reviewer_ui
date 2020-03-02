import React from 'react';

class BaseFormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    var change = {}
    change[event.target.name] = event.target.value;

    this.setState(change);
  }

  handleModelChange(event, model) {
    var change = model;
    change[event.target.name] = event.target.value;

    this.setState(change);
  }
}

export default BaseFormComponent;
