import React, { Component } from "react";
import styled, { css, keyframes } from "styled-components";

import "../../scss/components/LoadingAnimation.scss";

const dotKeyframes = keyframes`
  0% {
      transform: scale( 0.5 );
  }
  50% {
      transform: scale( 1.5 );
  }
  100% {
      transform: scale( 0.5 );
  }
`;

const Dot = styled.div`
  position: absolute;

  height: ${ props => props.size ? `${ Math.floor( props.size * 0.3 ) }px` : "8px" };;
  width: ${ props => props.size ? `${ Math.floor( props.size * 0.08 ) }px` : "8px" };

  top: 20%;
  left: 50%;
  margin-left: ${ props => props.size ? `-${ Math.floor( props.size * 0.04 ) }px` : "-4px" };

  transform-origin: 50% 100%;

  transform: ${ props => props.index && `rotate( ${ 45 * props.index }deg )` };

  :after {
    content: " ";
    display: block;

    width: ${ props => props.size ? `${ Math.floor( props.size * 0.08 ) }px` : "8px" };
    height: ${ props => props.size ? `${ Math.floor( props.size * 0.08 ) }px` : "8px" };

    border-radius: 50%;

    transform: scale(0.5);

    background-color: #1d6fdc;

    ${ props => props.index && css`
      animation: ${ dotKeyframes } 1.5s linear infinite;
      animation-delay: ${ -( 9 - props.index ) * 1.5 / 8 }s;
    ` }
  }
`;

export default class LoadingAnimation extends Component {
  static defaultProps = {
    size: 90,
    className: ''
  };

  render() {
    const { size, className } = this.props;

    const spinnerStyle = {};

    if (size) {
      spinnerStyle.width = size;
      spinnerStyle.height = size;
    }

    return (
      <div className={ "flex w-full h-full justify-center items-center " + className }>
        <div
          className={"vpinsight__spinner relative rounded-full"}
          style={spinnerStyle}
        >
          <Dot size={ size } index="1"></Dot>
          <Dot size={ size } index="2"></Dot>
          <Dot size={ size } index="3"></Dot>
          <Dot size={ size } index="4"></Dot>
          <Dot size={ size } index="5"></Dot>
          <Dot size={ size } index="6"></Dot>
          <Dot size={ size } index="7"></Dot>
          <Dot size={ size } index="8"></Dot>
        </div>
      </div>
    );
  }
}
