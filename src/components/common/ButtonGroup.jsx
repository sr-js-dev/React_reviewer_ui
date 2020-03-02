import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from 'lodash';

import "../../scss/components/ButtonGroup.scss";

export default class ButtonGroup extends Component {
  static propTypes = {
    activeButton: PropTypes.any.isRequired,
    buttons: PropTypes.array.isRequired,
    className: PropTypes.string,
    buttonClass: PropTypes.string,
    activeButtonClass: PropTypes.string,
    idleButtonClass: PropTypes.string,
    hoverClass: PropTypes.string,
    onChange: PropTypes.func
  };

  static defaultProps = {
    className: "h-9.5 rounded",
    buttonClass: "h-9.5 min-w-16 px-5 text-xs bg-transparent",
    activeButtonClass: "text-white font-bold",
    idleButtonClass: "font-semibold text-light-grey-blue",
    hoverClass: "h-9.5 min-w-16"
  }

  state = {
    hoverStyle: {}
  }

  /**
   * Get style for the hover block
   * that moves right under the active button
   *
   * @return {object} - JSX style object
   */
  hoverStyle = () => {
    const { activeButton, buttons } = this.props;
    const activeButtonIndex = _.findIndex( buttons, [ 'key', activeButton ] );

    let offset = 0;

    for (let index = 0; index < activeButtonIndex; index++) {
      if (this.buttonRefs[index]) {
        offset = offset + this.buttonRefs[index].offsetWidth;
      }
    }

    this.setState({
      hoverStyle: {
        transform: `translateX( ${offset}px )`,
        width:
          typeof this.buttonRefs[activeButtonIndex] !== "undefined"
            ? this.buttonRefs[activeButtonIndex].offsetWidth + "px"
            : 0
      }
    })
  };

  /**
   * Handle button click
   *
   * @param {any} key - button key
   */
  buttonHandler = key => {
    const { onChange } = this.props;
    onChange( key );
  };

  constructor(props) {
    super(props);

    this.buttonRefs = [];
  }

  componentDidMount() {
    this.hoverStyle();
  }

  componentDidUpdate( prevProps ) {
    if ( !_.isEqual( prevProps, this.props ) ) {
      this.hoverStyle();
    }
  }

  render() {
    const { activeButton, buttons, className, buttonClass, hoverClass, activeButtonClass, idleButtonClass } = this.props;
    const { hoverStyle } = this.state;

    const buttonNodes = buttons && buttons.map(button => {
      const active = activeButton === button.key;

      return (
        <button
          key={button.key}
          ref={el => { this.buttonRefs.push(el);}}
          className={ `vpinsights__button relative z-20 leading-none flex-no-shrink ${ buttonClass } ${ active ? " active " + activeButtonClass : idleButtonClass }` }
          onClick={e => {this.buttonHandler(button.key);}}
        >
          {button.title}
        </button>
      );
    });

    return (
      <div className={"vpinsights__button-group relative flex " + className}>
        { buttonNodes }

        <div className={ "vpinsights__button-group-hover absolute pin-l pin-t z-10 " + hoverClass } style={hoverStyle} />
      </div>
    );
  }
}
