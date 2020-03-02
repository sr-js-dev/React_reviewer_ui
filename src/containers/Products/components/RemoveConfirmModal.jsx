import React, { Component } from "react";
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import { Modal } from 'antd';
import FreePlanIcon from "../../../components/common/FreePlanIcon";
import Icon from "../../../components/common/Icon";

import { MODAL_CLOSE_CLASSNAME } from '../../../settings';

class RemoveConfirmModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func
  };

  handleClose = event => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const { visible, onConfirm, onCancel, selectedProducts } = this.props;

    const mobile = false;

    const content = (
      <div className="text-uppercase z-10 flex flex-col justify-center items-center w-full px-10 py-9">
        <FreePlanIcon name="cross" />

        <div className="text-2.5xl text-slate font-bold mt-6 mb-4 text-center">
          Delete Selected
        </div>

        <div className="text-sm text-slate opacity-60 mb-8 text-center leading-tight">
          Are you sure you want to delete<br/>
          {selectedProducts.length} selected {selectedProducts.length > 1 ? 'products' : 'product'}?
        </div>

        <div className={"flex w-full mt-1 " + (mobile ? "flex-col-reverse" : "justify-between")}>
          <button
            className={
              "font-bold uppercase text-light-grey-blue min-w-32 bg-comments-grey rounded-lg px-7 h-11 text-xs " +
              (!mobile ? "" : "mt-2.5")
            }
            onClick={onCancel}
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className={
              "flex justify-center min-w-32 text-xs items-center font-bold uppercase text-white hover:text-white bg-coral-pink hover:bg-coral-pink-hover rounded-lg px-7 h-11 shadow-vp-red hover:shadow-vp-red-active " +
              (!mobile ? "" : "")
            }
          >
            Delete - { selectedProducts.length }
          </button>
        </div>
      </div>
    );

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
        <>
        {content}
        <button onClick={this.handleClose} className={ MODAL_CLOSE_CLASSNAME }>
          <Icon name="cross" />
        </button>
        </>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedProducts: state.Products.selectedProducts,
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(RemoveConfirmModal)