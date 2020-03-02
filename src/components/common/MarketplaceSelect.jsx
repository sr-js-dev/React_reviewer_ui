import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Select } from 'antd';

import { getMarketplaces } from '../../redux/app/actions';

import Icon from './Icon';

import '../../scss/components/MarketplaceSelect.scss';

export class MarketplaceSelect extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
    placeholderText: PropTypes.string,
    placeholderClass: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    shrink: PropTypes.bool
  }

  static defaultProps = {
    shrink: false,
    placeholderText: "Marketplace",
    placeholderClass: "w-full h-full flex text-xxs justify-center items-center leading-none uppercase font-bold"
  }

  state = {
    hovered: false,
    open: false
  }

  onMouseEnter = event => {
    this.setState({ hovered: true })
  }
  onMouseLeave = event => {
    this.setState({ hovered: false })
  }
  onDropdownVisibleChange = open => {
    this.setState({ open })
  }

  componentDidMount() {
    const { getMarketplaces } = this.props;
    getMarketplaces();
  }

  render() {
    const { marketplaces, value, defaultMarketplace, onChange, placeholderText, placeholderClass, shrink } = this.props;
    const { hovered, open } = this.state;

    const options = marketplaces && marketplaces.map( marketplace => {
      return <Select.Option key={ marketplace.code } className="reviews__marketplace-option flex items-center text-xs">
        {/* Marketplace flag */}
        <div className="reviews__flag mr-4 flex-no-shrink">
          <img
            src={`/images/Flags/${marketplace.code}.svg`}
            alt={`${marketplace.code} Amazon Marketplace`}
          />
        </div>

        <div className="reviews__marketplace-name">
          { marketplace.name }
        </div>
      </Select.Option>
    } );

    const placeholder = <div className={ placeholderClass }>
      <span>{ placeholderText }</span>

      <Icon name={ open ? "arrow-up" : "arrow-down" } class="text-xxs ml-2.5"/>
    </div>

    return (
      <div className={ "reviews__marketplace-select lg:mr-5 " + ( hovered ? "reviews__marketplace-select_hover" : "" ) + ( open ? "reviews__marketplace-select_open" : "" ) + ( shrink ? " " : " flex-no-shrink") }>
        <Select
          placeholder={ placeholder }
          showArrow={ true }
          dropdownClassName={ "reviews__marketplace-dropdown " }
          dropdownMatchSelectWidth={ false }
          dropdownAlign={
            {
              points: ['tr', 'br'],        // align top left point of sourceNode with top right point of targetNode
              offset: [0, 6],            // the offset sourceNode by 10px in x and 20px in y,
              targetOffset: [0,0], // the offset targetNode by 30% of targetNode width in x and 40% of targetNode height in y,
              overflow: { adjustX: true, adjustY: true }, // auto adjust position when sourceNode is overflowed
            }
          }
          onMouseEnter={ this.onMouseEnter }
          onMouseLeave={ this.onMouseLeave }
          onDropdownVisibleChange={ this.onDropdownVisibleChange }
          onChange={ onChange }
          value={ marketplaces.length === 0 ? undefined : value || defaultMarketplace }
        >
          { options }
        </Select>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  defaultMarketplace: state.App.defaultMarketplace,
  marketplaces: state.App.marketplaces
})

const mapDispatchToProps = {
  getMarketplaces
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketplaceSelect)
