import React, { Component } from "react";
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import { Modal } from 'antd';
import Icon from "../../../components/common/Icon";

import TagsInput from './TagsInput';

import '../../../scss/Products/TagModal.scss';
import { isMobile } from "../../../redux/app/actions";

import { MODAL_CLOSE_CLASSNAME } from '../../../settings';

class TagModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func
  };

  handleClose = event => {
    const { onCancel } = this.props;
    this.inputComponent.current.clear();
    onCancel();
  };

  updateTags = event => {
    return this.inputComponent.current.update()
      .then( data => {
        this.handleClose();
      } );
  }

  constructor( props ) {
    super( props );

    this.inputComponent = React.createRef();
  }

  render() {
    const { mobile, visible, selectedProducts } = this.props;

    const inside = (<>
      <TagsInput
        active={ visible }
        mobile={ mobile }
        selectedProducts={ selectedProducts }
        ref={ this.inputComponent }
        scrollbar={ true }
      />

      <div className={"flex w-full p-5 bg-white border-t " + (mobile ? "flex-col-reverse" : "justify-between")}>
        <button
          className={
            "font-bold uppercase text-light-grey-blue min-w-32 bg-comments-grey rounded-lg px-7 h-11 text-xs " +
            (!mobile ? "" : "mt-2.5")
          }
          onClick={ this.handleClose }
        >
          CANCEL
        </button>
        <button
          onClick={ this.updateTags }
          className={
            "flex justify-center min-w-32 text-xs items-center font-bold uppercase text-white hover:text-white bg-water-blue hover:bg-water-blue-hover rounded-lg px-7 h-11 shadow-vp-blue hover:shadow-vp-blue-active " +
            (!mobile ? "" : "")
          }
        >
          Done
        </button>
      </div>
    </>);

    const content = (<>
      <div className="reviews__tag-modal text-uppercase z-10 flex flex-col w-full overflow-hidden rounded-lg">
        { inside }
      </div>

      <button
        onClick={ this.handleClose }
        className={ MODAL_CLOSE_CLASSNAME }
      >
        <Icon name="cross" />
      </button>
    </>);

    return (
      <Modal
        title={null}
        footer={null}
        width={380}
        visible={visible}
        onOk={this.handleClose}
        onCancel={this.handleClose}
        closable={false}
        centered={true}
        wrapClassName="reviews__review-modal-wrap"
        maskStyle={{
          backgroundColor: "rgba( 0,0,0,0.82 )"
        }}
      >
        {content}
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  mobile: isMobile( state.App.view ),
  selectedProducts: state.Products.selectedProducts,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(TagModal)
