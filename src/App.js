import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { IntlProvider } from 'react-intl';
import config, {
  getCurrentLanguage,
} from './containers/LanguageSwitcher/config';
import AppLocale from './languageProvider';

import Boot from './redux/boot';
import auth0config from './settings/auth0';

//  Components
import Main from './components/Main';
import { Auth0Provider } from './components/utility/Auth0Wrapper';
//  Styles
import 'antd/dist/antd.css';
import 'slick-carousel/slick/slick.scss';
import 'slick-carousel/slick/slick-theme.scss';

import './scss/App.scss';
import './scss/theme.scss';

import 'perfect-scrollbar/css/perfect-scrollbar.css';

const currentAppLocale =
  AppLocale[getCurrentLanguage(config.defaultLanguage || 'english').locale];

// A function that routes the user to the right place
// after login
const onRedirectCallback = appState => {
  window.history.replaceState(
    {},
    document.title,
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const App = () => {
  const auth0Options = {
    domain: auth0config.AUTH0_DOMAIN,
    client_id: auth0config.AUTH0_CLENT_ID,
    redirect_uri: `${window.location.protocol}//${window.location.host}${auth0config.CALLBACK_URL}`,
    onRedirectCallback,
  };

  return (
    <Provider store={store}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <Auth0Provider {...auth0Options}>
          <Main />
        </Auth0Provider>
      </IntlProvider>
    </Provider>
  );
};

Boot()
  .then(() => App())
  .catch(error => console.error(error));

export default App;
export { AppLocale };
