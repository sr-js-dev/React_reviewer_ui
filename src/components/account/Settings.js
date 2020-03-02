import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Settings extends Component {

  render() {
    return (
      <div className="ml-3 mr-3">
        {this.props.user && (
          <div>
            <div className="mr-1 page-title">
              <div className="d-flex justify-content-between">
                <h2>Account Settings</h2>
              </div>
            </div>
            <div className="mt-3 mr-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Properties</h5>
                  {this.props.user ? this.props.user.properties.map((e, i) => {
                    return (
                      <div className="d-flex justify-content-between mt-3" key={i}>
                        <p className="listing-detail">
                          {e.street_address}<br/>
                        </p>
                        <Link to={`/settings/property/${e.id}`} className="btn btn-primary">Edit</Link>
                      </div>
                      );
                  }) : null }

                </div>
              </div>
            </div>

            <div className="mt-3 mr-1">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Settings</h5>
                  {this.props.user && this.props.user.settings && (
                    <div className="">
                      <p className="account-detail"><strong>Number of host properties (your properties):</strong>
                        {this.props.user.settings.allowed_properties}
                      </p>
                      <p className="account-detail"><strong>Number of properties nearby (competition):</strong>
                        {this.props.user.settings.allowed_nearby_listings}
                      </p>
                      {this.props.user.settings.seo_analysis && (
                        <p className="account-detail"><strong>SEO Analysis:</strong>
                          {String(this.props.user.settings.seo_analysis)}
                        </p>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Settings;
