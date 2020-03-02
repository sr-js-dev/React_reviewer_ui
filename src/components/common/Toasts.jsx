import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment';
import _ from 'lodash';

import Icon from './Icon';

import '../../scss/components/Toasts.scss';

export class Toasts extends Component {
    state = {
        timers: {},
        intervalID: null
    };

    componentDidMount() {
        //  I hope this interval doesn't ruin the performance
        let intervalID = setInterval( this.updateTimers, 1000 );

        this.setState( { intervalID } );
    }

    componentWillUnmount() {
        clearInterval( this.state.intervalID );
    }

    componentDidUpdate( prevProps ) {
        if ( !_.isEqual( this.props.toasts, prevProps.toasts ) ) {
            this.updateTimers();
        }
    }

    updateTimers = () => {
        const { toasts } = this.props;

        let timers = {};

        for (let index = 0; index < toasts.length; index++) {
            const toast = toasts[ index ];
            timers[ toast.id ] = moment( toast.time_dismissed ).diff( moment(), 'seconds' ) + 1;
        }

        this.setState( { timers } );
    }

    render() {
        const { toasts } = this.props;
        const { timers } = this.state;

        const displayToasts = toasts.map( toast => {
            const actionHandler = e => {
                toast.action.handler( e, toast.id )
            }

            return (
                <div
                    key={ toast.id }
                    className={ "review__toast flex items-center justify-center px-5 text-sm text-white pointer-events-auto mt-5 " + ( toast.dismissed ? "review__toast_dismissed" : "" ) }
                >
                    { toast.icon && (
                        <div className={ "flex w-6 h-6 mr-2.5 rounded-full items-center justify-center " + ( toast.iconBg ? `bg-${ toast.iconBg }` : "" ) }>
                            <Icon name={ toast.icon } className={ toast.iconClass } />
                        </div>
                    ) }

                    <span>
                        <span className="mr-1">{ toast.body }</span>

                        { toast.action &&
                            <span
                                onClick={ actionHandler }
                                className="text-underline cursor-pointer font-bold mr-1"
                            >
                                { toast.action.title }
                            </span>
                        }

                        { toast.countdown && (<>
                            { timers[ toast.id ] } seconds...
                        </>) }
                    </span>
                </div>
            );
        } );

        return (
            <div className="fixed w-screen h-screen pin-t pin-l flex flex-col items-center justify-end pb-7 pointer-events-none" style={{ zIndex: 1001 }}>
                { displayToasts }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    toasts: state.App.toasts
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Toasts)
