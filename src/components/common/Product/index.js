import React, { Component } from 'react';
import PropTypes from 'prop-types';

import '../../../scss/components/Review.scss';

import ProductInside from './ProductInside';

export default class Product extends Component {
  static propTypes = {
    product: PropTypes.object.isRequired,
    selected: PropTypes.bool,
    expanded: PropTypes.bool,
    onSelect: PropTypes.func,
    mobile: PropTypes.bool,
  };

  state = {
    modalVisible: false,
    childrenExpanded: false,
  };

  openModal = event => {
    this.setState({ modalVisible: true });
  };

  hideModal = event => {
    this.setState({ modalVisible: false });
  };

  /**
   * Called from ProductInside for expanding
   * the list of child products
   *
   * @param {object} event - click event
   */
  onExpand = event => {
    this.setState({ childrenExpanded: !this.state.childrenExpanded });
  };

  render() {
    const { product, selected, onSelect, selectActive, mobile } = this.props;
    const { childrenExpanded } = this.state;

    const childProducts =
      product.child_products &&
      product.child_products.map(child_product => (
        <ProductInside
          product={child_product}
          child={true}
          key={child_product.id}
          expanded={childrenExpanded}
        />
      ));

    const childProductsContainerStyle = {
      maxHeight: childrenExpanded ? product.child_products.length * 61 : 0,
    };

    return (
      <>
        <ProductInside
          product={product}
          onExpand={this.onExpand}
          expanded={childrenExpanded}
          selectActive={selectActive}
          selected={selected}
          onSelect={onSelect}
          mobile={mobile}
        />

        {!mobile && (
          <div
            className={
              'reviews__child-products ' +
              (childrenExpanded ? '' : 'overflow-hidden')
            }
            style={childProductsContainerStyle}
          >
            {childProducts}
          </div>
        )}
      </>
    );
  }
}
