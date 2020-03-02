import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import { store, history } from '../redux/store';
import { withRouter } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Debounce } from 'react-throttle';
import WindowResizeListener from 'react-window-size-listener';
import queryString from 'query-string';
import _ from 'lodash';
import PerfectScrollbar from 'react-perfect-scrollbar';

//  Actions
import {
  resize,
  isMobile,
  getSavedResponses,
  setQueryParams,
  setMainPaddingTop,
  EXTENDED_MOBILE,
} from '../redux/app/actions';
import { getUser } from '../redux/auth/actions';
// import { getNotifications } from '../redux/notifications/actions';

//  New imports
import Router from './Router';

import Topbar from './common/Topbar';
import TagFilter from './common/TagFilter';
import Toasts from './common/Toasts';
import SavedResponsesModal from './common/SavedResponsesModal';
import MobileMenu from './common/MobileMenu';
import Footer from './common/Footer';

const NO_TAG_FILTER = ['/', '/settings'];
const TRANSPARENT_TOPBAR = ['/'];

class Main extends Component {
  /**
   * Set all viewport related properties in state on resize
   *
   * @param {object} event - resize event
   */
  resize = event => {
    const { resize, collapsedBreakpoint } = this.props;
    resize(window.innerWidth, window.innerHeight, collapsedBreakpoint);
  };

  componentDidMount() {
    const { getUser, router, setQueryParams } = this.props;

    window.addEventListener('resize', this.resize);

    const token = localStorage.getItem('auth0_token');

    if (token && token !== 'demo') {
      getUser();
    }

    /**
     * When we first load the component,
     * it happens only on initial page load.
     *
     * We can capture initial query params here.
     *
     * We'll decide what and how to propagate later in the chain :)
     */
    if (router.location.search) {
      const queryParams = _.omit(queryString.parse(router.location.search), [
        'code',
        'state',
      ]);
      setQueryParams({ $merge: queryParams });
    }
  }

  onResize = windowSize => {};

  onTagsResize = () => {
    const { setMainPaddingTop } = this.props;
    if (this.tagFilterRef.current) {
      setMainPaddingTop(this.tagFilterRef.current.offsetHeight);
    }
  };

  constructor(props) {
    super(props);

    this.tagFilterRef = React.createRef();
  }

  render() {
    const { mobile, extendedMobile, router, mainPaddingTop } = this.props;

    const isLanding = router.location.pathname === '/';
    const isSetting = router.location.pathname === '/settings';
    const showTagFilter = !NO_TAG_FILTER.includes(router.location.pathname);
    const transparentTopbar = TRANSPARENT_TOPBAR.includes(
      router.location.pathname
    );

    return (
      <Provider store={store}>
        <Debounce time="1000" handler="onResize">
          <WindowResizeListener onResize={this.onResize} />
        </Debounce>

        <Toasts />

        <ConnectedRouter history={history}>
          <div className="flex relative w-full h-full">
            <Topbar transparent={transparentTopbar} />

            {extendedMobile && <MobileMenu />}

            {showTagFilter && (
              <TagFilter
                onResize={this.onTagsResize}
                containerRef={this.tagFilterRef}
              />
            )}

            {mobile && (
              <div
                className={
                  'vpinsight__main w-full overflow-x-hidden overflow-y-scroll ' +
                  (transparentTopbar ? '' : 'bg-container-bg ') +
                  (!showTagFilter ? 'vpinsight__main_hide-tag-filter' : '')
                }
                style={{ paddingTop: `calc( 4rem + ${mainPaddingTop}px)` }}
              >
                <div className="flex-no-shrink">
                  <Router />
                </div>

                {!isLanding && <Footer />}
              </div>
            )}

            {!mobile && (
              <PerfectScrollbar
                className={
                  'vpinsight__main w-full overflow-hidden ' +
                  (transparentTopbar ? '' : 'bg-container-bg ') +
                  (!showTagFilter ? 'vpinsight__main_hide-tag-filter' : '')
                }
              >
                <div
                  className={
                    'flex-no-shrink ' + (showTagFilter ? 'pt-15.5' : '')
                  }
                  style={{ paddingTop: !isSetting ? mainPaddingTop : '0' }}
                >
                  <Router />
                </div>
              </PerfectScrollbar>
            )}

            <SavedResponsesModal />
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default connect(
  state => ({
    router: state.router,
    mobile: isMobile(state.App.view),
    extendedMobile: isMobile(state.App.view, EXTENDED_MOBILE),
    collapsedBreakpoint: state.App.collapsedBreakpoint,
    mainPaddingTop: state.App.mainPaddingTop,
  }),
  { getUser, getSavedResponses, resize, setQueryParams, setMainPaddingTop }
)(withRouter(Main));
