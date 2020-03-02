import React, { PureComponent } from 'react';
import ReactLoading from 'react-loading';

class Loader extends PureComponent {

  render() {
    return (
      <div className="mt-1 w-100 h-100 mh-100">
        <div className="">
          <div className="loading m-auto">
            <ReactLoading type='spokes' color='#4D5061' height='30' width='30'/>
          </div>
        </div>
      </div>
    );
  }

}

export default Loader;
