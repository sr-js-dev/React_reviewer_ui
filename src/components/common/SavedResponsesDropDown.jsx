import React, { Component } from "react";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import clipboard from "simple-clipboard";
import _ from "lodash";

import "../../scss/components/SavedResponsesDropDown.scss";

import Icon from "./Icon";

import {
  addToast,
  showSavedResponsesModal,
  isMobile
} from "../../redux/app/actions";
import { Popover } from "antd";

export class SavedResponsesDropDown extends Component {
  state = {
    visible: false
  };

  responseClick = response_id => {
    this.onVisibleChange(false);
    const { close, newTab, savedResponses, addToast, reviewUrl } = this.props;

    const response = _.find(savedResponses, ["id", response_id]);

    addToast({
      body: "Copied to your clipboard. Redirecting to review page in",
      icon: "check",
      iconBg: "leafy-green",
      countdown: true
    });

    clipboard(response.response_text);

    setTimeout(() => {
      window.open(reviewUrl);
      newTab(response_id);
    }, 2000);

    close();
  };

  showSavedResponsesModal = event => {
    const { close, showSavedResponsesModal } = this.props;
    showSavedResponsesModal();
    close();
    this.onVisibleChange(false);
  };

  onVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {
    let { savedResponses, children, mobile } = this.props;
    const { visible } = this.state;
    savedResponses = _.sortBy(savedResponses, 'order');

    const responses = savedResponses.map((response, idx) => {
      return (
        <div
          key={idx}
          onClick={e => {
            this.responseClick(response.id);
          }}
          className="reviews__saved-response w-full bg-white flex items-center hover:bg-water-blue-10 cursor-pointer"
        >
          <div className="w-50px flex flex-no-shrink items-center justify-center text-dusk text-sm font-bold opacity-40 hover:opacity-100">
            {idx+1}
          </div>

          <div className="py-5 pr-5">{response.response_text}</div>

          <Icon
            name="star"
            class="text-lg text-water-blue absolute pin-r mr-5"
          />
        </div>
      );
    });

    const content = (<div
        className="reviews__saved-responses-dropdown "
      >
        {!mobile && <PerfectScrollbar>{responses}</PerfectScrollbar>}

        {mobile && (
          <div className="scrollbar-container w-full relative overflow-y-scroll">
            {responses}
          </div>
        )}

        {!mobile && (
          <div className="p-5">
            <button
              onClick={this.showSavedResponsesModal}
              className="text-xs font-bold w-full h-12 rounded-lg uppercase bg-water-blue-10 hover:bg-water-blue-20 text-water-blue"
            >
              Manage Saved Responses
            </button>
          </div>
        )}
      </div>);

    return (
      <Popover
        trigger={['click']}
        placement={ "bottomRight" }
        visible={visible}
        onVisibleChange={this.onVisibleChange}
        content={content}
        overlayClassName={ "reviews__saved-responses-dropdown-overlay"}
      >
        { children }
      </Popover>
    );
  }
}

const mapStateToProps = state => ({
  savedResponses: state.App.savedResponses,
  mobile: isMobile(state.App.view)
});

const mapDispatchToProps = {
  addToast,
  showSavedResponsesModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SavedResponsesDropDown);
