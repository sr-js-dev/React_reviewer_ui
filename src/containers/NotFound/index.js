import React, { Component } from 'react';
import { Link } from 'react-router-dom';
export default class NotFound extends Component {
  render() {
    const classes = {
      notFoundLayout:
        'flex justify-center items-center flex-col font-bold h-screen',
      backButton:
        'flex justify-center items-center px-8 font-bold uppercase rounded-full min-w-120px h-14 text-sm bg-water-blue text-white hover:text-white hover:bg-water-blue-hover mt-8',
    };
    return (
      <div className={classes.notFoundLayout}>
        <div>
          <h1 className="title">404 Page</h1>
        </div>
        <div>
          <p>Oops! This page could not be found</p>
        </div>
        <Link to="/" className={classes.backButton}>
          Go back to home page
        </Link>
      </div>
    );
  }
}
