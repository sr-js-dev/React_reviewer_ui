import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "../../scss/components/Circle.scss";

/**
 * I will make this an NPM component and then replace this code with a dependency
 */
export default class Circle extends Component {
    static propTypes = {
        color: PropTypes.string,
		percentage: PropTypes.number,
		id: PropTypes.string
	}

	getGradientOpacity = ( percentage ) => {
		return percentage / 100;
	}

	getGradientRotation = ( percentage ) => {
		let offset = 5;

		if ( percentage > 98 ) {
			offset = 0;
		}

		return `${ 360 * ( percentage / 100 ) + offset }deg`;
	}

	gradientStyle = () => {
		const { percentage } = this.props;

		const rotation = this.getGradientRotation( percentage );
		const opacity = this.getGradientOpacity( percentage );

		return {
			transform: `rotate( ${ rotation } )`,
			opacity
		}
	}

    render() {
		const { width, stroke, background, className, percentage, id } = this.props;

		const strokeWidth = width;
		const strokeDasharray = `${ percentage },100`;

		const viewboxSize = 35.83098862;
		const viewBox = [ 0, 0, viewboxSize, viewboxSize ].join( " " );

		const mainCircleOptions = {
			fill: "none",
			cx: viewboxSize / 2,
			cy: viewboxSize / 2,
			r: ( viewboxSize / 2 ) - ( strokeWidth / 2 )
		}

		const patternOptions = {
			x: 0,
			y: 0,
			height: viewboxSize,
			width: viewboxSize,
		}

		const gradientMaskOptions = {
			...mainCircleOptions,
			style: { stroke: "#fff" },
			stroke: "#fff",
			strokeWidth,
			strokeDasharray,
			strokeLinecap: "round"
		}

		const backgroundOptions = {
			...mainCircleOptions,
			stroke: background,
			strokeWidth,
		}

		const highlightOptions = {
			...mainCircleOptions,
			stroke,
			strokeWidth,
			strokeDasharray,
			strokeLinecap: "round",
		}

		const gradientCircleOptions = {
			mask: "url(#highlight-" + id + ")",
			fill: "url(#round-gradient-" + id + ")",
			cx: mainCircleOptions.cx,
			cy: mainCircleOptions.cy,
			r: 18.5,
			style: this.gradientStyle()
		}

        return (
            <section className={ "circle__section " + className }>
				<svg className="circle__circle" viewBox={ viewBox } xmlns="http://www.w3.org/2000/svg">
					<defs>
						<pattern
							id={ "round-gradient-" + id }
							patternUnits="userSpaceOnUse"
							{ ...patternOptions }
						>
							<image
								className="circle__gradient-image"
								xlinkHref="https://storage.googleapis.com/wavescore/img/icons/wave-stats/round-gradient.png"
								style={ this.gradientStyle() }
								{ ...patternOptions }
							/>
						</pattern>

						<mask id={ "highlight-" + id }>
							<circle className="circle__highlight" { ...gradientMaskOptions } />
						</mask>
					</defs>
					<circle className="circle__background" { ...backgroundOptions } />
					<circle className="circle__highlight" { ...highlightOptions } />
					<circle className="circle__gradient" { ...gradientCircleOptions }/>
				</svg>
			</section>
        );
    }
}
