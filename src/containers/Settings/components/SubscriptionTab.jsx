import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";

//  Action
import settingsActions from "../../../redux/settings/actions";
import { isMobile } from "../../../redux/app/actions";
//  Components
import ButtonGroup from "../../../components/common/ButtonGroup";
//  Styles
import "../../../scss/settings/SubscriptionTab.scss";
//  Settings
import { BUTTONS } from '../config/subscriptionTab';
import SubscriptionPlan from "./SubscriptionPlan";

const { getPlans, updatePlan, toggleContactModal } = settingsActions;

export class SubscriptionTab extends Component {
  state = {
    clickedPlan: false,
    mode: 'monthly'
  };

  componentDidMount() {
    this.getPlans();
  }

  getPlans = () => {
    const { getPlans } = this.props;
    getPlans();
  };

  popOut = (plan) => {
    this.setState({clickedPlan: plan})
  }

  /**
   * Contact support to get enterprise deal
   */
  contact = () => {
    const { toggleContactModal } = this.props;
    toggleContactModal();
  };

  /**
   * Change plan
   *
   * @param {string} plan - plan.plan_type value
   */
  subscribe = plan => {
    const { updatePlan } = this.props;
    const { mode } = this.state;

    this.setState({
      clickedPlan: plan
    });
    plan['interval'] = (mode === 'annually') ? 'yearly' : 'monthly';
    plan['total_amount'] = (mode === 'annually') ? (plan.yearly_amount*12).toFixed(2) : plan.monthly_amount;
    updatePlan({'plan_type':plan.plan_type, 'interval': plan.interval, 'total_amount': plan.total_amount});
  };

  /**
   * Monthly / Annually change
   *
   * @param {number|string} mode - key of a button
   */
  onModeChange = mode => {
    this.setState({mode});
  }

  render() {
    const { action, plans, user, loadingUpdatePlan, mobile, extendedMobile } = this.props;
    const { mode, clickedPlan } = this.state;

    if (!plans) {
      return (
        <section className="text-xl text-light-grey-blue">
          Loading plans...
        </section>
      );
    }

    const plansView = plans.map(plan => {
      const planProps = {
        plan,
        mobile,
        extendedMobile,
        user,
        clickedPlan,
        mode,
        loadingUpdatePlan,
        action,
        contactAction: this.contact,
        subscribeAction: this.subscribe,
        popOut: this.popOut
      }

      return <SubscriptionPlan key={ "plan-" + plan.name } {...planProps} />
    });

    const sliderSettings = {
      centerMode: mobile,
      variableHeight: true,
      centerPadding: "6.5%",
      slidesToShow: extendedMobile && !mobile ? 3 : 1,
      slidesToScroll: extendedMobile && !mobile ? 3 : 1,
      arrows: false,
      infinite: false,
      mobileFirst: mobile
    };

    const buttonGroupProps = {
      buttons: BUTTONS,
      activeButton: mode,
      onChange: this.onModeChange,
      className: "h-12 xl:h-10 rounded-full p-1 bg-light-grey-blue-20",
      buttonClass: "h-10 min-w-120px px-5 bg-transparent text-sm font-bold uppercase",
      activeButtonClass: "text-water-blue",
      idleButtonClass: "text-charcoal-50",
      hoverClass: "h-10 min-w-120px bg-white rounded-full shadow-vp-default mt-1 ml-1"
    }

    const buttonGroup = (
      <section className="w-full flex-no-shrink flex py-5 lg:pb-14 items-center justify-center">
        <div className="relative discount-outer">
          <ButtonGroup {...buttonGroupProps} />
          <div className="discount-tooltip">20% Discount</div>
        </div>
      </section>
    );

    return (
      <>
        {!extendedMobile && (
          <section className="vpinsight__settings-plan-container flex flex-col justify-center items-stretch pt-7 pb-16 my-auto">
            { buttonGroup }

            <section className="w-full flex-no-shrink flex justify-center items-stretch">
              {plansView}
            </section>
          </section>
        )}

        {extendedMobile && <>
          { buttonGroup }

          <Slider {...sliderSettings}>{plansView}</Slider>
        </>}
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.Auth.currentUser ? (state.Auth.currentUser.current_user) ? state.Auth.currentUser.current_user : state.Auth.currentUser : null,
  plans: state.Settings.plans,
  loadingUpdatePlan: state.Settings.loadingUpdatePlan,

  mobile: isMobile(state.App.view),
  extendedMobile: isMobile(state.App.view, [ "sm", "md", "lg", "xl" ] ),
});

const mapDispatchToProps = {
  getPlans,
  updatePlan,
  toggleContactModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubscriptionTab);

