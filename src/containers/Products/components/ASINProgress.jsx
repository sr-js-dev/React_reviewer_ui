import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobile } from '../../../redux/app/actions';

import '../../../scss/components/ASINProgress.scss';
import { getAsinsProgress, cancelAsinProgressPoll } from '../../../redux/products/actions';

export class ASINProgress extends Component {
  static propTypes = {
    mobile: PropTypes.bool,
    asinProgress: PropTypes.object
  }

  getAsinsProgress() {
    const { getAsinsProgress } = this.props;
    getAsinsProgress();
  }

  cancelAsinProgressPoll() {
    const { cancelAsinProgressPoll } = this.props;
    cancelAsinProgressPoll();
  }

  constructor() {
    super();

    this.container = React.createRef();
  }

  componentDidMount() {
    this.getAsinsProgress();
  }

  componentWillUnmount() {
    this.cancelAsinProgressPoll();
  }

  render() {
    if ( !this.props.asinProgress ) {
      return ``;
    }
    const { mobile } = this.props;
    const { asins_processing, processed_pct, asins_processed, total_asins } = this.props.asinProgress;

    const style = {
      maxHeight: asins_processing ? mobile ? 30 : 40 : 0,
      marginBottom: asins_processing ? mobile ? 15 : 10 : 0
    }

    const progressbarStyle = {
      maxWidth: `${ processed_pct }%`
    };

    const progressTextWhiteStyle = { width: this.container.current ? this.container.current.offsetWidth : 0 };

    const progressText = (<span><strong>{ asins_processed } / { total_asins } ASINs</strong> Processed…</span>);

    return (
      <section ref={ this.container } className="reviews__asin-progress-bar relative overflow-hidden w-full max-w-full-margin lg:max-w-full h-7 lg:h-10 mx-2.5 lg:mx-0 rounded-lg overflow-hidden bg-light-grey-blue-20 common-transition" style={ style }>

        {/* Blue part */}
        <section className="relative flex items-center justify-end bg-water-blue text-white w-full h-full overflow-hidden z-20 long-linear-transition" style={ progressbarStyle }>
          <section className="absolute pin-t pin-l flex items-center justify-center text-white w-full h-full text-xs lg:text-sm z-10" style={ progressTextWhiteStyle }>
            { progressText }
          </section>
          <section className="reviews__asin-progress-percentage relative text-white text-xs lg:text-sm font-bold px-1 lg:px-2.5 z-20">
            { processed_pct }%
          </section>
        </section>

        {/* Grey part */}
        <section className="absolute pin-t pin-l flex items-center justify-center w-full h-full text-dusk z-10 text-xs lg:text-sm">
          { progressText }
        </section>
      </section>
    )
  }
}

const mapStateToProps = (state) => ({
  mobile: isMobile( state.App.view ),
  asinProgress: state.Products.asinProgress
})

const mapDispatchToProps = { getAsinsProgress, cancelAsinProgressPoll }

export default connect(mapStateToProps, mapDispatchToProps)(ASINProgress);
