import React, { Component } from 'react'
import PropTypes from "prop-types";

import "../../scss/components/MobileModal.scss";
import Icon from './Icon';

export default class MobileModal extends Component {
    static propTypes = {
        active: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        theme: PropTypes.string,
        containerClass: PropTypes.string
    }

    constructor(props){
        super(props);
        this.modalRef = React.createRef();
    }
    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        const { active } = this.props;
        if (active && this.modalRef.current && !this.modalRef.current.contains(event.target)) {
            this.hide();
        }
    }

    /**
     * Hide the modal
     *
     * @param {object} event - click event
     */
    hide = event => {
        const { onHide } = this.props;
        onHide();
    }

    render() {
        const { active, theme, containerClass } = this.props;
        const className = "vpinsight__mobile-modal fixed w-screen h-screen pin-t pin-l z-50 " + ( active ? "" : "opacity-0 pointer-events-none" ) + " vpinsight__mobile-modal_" + theme;
        const buttonClass = "vpinsight__mobile-modal-button absolute pin-b mb-10 rounded-full flex justify-center items-center text-lg2 text-white  " + ( theme === "light" ? "vpinsight__mobile-modal-button_dark" : "shadow-vp-dropdown" );
        const childrenClass = "vpinsight__mobile-modal-children w-full h-full " + ( theme === "light" ? "bg-white" : "" ) + " " + containerClass;

        return (
            <section className={ className } >
                {/* Modal Content */}
                <section className={ childrenClass }>
                    <div ref={this.modalRef}>
                        { this.props.children }
                    </div>
                </section>

                {/* Hide button */}
                <button
                    className={ buttonClass }
                    onClick={ this.hide }
                >
                    <Icon name="cross" class="h-5.5"/>
                </button>
            </section>
        )
    }
}
