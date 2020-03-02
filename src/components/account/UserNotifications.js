import React, { Component } from 'react';
import moment from 'moment';

class Notifications extends Component {

  render() {
    return (
      <div className="ml-3 mr-3">
        {this.props.user && (
          <div>
            <div className="mr-1 page-title">
              <div className="d-flex justify-content-between">
                <h2>Notifications</h2>
                <button className="btn btn-sm btn-primary" onClick={() => {this.props.markRead()}}>Mark as Read</button>
              </div>
            </div>
            <div className="mt-3 mr-1">
              <table className="table">
                <thead>
                  <tr>
                    <th className="vp-th">Date</th>
                    <th className="vp-th">Notification</th>
                  </tr>
                </thead>
                <tbody>
                {this.props.user.user_notifications.map((e, i) => {
                  return (
                    <tr key={e.id} className="vp-tr">
                      {e.viewed === true && (
                        <td>
                          {moment(e.created_at).format('MM-DD-YYYY hh:mm')}
                        </td>
                      )}
                      {e.viewed === true && (
                        <td className="">
                          {e.message}
                        </td>
                      )}

                      {e.viewed === false && (
                        <td>
                          <strong>{moment(e.created_at).format('MM-DD-YYYY hh:mm')}</strong>
                        </td>
                      )}
                      {e.viewed === false && (
                        <td className="">
                          <strong>{e.message}</strong>
                        </td>
                      )}
                    </tr>
                    );
                })}
                </tbody>
              </table>
            </div>

          </div>
        )}
      </div>
    );
  }
}

export default Notifications;
