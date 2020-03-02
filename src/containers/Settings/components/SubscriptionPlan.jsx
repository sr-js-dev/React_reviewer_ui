import React from 'react'
import ReactHtmlParser from 'react-html-parser';
import numeral from 'numeral'

import LoadingIndicator from '../../../components/common/LoadingIndicator';

const PLAN_CLASS = "vpinsight__settings-plan cursor-pointer bg-white relative overflow-hidden flex flex-no-shrink flex-col items-center justify-start pt-6 pb-10 ";
const SUBSCRIBE_BUTTON_CLASS = 'hover:text-white hover:opacity-75 ';
const PLAN_COLORS = {
  free: "coral",
  pro: "marigold",
  advanced: "leafy-green",
  enterprise: "reviews-grey",
  basic: "water-blue"
};

/**
 * Had to rewrite this in a more verbose way,
 * otherwise it's not at all clear what's going on
 *
 * @param {Object} user
 * @param {Object} plan
 * @param {Object} clickedPlan
 */
function planFeatured( user, plan, clickedPlan ) {
  const userPlanType = user ? user.settings.subscribed_plan.split("_")[0] : false;

  //  Clicked plan becomes featured
  if ( clickedPlan !== false && clickedPlan.plan_type === plan.plan_type ) {
    return true;
  //  Otherwise, check the usual conditions + new conditions without user
  //    1. No user, no current plan – just feature basic
  } else if ( !user && clickedPlan === false && plan.plan_type === "basic" ) {
    return true
  //    2. User is logged in – feature current plan if it's not free
  } else if ( user && clickedPlan === false && plan.plan_type === userPlanType && plan.plan_type !== "free" ) {
    return true
  //    3. User is logged in and is on free plan – feature basic
  } else if ( user && clickedPlan === false && plan.plan_type === "basic" && userPlanType === 'free' ) {
    return true;
  }

  return false;

}

export default function SubscriptionPlan(props) {
    const {
      plan,
      extendedMobile,
      user,
      clickedPlan,
      mode,
      loadingUpdatePlan,
      action,
      contactAction,
      subscribeAction,
      popOut,
    } = props;

    const planColor = PLAN_COLORS[plan.plan_type];
    const featured = !extendedMobile && planFeatured( user, plan, clickedPlan );
    const interval = (mode === 'annually') ? 'yearly' : 'monthly';

    const planPrice =
      plan.plan_type === "enterprise" ? (
        <button
          onClick={ contactAction }
          className={`rounded-lg bg-white border-2 font-bold text-xl h-16 w-48 border-${planColor} text-${planColor} hover:text-white hover:bg-${planColor} ${SUBSCRIBE_BUTTON_CLASS}`}
        >
          Get offer
        </button>
      ) : (
        <>
          <span className="text-6xl">
            ${numeral( mode === "annually" ? plan.yearly_amount : plan.monthly_amount ).format("0", Math.floor)}
          </span>

          <span className="text-2.5xl">
            {numeral( mode === "annually" ? plan.yearly_amount : plan.monthly_amount ).format(".00")}
          </span>

          <span className="text-base text-lighter-grey-blue ml-2">/ mo</span>

          { mode === "annually" && plan.plan_type !== "free" && <small style={{ bottom: -6 }} className="absolute pin-l w-full text-center text-xxs text-dusk-30 font-medium">billed annually</small> }
        </>
      );

    let subscribeButton;

    const buttonDimensions =
      "flex-no-shrink  " +
      (featured && !extendedMobile ? "w-48 h-17 mb-3 text-lg" : "w-42 h-12 text-sm");

    if (user && (
      (`${plan.plan_type}_${interval}` === user.settings.subscribed_plan) ||
      (user.settings.subscribed_plan === `${plan.plan_type}`)
      ) ) {
      subscribeButton = (
        <button
          className={`${buttonDimensions} border-2 border-grey-border-50 text-grey-border-50 uppercase font-bold rounded-lg pointer-events-none`}
        >
          Current Plan
        </button>
      );
    } else if (plan.plan_type === "enterprise") {
      subscribeButton = (
        <button
          className={`${buttonDimensions} ${SUBSCRIBE_BUTTON_CLASS} border-2 border-${planColor} bg-${planColor} text-white uppercase font-bold rounded-lg`}
          onClick={ contactAction }
        >
          Contact Us
        </button>
      );
    } else {
      const buttonAction = action ? action : () => { subscribeAction(plan); };
      subscribeButton = (
        <button
          className={`${buttonDimensions} ${SUBSCRIBE_BUTTON_CLASS} mx-auto border-2 border-${planColor} bg-${planColor} text-white uppercase font-bold rounded-lg`}
          onClick={ buttonAction }
        >
          Subscribe
        </button>
      );
    }
    const featuresList = plan.description;

    return (
      <section
        key={`${ user ? user.id : "User" }-subscription-${plan.plan_type}`}
        className={
          PLAN_CLASS +
          (featured ? "highlighted z-20" : "shadow-vp-default z-10")
        }
        onClick={() => { popOut(plan) } }
      >
        <div
          className={"absolute pin-t pin-l w-full h-3 "+ (user && `${plan.plan_type}_${interval}` === user.settings.subscribed_plan ? 'bg-plan-free' : `bg-${planColor}`)}
        ></div>

        {/* "Popular" */}
        {featured && (
          <div className="text-xxs text-lighter-grey-blue font-bold mt-2 uppercase text-center">
            {/* Popular */}
          </div>
        )}

        {/* Plan name */}
        <div
          className={`text-${user && `${plan.plan_type}_${interval}` === user.settings.subscribed_plan ? 'plan-free' : planColor} font-bold uppercase text-center ${
            featured ? "text-3xl" : "text-xl mt-2"
          }`}
        >
          {plan.name}
        </div>

        {/* Plan price OR "get offer" button */}
        <div
          className={`relative text-slate font-bold h-16 leading-none text-center ${
            featured ? "text-3xl mt-6" : "text-xl mt-8"
          }`}
        >
          {planPrice}
        </div>

        {/* Allowed products */}
        <div className="mt-8 mb-4 text-base font-medium text-dusk text-center">
          Track <strong>{plan.allowed_products ? plan.allowed_products : 'unlimited'}</strong> Products
        </div>

        {/* Plan description */}
        <div
          className={
            "flex-grow my-8 text-sm feature-box " + (featured ? "px-14" : "px-10")
          }
        >
          {ReactHtmlParser(featuresList)}
        </div>

        {/* Button */}
        {subscribeButton}

        <LoadingIndicator
          visible={
            loadingUpdatePlan && clickedPlan === plan.plan_type
          }
        />
      </section>
    );
}
