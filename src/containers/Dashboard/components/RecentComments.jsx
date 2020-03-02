import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import _ from 'lodash';

import { getRecent } from '../../../redux/comments/actions';
import { isMobile, EXTENDED_MOBILE } from '../../../redux/app/actions';

import Comment from '../../../components/common/Comment';
import CommentColumn from '../../../components/common/Comment/CommentColumn';
import CommentModal from "../../../components/common/Comment/CommentModal";

import LoadingAnimation from '../../../components/common/LoadingAnimation';
import OffsetSlider from '../../../components/common/OffsetSlider';


export class RecentComments extends Component {
    componentDidMount() {
        const { getRecent } = this.props;
        getRecent();
    }

    render() {
        const { commentsLoading, recent, mobile, extendedMobile, comment_error } = this.props;

        const comments = _.uniqBy(recent, 'comment_id');
        const noComments = !commentsLoading && comments.length === 0 && !comment_error;

        const commentsList = comments.slice( 0, 5 ).map( comment => {
            return (
                mobile ?
                <CommentColumn comment={ comment } key={ 'comment-' + comment.comment_id } mobile={ extendedMobile } /> :
                <Comment comment={ comment } key={ 'comment-' + comment.comment_id } />
            )
        } );

        const classes = {
            count: "text-light-grey-blue hover:text-water-blue text-xs font-bold border-grey-border-50 hover:border-transparent border hover:bg-white hover:shadow-vp-default rounded flex items-center px-2.5 h-7 ml-2.5",
            container: "reviews__items-container flex flex-col w-full min-h-160px bg-white rounded-lg shadow-vp-default mt-7 " + (commentsLoading ? "py-12" : "")
        }

        return (
            <>
            <CommentModal />
            <section className={ "w-full md:p-7 z-10 " + ( mobile ? "" : "reviews__gradient-section" ) }>
                <div className="flex text-xl md:text-2.25xl font-semibold px-2.5 py-3.5 md:p-0 text-dusk items-center">
                    Recent Comments
                    { !commentsLoading && recent && <Link to="/comments" className={ classes.count }>{ comments.length }</Link> }
                </div>

                <section className={mobile ? "w-full" : classes.container}>
                    { commentsLoading && <LoadingAnimation /> }

                    { !commentsLoading && noComments && (
                        <div className="w-full text-2xl font-medium text-light-grey-blue text-center py-7">
                            There are no recent comments
                        </div>
                    ) }
                    { !commentsLoading && comment_error && comment_error.length > 0 && (
                        <div className="w-full text-xl leading-loose font-medium text-light-grey-blue text-center py-7">
                        { comment_error } <Link to="/settings?tab=Subscription" className="font-semibold">Click here</Link> to upgrade your plan.
                        </div>
                    )}

                    { !commentsLoading && !noComments && !mobile && commentsList }
                    { !commentsLoading && !noComments && mobile && <OffsetSlider items={ commentsList } /> }
                </section>
            </section>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    commentsLoading: state.Comments.commentsLoading,
    recent: state.Comments.recent,
    extendedMobile: isMobile( state.App.view, EXTENDED_MOBILE ),
    mobile: isMobile( state.App.view ),
    comment_error: state.Comments.comment_error
})

const mapDispatchToProps = {
    getRecent
}

export default connect(mapStateToProps, mapDispatchToProps)(RecentComments)
