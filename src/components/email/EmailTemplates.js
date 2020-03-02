import React, { Component } from 'react';
import HeaderSort from '../common/HeaderSort';
import EmailService from '../../services/EmailService';
import { Link } from 'react-router-dom';

class EmailTemplates extends Component {
  constructor(props) {
    super(props);

    this.state = {
      templates: null,
      stats: null,
      filterStates: {
        'sorts': {
          'Name': {
            'selected': false,
            'direction': 'asc',
            'col': 'p.name'
          }
        },
        'criteria': {
          'search': '',
          'property_id': null
        }
      }
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.runChannelFilter = this.runChannelFilter.bind(this);
    this.getTemplates = this.getTemplates.bind(this);
  }

  componentDidMount() {
    this.getTemplates(this.state.filterStates);
  }

  componentWillReceiveProps() {
    if(this.props.user) {
      this.getTemplates(this.state.filterStates);
    }
  }

  handleSearchChange(event) {
    var filters = this.state.filterStates;
    filters.criteria.search = event.target.value;

    this.setState(filters);
    this.getTemplates(this.state.filterStates);
  }

  runChannelFilter(channels = []) {
    var filters = this.state.filterStates;
    filters.criteria.channels = channels;

    this.setState(filters);
    this.getTemplates(this.state.filterStates);
  }

  getTemplates(filterStates = {}) {
    EmailService.getUserTemplates(filterStates).then((prop_data) => {
      if(prop_data) {
        this.setState({
          loading: false,
          templates: prop_data
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
      <div className="ml-3 mr-3">
        <div className="mr-1 page-title">
          <div className="d-flex justify-content-between">
            <h2>Email Templates</h2>
            <div className="d-flex justify-content-between">
              <div className="mr-3">
                <input type="text" placeholder="search..." className="form-control" value={this.state.filterStates.criteria.search} onChange={this.handleSearchChange}/>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div className="mt-3 mr-1 w-100">
            <div>
              {this.state.templates && this.state.templates.length > 0 && (
                <table className="table">
                  <thead>
                    <tr>
                      <HeaderSort className="vp-th" name="Name" updateTable={this.getTemplates} filterStates={this.state.filterStates}/>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.templates && this.state.templates.map(e => (
                      <tr key={e.id} className="vp-tr">
                        <td>
                          <div className="">
                            <span><Link to={`/emails/${e.id}`}>{e.name}</Link></span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {this.state.templates && this.state.templates.length <= 0 && (
                <h4>No email templates found</h4>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EmailTemplates;
