import React, { Component } from "react";
import { connect } from "react-redux";
import _ from 'lodash';

import { getTags, selectTag } from "../../redux/tags/actions";

import "../../scss/components/TagFilter.scss";
import { isMobile, EXTENDED_MOBILE } from "../../redux/app/actions";
import { getSelectedTag } from "../../redux/tags/reducer";

export class TagFilter extends Component {
  /**
   * Select a tag for filter
   *
   * Tag name will be attached to all events that are sent through SecureAxios
   *
   * @param {(Number|String)} tag - a Tag ID
   */
  selectTag = tag => {
    const { selectTag, selectedTag } = this.props;
    //  Do nothing if seleting 'all' tag while 'all' is active
    if ( selectedTag === 'all' && tag === 'all' ) {
      return
    }

    //  If clicked on currently selected tag, de-select it
    //  and select 'all' instead
    selectTag( {tag: selectedTag === tag ? 'all' : tag, updateData: true} );
  };

  resize = () => {
    const { onResize } = this.props;
    onResize();
  }

  componentDidMount() {
    const { getTags, selectTag, onResize} = this.props;

    getTags();

    const tag = getSelectedTag();

    selectTag( { tag, updateData: false } );

    onResize();

    window.addEventListener('resize', this.resize);
  }

  componentDidUpdate( prevProps ) {
    if ( !_.isEqual( this.props.tags, prevProps.tags ) ) {
      this.props.onResize()
    }
  }

  render() {
    const { tags, selectedTag, containerRef } = this.props;

    const classes = {
      tagPill:
        "reviews__tag-pill h-7 flex-no-shrink rounded-full px-4 m-5px flex-no-shrink bg-light-grey-blue-20 hover:bg-light-grey-blue-50 text-xs text-reviews-grey",
      container: "reviews__tag-filter fixed pin-t pin-l w-screen min-h-50px lg:min-h-15.5 bg-white z-20 shadow-vp-header flex flex-wrap items-center mt-16 lg:mt-18"
    };

    const tagPills = tags.map(tag => {
      return (
        <button
          key={tag.name}
          className={
            classes.tagPill +
            (tag.name === selectedTag ? " reviews__tag-pill_accent" : "")
          }
          onClick={e => {
            this.selectTag(tag.name);
          }}
        >
          {tag.name}
        </button>
      );
    });

    return (
      <div ref={ containerRef } className={ classes.container }>
        <button
          className={
            classes.tagPill +
            (selectedTag === "all" ? " reviews__tag-pill_accent" : "")
          }
          onClick={e => {
            this.selectTag("all");
          }}
        >
          All
        </button>

       { tagPills }

        <button
          className={
            classes.tagPill +
            " reviews__tag-pill_untagged" +
            (selectedTag === "untagged" ? " reviews__tag-pill_accent" : "")
          }
          onClick={e => {
            this.selectTag("untagged");
          }}
        >
          Untagged
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.Tags,
  queryParams: state.App.queryParams,
  mobile: isMobile( state.App.view, EXTENDED_MOBILE )
});

const mapDispatchToProps = {
  getTags,
  selectTag
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TagFilter);
