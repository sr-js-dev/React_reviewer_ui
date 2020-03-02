import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { isMobile } from "../../redux/app/actions";

import { Modal } from "antd";
import { Link } from "react-router-dom";
import IntlMessages from '../../components/utility/intlMessages';

import FreePlanIcon from "../common/FreePlanIcon";
import MobileModal from "../common/MobileModal";


class UpgradeModal extends PureComponent {

    render() {
        const { view, visible, onClose, onCancel, planDataIcon, label, title, body, user } = this.props;

        const mobile = isMobile( view );

        const viewable_days = ( user && user.settings.viewable_days ? user.settings.viewable_days : 30 );

        const content = (
            <div className={ "text-uppercase z-10 flex flex-col justify-center items-center w-full " }>
                <FreePlanIcon name={ planDataIcon } />

                <div className="text-2.5xl text-slate font-bold my-7 text-center">
                    { title && <IntlMessages id={ title } /> }
                    { !title && <>
                        <IntlMessages id={ label } /> is Limited
                    </> }

                </div>

                <div className="text-sm text-slate opacity-60 mb-8 text-center">
                    { body && <IntlMessages id={ body } values={{ allowed_prop: this.props.allowedPropertyCount ? this.props.allowedPropertyCount : null}} /> }

                    { !body && (<>
                        Your plan allows for <strong>{ viewable_days } days</strong> of forecast data.<br/>
                        To view more data, please upgrade.
                    </>)}
                </div>

                <div className={ "flex " + ( mobile ? "flex-col-reverse" : "" ) }>
                    <button className={ "font-bold uppercase text-white bg-light-grey-blue rounded-lg px-6 h-14 " + ( !mobile ? "mx-2.5" : "mt-2.5" ) } onClick={ onClose }>
                        CANCEL
                    </button>
                    <Link onClick={onClose} to="/dashboard/settings?tab=Subscription" className={ "flex justify-center items-center font-bold uppercase text-white hover:text-white bg-water-blue hover:bg-water-blue-hover rounded-lg px-6 h-14 shadow-vp-blue hover:shadow-vp-blue-active " + ( !mobile ? "mx-2.5" : "" ) } >
                        Upgrade
                    </Link>
                </div>
            </div>);

        const ModalOptions = {
            visible,
            onClose,
            onCancel,
            width: 540,
            bodyStyle: {
                padding: 62,
                borderRadius: 6
            },
            zIndex: 100,
            centered: true,
            footer: null,
        };

        const MobileModalOptions = {
            active: visible,
            onHide: onClose
        };

        return (
            <>
            { (mobile && MobileModalOptions.active) && (
                <MobileModal {...MobileModalOptions} >
                    <section className="rounded-lg bg-white h-auto w-3/4 mx-auto my-7 px-3.5 py-6 flex flex-col">
                        { content }
                    </section>
                </MobileModal>
            ) }

            { !mobile && (
                <Modal {...ModalOptions}>{ content }</Modal>
            ) }
            </>
        );
    }
};

const mapStateToProps = (state) => ({
    view: state.App.view,
    user: state.Auth.currentUser
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(UpgradeModal)
