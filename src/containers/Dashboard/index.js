import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CardsPanel, RecentCritical, RecentComments } from './components';

export class Dashboard extends Component {
  render() {
    return (
      <>
        <CardsPanel />
        <RecentCritical />
        <RecentComments />
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.Auth.currentUser,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
