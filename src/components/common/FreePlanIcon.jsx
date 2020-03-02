import React, { Component } from 'react'

import Icon from "./Icon";
import "../../scss/components/FreePlanIcon.scss";

export default class FreePlanIcon extends Component {
    render() {
        return (
            <div className="vpinsight__free-plan-icon-container flex flex-no-shrink justify-center items-center rounded-full bg-white relative mt-1">

                <div className="vpinsight__free-plan-icon-border rounded-full absolute z-10"></div>

                <div className="vpinsight__free-plan-icon rounded-full bg-white absolute flex justify-center items-center z-20">
                    <Icon name={ this.props.name } class={ "text-3xl leading-none" } />
                </div>

            </div>
        )
    }
}
