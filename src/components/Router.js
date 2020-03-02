import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Auth0Context } from './utility/Auth0Wrapper';

//  New Pages
import {
  Dashboard,
  Reviews,
  Comments,
  Products,
  Settings,
  Landing,
  NotFound,
} from '../containers';

const RestrictedRoute = ({
  component: Component,
  isAuthenticated,
  code,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated !== false || code ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);

class Router extends React.Component {
  static contextType = Auth0Context;

  render() {
    const { history } = this.props;
    const { isAuthenticated } = this.context;

    const restrictedRouteOptions = {
      isAuthenticated,
      code: window.location.search.includes('code='),
    };

    return (
      <Switch>
        {/* Index page is Dashboard */}
        <Route
          exact
          path="/"
          render={() => {
            if (isAuthenticated) {
              return <Redirect to={{ pathname: '/dashboard' }} />;
            }
            return <Landing callback={this.getCurrentUser} history={history} />;
          }}
        />

        <Route exact path="/dashboard" component={Dashboard} />

        <Route exact path="/reviews" component={Reviews} />

        <Route exact path="/comments" component={Comments} />

        <Route exact path="/products" component={Products} />

        <RestrictedRoute
          {...restrictedRouteOptions}
          exact
          path="/settings"
          component={Settings}
        />
        <Route path="*" component={NotFound} />
      </Switch>
    );
  }
}

export default connect(state => ({}))(Router);
