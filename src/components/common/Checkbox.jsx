import React, { Component } from 'react'
import PropTypes from 'prop-types'


import Icon from "./Icon";

export default class Checkbox extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    checked: PropTypes.bool
  }

  render() {
    const { onClick, checked } = this.props;

    return (
      <div
        onClick={ onClick }
        className={ "cursor-pointer flex items-center justify-center rounded border w-5 h-5 text-white leading-none text-xxs " + ( checked ? "border-water-blue bg-water-blue " : "bg-white" ) }
      >
        <Icon name="check" class="" />
      </div>
    )
  }
}
