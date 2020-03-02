import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import Icon from "../Icon";
import { Modal } from "antd";


import ReviewColumn from "./ReviewColumn";
import { isMobile } from "../../../redux/app/actions";
import { hideModal } from "../../../redux/reviews/actions";
import MobileModal from "../MobileModal";

import { MODAL_CLOSE_CLASSNAME } from '../../../settings';

class ReviewModal extends PureComponent {
  static propTypes = {
    review: PropTypes.object,
    expanded: PropTypes.bool,
    modal: PropTypes.bool
  };

  handleClose = event => {
    const { hideModal } = this.props;
    hideModal();
  }

  render() {
    const { modalActive, modalReview, expanded, mobile } = this.props;

    return (<>
      { !mobile && (
        <Modal
          title={ null }
          footer={ null }
          visible={ modalActive }
          onOk={ this.handleClose }
          onCancel={ this.handleClose }
          closable={ false }
          centered={true}
          wrapClassName="reviews__review-modal-wrap"
          maskClosable={ true }
          maskStyle={ {
            backgroundColor: 'rgba( 0,0,0,0.82 )'
          } }
        >
          <>
          <ReviewColumn review={ modalReview } expanded={ expanded } modal={ false } closeOnUpdate/>
          <button onClick={this.handleClose} className={ MODAL_CLOSE_CLASSNAME }>
            <Icon name="cross" />
          </button>
          </>
        </Modal>
      ) }

      { (mobile && modalActive) &&
        <MobileModal
          active={ modalActive }
          onHide={ this.handleClose }
          theme={ "dark" }
          containerClass={ "flex flex-col px-2.5 pt-4 pb-32 justify-center" }
        >
          <ReviewColumn review={ modalReview } expanded={ expanded } modal={ false } closeOnUpdate mobile/>
        </MobileModal>
      }
    </>);
  }
}

const mapStateToProps = (state) => ({
  modalActive: state.Reviews.modalActive,
  modalReview: state.Reviews.modalReview,
  mobile: isMobile( state.App.view )
})

const mapDispatchToProps = {
  hideModal
}

export default connect(mapStateToProps, mapDispatchToProps)(ReviewModal);
