import React from 'react'
import { Spin } from 'antd';
import LoadingAnimation from "../common/LoadingAnimation";

Spin.setDefaultIndicator( <LoadingAnimation /> );

export default Spin;
