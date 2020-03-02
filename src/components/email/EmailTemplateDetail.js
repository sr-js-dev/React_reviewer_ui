import {withRouter} from 'react-router';
import React from 'react';
import BaseFormComponent from '../common/BaseFormComponent';
import EmailService from '../../services/EmailService';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {notify} from 'react-notify-toast';

class EmailTemplateDetail extends BaseFormComponent {
  constructor(props) {
    super(props);


    this.state = {
      template: null,
      editorState: EditorState.createEmpty()
    };

    this.onChange = (editorState) => this.setState({editorState});
    this.getTemplate = this.getTemplate.bind(this);
    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
  }

  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };

  componentDidMount() {
    this.getTemplate();
  }

  componentWillReceiveProps() {
  }

  cancel() {
    this.setState({
      edit: false
    });
  }

  save() {
    this.state.template.html_content = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
    EmailService.saveTemplate(this.state.template).then((res_data) => {
      if(res_data) {
        notify.show('Email template saved successfully.', "succrss");
        this.setState({
          loading: false,
          template: res_data
        });
      } else {
        this.setState({
          loading: false
        });
      }
    }).catch(error => {
      notify.show('Unable to save email template.', "error");
      this.setState({
        loading: false
      });
      console.log("error");
      console.log(error);
    });
  }

  getTemplate() {
    EmailService.getTemplate(this.props.match.params.id).then((res_data) => {
      if(res_data) {
        const contentBlock = htmlToDraft(res_data.html_content);
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks, contentBlock.entityMap);
          this.setState({
            editorState: EditorState.createWithContent(contentState)
          });
        }

        this.setState({
          loading: false,
          template: res_data
        });
      } else {
        this.setState({
          loading: false
        });
      }
    }).catch(error => {
      this.setState({
        loading: false
      });
      console.log("error");
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        {this.state.template && (
          <div className="ml-3 mr-3">
            <div className="mr-1 page-title">
              <div className="d-flex justify-content-between">
                <h2>{this.state.template.name}</h2>
                <Link to={`/emails`} className="btn btn-default"><FontAwesomeIcon icon={faChevronLeft} /> Email Templates</Link>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="mt-3 mr-1 w-100">
                <div>
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" className="form-control" name="name" value={this.state.template.name} onChange={(e) => {this.handleModelChange(e, this.state.template)}}/>
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input type="text" className="form-control" name="subject" value={this.state.template.subject} onChange={(e) => {this.handleModelChange(e, this.state.template)}}/>
                  </div>
                  <div className="form-group">
                    <label>HTML Content</label>
                    <div>
                      <Editor
                        editorState={this.state.editorState}
                        wrapperClassName="email-wrapper"
                        editorClassName="email-editor"
                        onEditorStateChange={this.onEditorStateChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-default form-control" onClick={() => {this.cancel()}}>Cancel</button>
                    <button className="btn btn-sm btn-primary form-control" onClick={() => {this.save()}}>Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(EmailTemplateDetail);
