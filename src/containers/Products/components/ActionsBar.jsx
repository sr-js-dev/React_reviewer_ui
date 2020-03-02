import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

// import { showTagModal } from '../../../redux/app/actions';
import { removeProducts, selectItem } from '../../../redux/products/actions';

import Icon from '../../../components/common/Icon';
import RemoveConfirmModal from './RemoveConfirmModal';
import TagModal from './TagModal';
import ProductsService from '../../../services/ProductsService';
import { isMobile, EXTENDED_MOBILE } from '../../../redux/app/actions';

export class ActionsBar extends Component {

  state = {
    removeModalVisible: false,
    tagModalVisible: false,
    allSelected: false,
  }

  selectAll = async ( event ) => {
    const { selectItem } = this.props;
    const { allSelected } = this.state;

    let availableIDs = "remove";

    if ( !allSelected ) {
      availableIDs = await ProductsService.select_all();
    }

    selectItem( availableIDs );

    this.setState( { allSelected: !allSelected })
  }

  showTagModal = event => {
    this.setState({
      tagModalVisible: true
    });
  }

  onTagCancel = event => {
    this.setState({
      tagModalVisible: false
    });
  }

  onTagConfirm = () => {
    this.onTagCancel();
  }

  showRemoveModal = event => {
    this.setState({
      removeModalVisible: true
    });
  }

  onRemoveCancel = event => {
    this.setState({
      removeModalVisible: false
    });
  }

  onRemoveConfirm = event => {
    const { removeProducts, selectedProducts } = this.props;
    removeProducts( selectedProducts );
    this.onRemoveCancel();
  }

  /**
   * Only show "manage tags" button
   */
  showTagButton = () => {
    const { products, selectedProducts } = this.props;

    //  Select all tags by product.id
    const selectedTags = _.map( _.filter( products, p => { return selectedProducts.includes( p.id ) } ), p => {
      return _.map( p.tags, 'id' );
    } );
    //  It only make sense to compare to a first set
    const firstSet = _.sortBy( selectedTags[0] );
    //  All products should have identical set of tags
    //  for button to show up
    return _.every( selectedTags, tags => {
      return _.isEqual( firstSet, _.sortBy( tags ) );
    } );
  }

  shouldComponentUpdate( prevProps, prevState ) {
    const { selectedProducts } = this.props;
    const { selectedProducts: prevSelectedProducts } = prevProps;

    if ( !_.isEqual( selectedProducts, prevSelectedProducts ) ) {
      return true;
    }

    if ( !_.isEqual( this.state, prevState ) ) {
      return true;
    }

    if ( this.props.mobile !== prevProps.mobile ) {
      return true;
    }

    return false;
  }

  componentDidUpdate( prevProps ) {
    if ( this.props.mobile !== prevProps.mobile && this.props.mobile ) {
      this.props.selectItem( 'remove' );
    }
  }

  render() {
    const { selectActive, selectedProducts } = this.props;
    const { removeModalVisible, tagModalVisible, allSelected } = this.state;

    const classes = {
      container: "reviews__reviews-select-bar z-10 overflow-hidden common-transition px-5 h-50px flex justify-between items-center bg-comments-grey " + ( selectActive ? "max-h-50px" : "max-h-0" ),
      checkbox: "w-7 overflow-hidden flex items-center",
      button: "uppercase h-7 ml-2.5 px-4 flex items-center rounded font-bold text-xxs text-white font-bold flex-no-shrink focus:outline-none"
    };

    this.showTagButton();

    return (
      <>
        <RemoveConfirmModal visible={ removeModalVisible } onCancel={ this.onRemoveCancel } onConfirm={ this.onRemoveConfirm }/>
        <TagModal visible={ tagModalVisible } onCancel={ this.onTagCancel } onConfirm={ this.onTagConfirm }/>

        <section className={ classes.container }>
          <section className="flex items-center">
            <section className={ classes.checkbox } onClick={ this.selectAll }>
              <div className={ "flex items-center justify-center rounded border w-4 h-4 text-xxs text-white " + ( allSelected ? "border-water-blue bg-water-blue" : "bg-white" ) }>
                <Icon name="check" class="-mt-px" />
              </div>
            </section>

            <div className="text-xxs font-bold text-dusk uppercase leading-none">
              { selectedProducts.length } Selected
            </div>
          </section>

          <section className="flex items-center">
            <button className={ classes.button + " bg-water-blue hover:bg-water-blue-hover" } onClick={ this.showTagModal }>
              <Icon name="tag" class=""/>
              <span>MANAGE TAGS</span>
            </button>

            <button className={ classes.button + " bg-coral-pink hover:bg-coral-pink-hover" } onClick={ this.showRemoveModal }>
              <Icon name="cross" class="text-xxs mr-2"/>
              <span>DELETE SELECTED</span>
            </button>
          </section>
        </section>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  products: state.Products.products,
  uniqueProductIDs: _.map( _.uniqBy( state.Products.products, 'id' ), 'id' ),
  selectedProducts: state.Products.selectedProducts,
  selectActive: state.Products.selectActive,
  mobile: isMobile( state.App.view, EXTENDED_MOBILE )
})

const mapDispatchToProps = {
  // showTagModal,
  selectItem,
  removeProducts
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionsBar)
