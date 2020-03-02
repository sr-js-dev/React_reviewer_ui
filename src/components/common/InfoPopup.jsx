import React from "react";
import Icon from "./Icon";
import {Tooltip} from 'antd';
import IntlMessage from "../utility/intlMessages";

import "../../scss/components/InfoPopupGlobal.scss";

export default class InfoPopup extends React.Component {
    state = {
        show: false
    };

    toggleShow = () => {
      this.setState({show: !this.state.show});
    };

    render() {
        let { classWrapper, classIcon, classTooltip, styleWrapper, text, values = {} } = this.props;
        let clsWrapper = "info-popup ",
            clsIcon = "info-popup--icon ",
            clsTooltip = "info-popup--tooltip";

        clsWrapper += (classWrapper) ? classWrapper : "";
        clsIcon += (classIcon) ? classIcon : "";
        clsTooltip += (classTooltip) ? classTooltip : "";
        const message = (<IntlMessage id={text} values={values}/>);
       return (
            <div style={styleWrapper} className={clsWrapper} onMouseEnter={this.toggleShow} onMouseLeave={this.toggleShow}>
                <Tooltip overlayClassName={clsTooltip} visible={this.state.show} title={message}>
                    <Icon class={"text-light-grey-blue text-lg cursor-pointer " + clsIcon} name={"info-hover"}/>
                </Tooltip>
            </div>
       );
    }
}
