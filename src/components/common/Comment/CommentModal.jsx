import React, { PureComponent } from "react";
import { connect } from 'react-redux';
import PropTypes from "prop-types";

import Icon from "../Icon";
import { Modal } from "antd";
import CommentColumn from "./CommentColumn";
import MobileModal from "../MobileModal";

import { isMobile } from "../../../redux/app/actions";
import { hideModal } from "../../../redux/comments/actions";

import { MODAL_CLOSE_CLASSNAME } from '../../../settings';

class CommentModal extends PureComponent {
  static propTypes = {
    comment: PropTypes.object,
    expanded: PropTypes.bool,
    visible: PropTypes.bool,
  };

  handleClose = event => {
    const { hideModal } = this.props;
    hideModal();
  }

  updateAndClose = () => {
    const { hideModal } = this.props;

    this.update();
    hideModal();
  }

  render() {
    const { mobile, modalActive, modalComment } = this.props;

    return (<>
      { !mobile &&
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
            <CommentColumn comment={ modalComment } modal={ false } />
            <button onClick={this.handleClose} className={ MODAL_CLOSE_CLASSNAME }>
              <Icon name="cross" />
            </button>
          </>
        </Modal>
      }

      { (mobile && modalActive) &&
        <MobileModal
          active={ modalActive }
          onHide={ this.handleClose }
          theme={ "dark" }
          containerClass={ "flex flex-col px-2.5 pt-4 pb-32 justify-center" }
        >
          <CommentColumn comment={ modalComment } modal={ false } mobile />
        </MobileModal>
      }
    </>);
  }
}

const mapStateToProps = (state) => ({
  modalActive: state.Comments.modalActive,
  modalComment: state.Comments.modalComment,
  mobile: isMobile( state.App.view )
})

const mapDispatchToProps = {
  hideModal
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentModal);
