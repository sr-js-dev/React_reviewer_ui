import React, { Component } from 'react'
import { Link } from 'react-router-dom';
//
import "../../scss/components/Logo.scss";

export default class Logo extends Component {

    render() {
        const { noText, small, main } = this.props;

        const mainClasses = {
            main: main ? 'vpinsight__logo__main items-center' : '',
            logo: main ? 'vpinsight__logo-image__big' : '',
            text: main ? 'text-2.5xl ml-4 mb-2' : small ? 'text-7px ml-1.5 mb-px' : 'ml-2.5 mb-1'
        };

        const smallClasses = {
            main: small ? 'vpinsight__logo__small' : '',
            logo: small ? 'vpinsight__logo-image__small' : '',
        };

        return (
            <Link
                to="/"
                className={ `relative flex items-center vpinsight__logo hover:opacity-80 ${mainClasses.main} ${smallClasses.main}`  }
            >
                <div className={ `vpinsight__logo-image flex-no-shrink ${mainClasses.logo} ${smallClasses.logo}` }></div>

                { !noText && <div className={ `text-reviews-grey leading-none font-bold ${mainClasses.text}` } >
                    AMAZON<br/>
                    REVIEW<br/>
                    TRACKER<br/>
                </div> }
            </Link>
        )
    }
}
