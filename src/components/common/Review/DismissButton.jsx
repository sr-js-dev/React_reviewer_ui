import React from 'react'
import PropTypes from 'prop-types'
import { Progress } from 'antd';

import Icon from '../Icon';

function DismissButton({dismissAnimation, dismissProgress, action, mobile, column }) {
  const classes = {
    button: 'flex items-center h-11 rounded-lg px-2 w-11 text-xs justify-center font-bold uppercase leading-none ',
  };

  return (
    <button
      onClick={action}
      className={
        classes.button +
        ( dismissAnimation ? 'bg-ice-blue hover:bg-coral-pink-30 text-light-grey-blue' : 'bg-coral-pink-10 hover:bg-coral-pink-30 text-coral-pink' ) +
        ( !column ? " ml-3.5" : " lg:w-30 lg:mr-3.5" )
      }
    >
      { !dismissAnimation && <>
        <Icon name="cross" class="" />
        { column && !mobile && <span className="ml-2.5">Dismiss</span> }
      </>}
      { dismissAnimation && <>
        <div
          className={ "reviews__dismiss-progress h-11 common-transition flex justify-center items-center" }
          style={{ opacity: Math.max( 0.2, dismissProgress / 100 ) }}
        >
          <Progress
            type="circle"
            percent={ dismissProgress }
            width={18}
            strokeWidth={11}
            strokeColor={'#afb3c0'}
            format={ () => {
              return <Icon name="cross" class="text-3xs text-light-grey-blue" />
            } }
          />
        </div>

        { column && !mobile && <span className="ml-2.5">Undo</span> }
      </>}
    </button>
  )
}

DismissButton.propTypes = {
  dismissAnimation: PropTypes.bool,
  dismissProgress: PropTypes.number.isRequired,
  action: PropTypes.func.isRequired
}

export default DismissButton

