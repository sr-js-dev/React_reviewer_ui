import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import UserService from '../../services/UserService';
import LoadingAnimation from "../common/LoadingAnimation";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isAuthContextReady, setAuthContext] = useState(false);
  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (window.location.search.includes("code=")) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated();
      setIsAuthenticated(isAuthenticated);

      // if(isAuthenticated === false && localStorage.getItem('auth0_token')) {
      //   setIsAuthenticated(true);
      // }
      const savedToken = localStorage.getItem('auth0_token');

      const isUserJustLoggedIn = isAuthenticated && ( !savedToken || savedToken === "demo" );

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        // const token = await auth0FromHook.getTokenSilently();

        auth0FromHook.getIdTokenClaims().then(async(claims) => {
          //if you need the raw id_token, you can access it in the __raw property
          const id_token = claims.__raw;
          localStorage.setItem('auth0_token', id_token);
          let current_user = null;
          if(isUserJustLoggedIn) {
            current_user = await UserService.getCurrentUser();
          }
          if(current_user || !isUserJustLoggedIn) {
            setAuthContext(true);
          }
        });

        setUser(user);

        if(!user && localStorage.getItem('user')) {
          setUser(localStorage.getItem('user'));
        }
        localStorage.setItem('user', JSON.stringify(user));
      } else if(isAuthenticated === false) {
        setAuthContext(true);
      }

      setLoading(false);

      if ( isUserJustLoggedIn ) {
        localStorage.removeItem('selected_tag');
      }
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);

    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);

    debugger;
  };

  const logout = async () => {
    localStorage.setItem('auth0_token', 'demo');
    localStorage.removeItem('user');
    localStorage.removeItem('id_token');
    localStorage.removeItem('selected_tag');

    await auth0Client.logout({
      returnTo: process.env.REACT_APP_RETURNTO
    });

  }

  return (
    <>
    {(isAuthContextReady === true) ?
      <Auth0Context.Provider
        value={{
          isAuthenticated,
          user,
          loading,
          popupOpen,
          loginWithPopup,
          handleRedirectCallback,
          getIdTokenClaims: (...p) => auth0Client.getIdTokenClaims(...p),
          loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
          getTokenSilently: (...p) => auth0Client.getTokenSilently(...p),
          getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
          logout
        }}
      >
        {children}
      </Auth0Context.Provider>
      :
      <LoadingAnimation/>
    }
    </>
  );
};
