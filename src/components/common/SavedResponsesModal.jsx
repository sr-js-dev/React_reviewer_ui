import React, { Component } from "react";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import {sortableContainer, sortableElement} from 'react-sortable-hoc';
import _ from "lodash";
import { Modal, Input } from "antd";
import arrayMove from 'array-move';

import Icon from "./Icon";

import {
  getSavedResponses,
  addSavedResponse,
  updateSavedResponsesOrder,
  showSavedResponsesModal,
  hideSavedResponsesModal
} from "../../redux/app/actions";

import "../../scss/components/SavedResponsesDropDown.scss";
import ExpandedResponse from "./ExpandedResponse";

const Response = sortableElement(({response, sortIndex}) => <ExpandedResponse response={ response } sortIndex={ sortIndex } />);

const ResponsesContainer = sortableContainer(({ responses }) => (
  <PerfectScrollbar className="bg-light-grey-blue-10 p-7 flex-grow " >
    { responses.map( ( response, index ) => <Response response={response} key={ 'response-' + response.id } index={ index } sortIndex={ index } />) }
  </PerfectScrollbar>
) );

export class SavedResponsesModal extends Component {
  state = {
    newResponseText: "",
    createEnabled: false,
    savedResponses: []
  };

  addSavedResponse = () => {
    const { addSavedResponse } = this.props;
    const { newResponseText } = this.state;

    addSavedResponse( newResponseText );
    this.setState({ newResponseText: '' });
    this.toggleAdd();
  }

  newResponseChange = event => {
    this.setState( {
      newResponseText: event.target.value
    } );
  }

  hide = event => {
    const { hideSavedResponsesModal } = this.props;
    hideSavedResponsesModal();
  }

  toggleAdd = event => {
    this.setState( { createEnabled: !this.state.createEnabled })
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      savedResponses: arrayMove( this.state.savedResponses, oldIndex, newIndex),
    }, () => {
      const updatedOrders = this.state.savedResponses;
      updatedOrders.map((res, idx) => {
        return res.order = idx+1;
      })
      this.setState({ savedResponses: updatedOrders});
    });
  }

  constructor( props ) {
    super( props );

    this.textarea = React.createRef();
  }

  componentDidMount() {
    const { getSavedResponses } = this.props;
    getSavedResponses();
  }

  componentDidUpdate( prevProps, prevState ) {
    const { savedResponses, updateSavedResponsesOrder, savedResponsesModalVisible } = this.props;

    if ( this.state.createEnabled ) {
      this.textarea.current.focus();
    }

    if (savedResponsesModalVisible && !_.isEqual( prevState.savedResponses, this.state.savedResponses ) ) {
      updateSavedResponsesOrder( { savedResponses: this.state.savedResponses } );
      return;
    }

    if ( !_.isEqual( prevProps.savedResponses, savedResponses ) ) {
      this.setState( { savedResponses } );
    }
  }

  render() {
    const { savedResponsesModalVisible } = this.props;
    const { newResponseText, createEnabled, savedResponses } = this.state;

    return (
      <Modal
        title={ null }
        footer={ null }
        closable={ false }
        onCancel={ this.hide }
        visible={ savedResponsesModalVisible }
        width={ 580 }
        wrapClassName={ "reviews__transparent-antd-modal" }
      >
        <>
          <div className="reviews__saved-responses-modal bg-white rounded-lg flex flex-col overflow-hidden">
            <section className="flex w-full bg-white p-7 flex-no-shrink">
              { !createEnabled && (
                <button
                  onClick={ this.toggleAdd }
                  className="flex justify-center items-center text-base text-water-blue font-semibold bg-water-blue-10 hover:bg-water-blue-20 rounded-lg w-full h-17.5 leading-none "
                >
                  <div className="flex h-6 w-6 rounded-full bg-water-blue items-center justify-center mr-3">
                    <Icon name="add" class="text-white text-xs "/>
                  </div>
                  <span>Create new response</span>
                </button>
              ) }

              { createEnabled && (
                <div className="reviews__saved-responses-edit flex items-center rounded-lg w-full min-h-17.5">
                  <Input.TextArea
                    autoFocus
                    autoSize={ { minRows: 1, maxRows: 6 } }
                    value={ newResponseText }
                    onChange={ this.newResponseChange }
                    className="text-sm text-dusk font-medium p-3.5"
                    placeholder="Type a response here"
                    ref={ this.textarea }
                  />

                  {/* Buttons */}
                  <div className="flex items-center mx-3.5">
                    <button
                      onClick={ this.addSavedResponse }
                      className="w-9 h-9 leading-none bg-water-blue text-white text-base hover:bg-water-blue-hover rounded-full shadow-vp-blue hover:shadow-vp-blue-active"
                    >
                      <Icon name="check" />
                    </button>

                    <button
                      onClick={ this.toggleAdd }
                      className="w-6 h-6 leading-none bg-white text-light-grey-blue-50 text-xxs hover:text-light-grey-blue rounded-full mr-2 ml-3"
                    >
                      <Icon name="cross" />
                    </button>
                  </div>
                </div>
              ) }
            </section>

            <ResponsesContainer responses={ savedResponses } onSortEnd={this.onSortEnd} useDragHandle />
          </div>

          <button
            onClick={ this.hide }
            className="leading-normal block reviews__modal-close absolute pin-r pin-t w-9 h-9 bg-black-50 text-white text-xs -mt-5 -mr-4 rounded-full flex justify-center items-center"
          >
            <Icon name="cross" />
          </button>
        </>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  savedResponses: state.App.savedResponses,
  savedResponsesModalVisible: state.App.savedResponsesModalVisible
});

const mapDispatchToProps = {
  getSavedResponses,
  addSavedResponse,
  updateSavedResponsesOrder,
  showSavedResponsesModal,
  hideSavedResponsesModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavedResponsesModal);
