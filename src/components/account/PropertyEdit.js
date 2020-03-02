import { withRouter } from 'react-router';
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faChevronLeft from '@fortawesome/';
import { Link } from 'react-router-dom';
import PropertyService from '../../services/PropertyService';
import ReactLoading from 'react-loading';
import BaseFormComponent from '../common/BaseFormComponent';
import { notify } from 'react-notify-toast';

class PropertyEdit extends BaseFormComponent {
  constructor(props) {
    super(props);

    this.state = {
      property: null,
      airbnb_identifier: '',
      vrbo_identifier: '',
      city: '',
      state: '',
    };

    this.getProperty = this.getProperty.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.getProperty();
  }

  componentWillReceiveProps(nextProps) {
    this.getProperty();
  }

  handleSave() {
    this.setState({ loading: true });
    PropertyService.updateProperty(this.state.property, this.state)
      .then(p => {
        console.log(p);
        notify.show('Property Saved', 'success');
        this.setState({
          loading: false,
          property: p,
        });
      })
      .catch(error => {
        notify.show('An error occurred saving this property', 'error');
        console.log('error');
        console.log(error);
      });
  }

  getProperty() {
    this.setState({ loading: true });
    PropertyService.getUserProperty(this.props.match.params.id)
      .then(p => {
        console.log(p);
        this.setState({
          loading: false,
          property: p,
          airbnb_identifier: p.airbnb_listing
            ? p.airbnb_listing.internal_identifier
            : '',
          vrbo_identifier: p.vrbo_listing
            ? p.vrbo_listing.internal_identifier
            : '',
          city: p.place ? p.place.place_name : '',
          state: p.place ? p.place.country_subdivision : '',
        });
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  }

  render() {
    return (
      <div className="ml-3 mr-3">
        {this.state.loading && (
          <div className="loading m-auto">
            <ReactLoading
              type="spokes"
              color="#4D5061"
              height="50"
              width="50"
            />
          </div>
        )}
        {this.state.property && (
          <div>
            <div className="mr-1 page-title">
              <div className="d-flex justify-content-between">
                <h2>Edit Property</h2>
                <Link to={`/settings`} className="btn btn-default">
                  <FontAwesomeIcon icon={faChevronLeft} /> Settings
                </Link>
              </div>
            </div>
            <div className="mt-3 mr-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Info</h5>
                  <div className="form-row mt-4">
                    <div className="col-sm-12 pb-3">
                      <label>Street</label>
                      <input
                        type="text"
                        className="form-control"
                        name="street_address"
                        value={this.state.property.street_address}
                        onChange={e => {
                          this.handleModelChange(e, this.state.property);
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="col-sm-6 pb-3">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control"
                        name="city"
                        value={this.state.city}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="col-sm-3 pb-3">
                      <label>State</label>
                      <input
                        type="text"
                        className="form-control"
                        name="state"
                        value={this.state.state}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="col-sm-3 pb-3">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        className="form-control"
                        name="postal_code"
                        value={this.state.property.postal_code}
                        onChange={e => {
                          this.handleModelChange(e, this.state.property);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="mt-3 mr-1 w-50">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">AirBnb Listing</h5>
                    <div className="form-row mt-4">
                      {this.state.property.airbnb_listing && (
                        <div className="col-sm-3 pb-3">
                          <label>Listing ID</label>
                          <input
                            type="text"
                            className="form-control"
                            name="internal_identifier"
                            value={
                              this.state.property.airbnb_listing
                                .internal_identifier
                            }
                            onChange={ev => {
                              this.handleModelChange(
                                ev,
                                this.state.property.airbnb_listing
                              );
                            }}
                          />
                        </div>
                      )}
                      {!this.state.property.airbnb_listing && (
                        <div className="col-sm-3 pb-3">
                          <label>Listing ID</label>
                          <input
                            type="text"
                            name="airbnb_identifier"
                            value={this.state.airbnb_identifier}
                            autoFocus=""
                            className="form-control"
                            required
                            onChange={this.handleChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 mr-1 w-50">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">VRBO Listing</h5>
                    <div className="form-row mt-4">
                      {this.state.property.vrbo_listing && (
                        <div className="col-sm-3 pb-3">
                          <label>Listing ID</label>
                          <input
                            type="text"
                            className="form-control"
                            name="internal_identifier"
                            value={
                              this.state.property.vrbo_listing
                                .internal_identifier
                            }
                            onChange={ev => {
                              this.handleModelChange(
                                ev,
                                this.state.property.vrbo_listing
                              );
                            }}
                          />
                        </div>
                      )}
                      {!this.state.property.vrbo_listing && (
                        <div className="col-sm-3 pb-3">
                          <label>Listing ID</label>
                          <input
                            type="text"
                            name="vrbo_identifier"
                            value={this.state.vrbo_identifier}
                            autoFocus=""
                            className="form-control"
                            required
                            onChange={this.handleChange}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 mr-1">
              <div className="card-body">
                <div className="text-center">
                  <button
                    className="btn btn-lg btn-primary"
                    type="submit"
                    onClick={() => {
                      this.handleSave();
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(PropertyEdit);
