import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sortableHandle } from 'react-sortable-hoc'
import { Input } from "antd"

import {
  updateSavedResponse,
  removeSavedResponse
} from '../../redux/app/actions';

import Icon from "./Icon";

const DragHandle = sortableHandle(() =>
  <div className="pin-t pin-r h-full flex w-5.5 items-center mr-2">
    <div className="cursor-pointer w-full">
      <div className="w-full h-2px bg-light-grey-blue-20 mb-2px"></div>
      <div className="w-full h-2px bg-light-grey-blue-20 mb-2px"></div>
      <div className="w-full h-2px bg-light-grey-blue-20 mb-2px"></div>
    </div>
  </div>
);

export class ExpandedResponse extends Component {
  state = {
    response_text: "",
    editEnabled: false
  }

  updateSavedResponse = event => {
    let { updateSavedResponse, response } = this.props;
    const { response_text } = this.state;
    response.response_text = response_text;
    updateSavedResponse( response );
    
    this.setState( { editEnabled: false } );
  }

  removeSavedResponse = event => {
    const { removeSavedResponse, response } = this.props;
    removeSavedResponse( response.id );
  }

  toggleEdit = event => {
    const { response } = this.props;

    this.setState( {
      editEnabled: !this.state.editEnabled,
      response_text: this.state.editEnabled ? response.response_text : this.state.response_text
    } );
  }

  constructor( props ) {
    super( props );

    this.textarea = React.createRef();
  }

  componentDidMount() {
    const { response } = this.props;

    this.setState({ response_text: response.response_text });
  }

  componentDidUpdate( prevProps, prevState ) {
    if ( this.state.editEnabled ) {
      this.textarea.current.focus();
    }
  }
  newResponseChange = event => {
    this.setState( {
      response_text: event.target.value
    } );
  }
  render() {
    const { sortIndex, response } = this.props;
    const { response_text, editEnabled } = this.state;

    return (
      <div className={ "reviews__saved-response-expanded relative w-full bg-white flex items-center cursor-pointer mb-3 rounded-lg shadow-vp-default " + ( editEnabled ? "reviews__saved-responses-edit" : "") }>
        <div className={ "flex flex-no-shrink items-center justify-center text-dusk-40 text-sm font-bold " + ( editEnabled ? "w-12" : "w-50px" ) } >
          { sortIndex + 1 }
        </div>

        { editEnabled &&
          <Input.TextArea
            autoSize={ { minRows: 1, maxRows: 6 } }
            value={ response_text }
            onChange={ this.newResponseChange }
            className="text-sm text-dusk font-medium px-0 py-5"
            placeholder="Type a response here"
            ref={ this.textarea }
          />
        }

        { !editEnabled && <div className="py-5 response_text">{response.response_text}</div> }

        {/* Buttons */}
        <div className={ "flex items-center " + ( editEnabled ? "mr-5.5 ml-3" : "mr-3 ml-3.5" ) }>
          { !editEnabled && <>
            <button
              onClick={ this.toggleEdit }
              className="w-6.5 h-6.5 leading-none bg-water-blue text-white text-xs hover:bg-water-blue-hover rounded-full shadow-vp-blue hover:shadow-vp-blue-active"
            >
              <Icon name="edit" />
            </button>

            <button
              onClick={ this.removeSavedResponse }
              className="w-6 h-6 leading-none bg-white text-light-grey-blue-50 text-xxs hover:text-light-grey-blue rounded-full mr-2 ml-3">
              <Icon name="cross" />
            </button>
          </> }

          { editEnabled && <>
            <button
              onClick={ this.updateSavedResponse }
              className="w-9 h-9 leading-none bg-water-blue text-white text-xs hover:bg-water-blue-hover rounded-full shadow-vp-blue hover:shadow-vp-blue-active"
            >
              <Icon name="check" />
            </button>

            <button
              onClick={ this.toggleEdit }
              className="w-6 h-6 leading-none bg-white text-light-grey-blue-50 text-xxs hover:text-light-grey-blue rounded-full mr-2 ml-2">
              <Icon name="cross" />
            </button>
          </> }
        </div>

        { !editEnabled && <DragHandle /> }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
  updateSavedResponse,
  removeSavedResponse
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpandedResponse)
