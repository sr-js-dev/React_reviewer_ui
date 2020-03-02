import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import IntlMessages from '../../components/utility/intlMessages';
import Spin from "../uielements/spin";

import "../../scss/components/SmallBarChart.scss";

export class SmallBarChart extends Component {
    static propTypes = {
        label1: PropTypes.string,
        label2: PropTypes.string,
        total: PropTypes.number,
        datasets: PropTypes.array
    }

    chartJSPlaceholder = {
        labels: [ "" ],
        datasets: [
            {
                label: " ",
                data: [ 824 ]
            },
            {
                label: " ",
                data: [ 206 ]
            }
        ]
    }

    render() {
        const { loading, label1, label2, datasets, prefix, total } = this.props;
        const barClass = "h-2.5 ";

        const fullWidth = ( datasets ? datasets[0].data[0] + datasets[1].data[0] : 0 );

        let blueBarWidth, redBarWidth;

        if ( total ) {
            blueBarWidth = (datasets ? Math.round( datasets[0].data[0] / total * 100 ) : 0 );
            redBarWidth = (datasets ? Math.round( datasets[1].data[0] / total * 100 ) : 0 );
        } else {
            blueBarWidth = ( datasets ? Math.round( datasets[0].data[0] / fullWidth * 100 ) : 0 );
            redBarWidth = ( datasets ? Math.floor( datasets[1].data[0] / fullWidth * 100 ) : 0 );

            if ( blueBarWidth === 0 && redBarWidth === 0 ) {
                blueBarWidth = 50;
                redBarWidth = 50;
            }
        }

        const blueBarContainerStyle = {
            width: `calc( 50% - 5px )`,
            borderTopLeftRadius: "2px",
            borderBottomLeftRadius: "2px",
        }

        const redBarContainerStyle = {
            width: `calc( 50% - 5px )`,
            borderTopRightRadius: "2px",
            borderBottomRightRadius: "2px",
        }

        const blueBarStyle = {
            background: "linear-gradient( -90deg, #2784E9, #0E4DC5 )",
            width: `${ total ? `${ blueBarWidth }%` : `calc( ${ blueBarWidth }% - 5px )` }`,
            borderTopLeftRadius: "2px",
            borderBottomLeftRadius: "2px",
        };

        const redBarStyle = {
            background: "linear-gradient( -90deg, #FA5F33, #FBDC4F )",
            width: `${ total ? `${ redBarWidth }%` : `calc( ${ redBarWidth }% - 5px )` }`,
            borderTopRightRadius: "2px",
            borderBottomRightRadius: "2px",
        }


        return (
            <section className="relative overflow-hidden rounded-lg bg-white shadow-vp-default w-full h-full p-3.5 flex flex-col">
                <Spin spinning={ loading }>
                    <>
                        {/* Numbers */}
                        <section className="flex w-full justify-between items-center font-bold leading-none">
                            {/* First dataset number */}
                            <span className="text-xl text-slate">
                                {( datasets ? (
                                    <>
                                        { prefix || "" }{ datasets[0].data[0] }

                                        { total && (
                                            <small className="text-sm text-light-grey-blue"> /{ total }</small>
                                        )}
                                    </>
                                ) : "Loading..." )}
                            </span>

                            {/* Second dataset number */}
                            <span className="text-lg text-light-grey-blue">
                                {( datasets ? `${ prefix || "" }${ datasets[1].data[0] }` : "" )}

                                { total && (
                                    <small className="text-xxs text-light-grey-blue"> /{ total }</small>
                                )}
                            </span>
                        </section>

                        {/* Bars */}
                        <section className="w-full my-1 flex items-center">
                            {/* First dataset bar */}
                            { total && (<div className={ barClass + "flex justify-end relative overflow-hidden bg-ice-blue" } style={ blueBarContainerStyle }>
                                <div className={ barClass } style={ blueBarStyle }></div>
                            </div>)}

                            { !total && (<div className={ barClass } style={ blueBarStyle }></div>) }


                            {/* Separator */}
                            <div className="vpinsight__small-bar-separator"></div>

                            {/* Second dataset bar */}
                            { total && (<div className={ barClass + "flex justify-start relative overflow-hidden bg-ice-blue" } style={ redBarContainerStyle }>
                                <div className={ barClass } style={ redBarStyle }></div>
                            </div>)}

                            { !total && (<div className={ barClass } style={ redBarStyle }></div>) }

                        </section>

                        {/*  Labels */}
                        <section className="flex w-full justify-between items-center font-bold leading-none">
                            <span className="text-xxs text-slate font-bold">
                                <IntlMessages id={ label1 } />
                            </span>

                            <span className="text-xxs text-light-grey-blue font-semibold">
                                <IntlMessages id={ label2 } />
                            </span>
                        </section>
                    </>
                </Spin>
            </section>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(SmallBarChart)

