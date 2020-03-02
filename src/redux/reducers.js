import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import Auth from './auth/reducer';
import App from './app/reducer';
import Settings from './settings/reducer';
import Notifications from './notifications/reducer';
import ThemeSwitcher from './themeSwitcher/reducer';
import LanguageSwitcher from './languageSwitcher/reducer';

//  Reviews
import Tags from './tags/reducer';
import Reviews from './reviews/reducer';
import Comments from './comments/reducer';
import Products from './products/reducer';

export default history =>
  combineReducers({
    router: connectRouter(history),
    Auth,
    App,
    ThemeSwitcher,
    LanguageSwitcher,
    Settings,
    Notifications,

    //  Reviews
    Tags,
    Reviews,
    Comments,
    Products,
  });
