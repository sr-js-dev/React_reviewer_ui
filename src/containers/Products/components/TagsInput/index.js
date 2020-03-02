import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AutosizeInput from 'react-input-autosize';
import _ from 'lodash';

import { getTags } from '../../../../redux/tags/actions';
import TagsService from '../../../../services/TagsService';

import { TagButton, TagPill, AddTagButton } from './components';

import LoadingAnimation from '../../../../components/common/LoadingAnimation';
import PerfectScrollbar from 'react-perfect-scrollbar';

class TagsInput extends Component {
  static propTypes = {
    active: PropTypes.bool,
    clearOnUpdate: PropTypes.bool,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
  };

  state = {
    queue: '',
    commonTags: null,
    addedTags: [],
    removedTags: [],
    tagsLoading: true,
  };

  clear() {
    this.setState({
      queue: '',
      commonTags: null,
      addedTags: [],
      removedTags: [],
      tagsLoading: true,
    });
  }

  getCommonTags = () => {
    const { selectedProducts } = this.props;

    if (!selectedProducts) {
      return;
    }

    return TagsService.common(selectedProducts).then(commonTags => {
      this.setState({
        commonTags,
        tagsLoading: false,
      });
    });
  };

  /**
   * On change of value, filter loaded tags
   *
   * @param {Event} event - change event coming from controlled input
   */
  onInputChange = event => {
    const queue = event.target.value;

    if (queue.length >= 0) {
      this.setState({ queue });
    }
  };

  /**
   * On keyup, if input is empty and key
   * pressed is backspace – remove last tag in array
   *
   * @param {Event} event - onkeyup event coming from controlled input
   */
  onInputKeyup = event => {
    const keycode = event.keyCode;
    const queue = event.target.value;

    if (keycode === 8 && queue.length === 0) {
      const { commonTags, addedTags, removedTags } = this.state;
      //  Same thing as in render. Should give the same result.
      //  If bugs happen: just store activeTags in state
      const activeTags = _.differenceBy(
        _.union(commonTags, addedTags),
        removedTags,
        'id'
      );

      this.removeTag(activeTags[activeTags.length - 1]);
    }
  };

  /**
   * @param {Tag} tag
   */
  selectTag = tag => {
    const { commonTags } = this.state;

    //  For some reason, comparison through both _.inlcudes and Array.prototype.includes
    //  doesn't accurately compare objects
    let existing = false;

    for (let index = 0; index < commonTags.length; index++) {
      const aTag = commonTags[index];

      if (_.isEqual(aTag, tag)) {
        existing = true;
        break;
      }
    }

    if (existing) {
      this.removeTag(tag);
    } else {
      this.addTag(tag);
    }
  };

  /**
   * Add or remove tag from addedTags array
   *
   * This is necessary because of bulk edit process
   *
   * @param {Tag} tag
   */
  addTag = tag => {
    const { addedTags } = this.state;

    //  For some reason, comparison through both _.inlcudes and Array.prototype.includes
    //  doesn't accurately compare objects
    let includes = false;

    for (let index = 0; index < addedTags.length; index++) {
      const aTag = addedTags[index];

      if (_.isEqual(aTag, tag)) {
        includes = true;
        break;
      }
    }

    this.setState({
      addedTags: includes
        ? _.differenceBy(addedTags, [tag], 'id')
        : _.union(addedTags, [tag]),
    });
  };

  /**
   * Add or remove tag from removedTags array
   *
   * This is necessary because of bulk edit process
   *
   * @param {Tag} tag
   */
  removeTag = tag => {
    const { removedTags } = this.state;

    //  For some reason, comparison through both _.inlcudes and Array.prototype.includes
    //  doesn't accurately compare objects
    let includes = false;

    for (let index = 0; index < removedTags.length; index++) {
      const aTag = removedTags[index];

      if (_.isEqual(aTag, tag)) {
        includes = true;
        break;
      }
    }

    this.setState({
      removedTags: includes
        ? _.differenceBy(removedTags, [tag], 'id')
        : _.union(removedTags, [tag]),
    });
  };

  update = () => {
    const { selectedProducts, clearOnUpdate } = this.props;
    const { addedTags, removedTags } = this.state;

    this.setState({ tagsLoading: true });

    return TagsService.bulk_save({
      product_ids: selectedProducts,
      add_tag_ids: _.map(addedTags, 'id'),
      remove_tag_ids: _.map(removedTags, 'id'),
    }).then(res => {
      if (clearOnUpdate) {
        this.clear();
        this.getCommonTags();
      }
    });
  };

  /**
   * Send request to create a new tag
   * and immediately add it to this product
   *
   * @param {Event} e - click event
   */
  addNewTag = e => {
    const { getTags } = this.props;
    const { queue } = this.state;

    return TagsService.create(queue).then(({ tag }) => {
      this.addTag(tag);
      this.setState({ queue: '' });
      getTags();
    });
  };

  componentDidMount() {
    const { selectedProducts } = this.props;

    if (selectedProducts) {
      this.getCommonTags();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedProducts, active, onChange } = this.props;
    const { commonTags, addedTags, removedTags } = this.state;
    const { addedTags: prevAdded, removedTags: prevRemoved } = prevState;

    if (active && selectedProducts && commonTags == null) {
      this.getCommonTags();
    }

    if (
      typeof onChange === 'function' &&
      (!_.isEqual(addedTags, prevAdded) || !_.isEqual(removedTags, prevRemoved))
    ) {
      onChange({ addedTags, removedTags });
    }
  }

  render() {
    const { mobile, scrollbar, tags, autofocus, onFocus } = this.props;
    const {
      queue,
      commonTags,
      addedTags,
      removedTags,
      tagsLoading,
    } = this.state;

    const activeTags = _.differenceBy(
      _.union(commonTags, addedTags),
      removedTags,
      'id'
    );

    const options =
      tags &&
      tags.map(tag => {
        if (
          queue.length > 0 &&
          tag.name.toLowerCase().indexOf(queue.toLowerCase()) === -1
        ) {
          return '';
        }

        return (
          <TagButton
            tag={tag}
            activeTags={activeTags}
            onClick={e => {
              this.selectTag(tag);
            }}
          />
        );
      });

    const selected =
      activeTags &&
      activeTags.map(tag => {
        return (
          <TagPill
            tag={tag}
            onClick={e => {
              this.selectTag(tag);
            }}
          />
        );
      });

    return (
      <>
        {tagsLoading && (
          <div className="w-full h-full relative">
            <LoadingAnimation />
          </div>
        )}

        {!tagsLoading && (
          <>
            <section
              className={
                'reviews__tags-input flex flex-wrap flex-no-shrink p-4 bg-white z-20 ' +
                (scrollbar ? 'relative' : 'sticky pin-t pin-l')
              }
              onClick={
                onFocus
                  ? e => {
                      onFocus(e);
                    }
                  : null
              }
            >
              {selected}
              <AutosizeInput
                value={queue}
                onChange={this.onInputChange}
                onKeyUp={this.onInputKeyup}
                placeholder="Add a tag..."
                className="reviews__tags-queue-input m-1 h-7 focus:outline-none flex-grow"
                autoFocus={autofocus !== false}
              />
            </section>

            {scrollbar && !mobile && (
              <section className="reviews__tags-input-tags bg-light-grey-blue-20 relative flex-grow flex flex-col items-start z-10 overflow-hidden">
                <PerfectScrollbar className="w-full">
                  {options}
                  {queue && (
                    <AddTagButton queue={queue} onClick={this.addNewTag} />
                  )}
                </PerfectScrollbar>
              </section>
            )}

            {scrollbar && mobile && (
              <section className="reviews__tags-input-tags bg-light-grey-blue-20 relative flex-grow flex flex-col items-start z-10 overflow-y-scroll">
                {options}
                {queue && (
                  <AddTagButton queue={queue} onClick={this.addNewTag} />
                )}
              </section>
            )}

            {!scrollbar && (
              <section
                className={
                  'reviews__tags-input-tags bg-light-grey-blue-20 relative flex-grow flex flex-col items-start z-10 '
                }
              >
                {options}
                {queue && (
                  <AddTagButton queue={queue} onClick={this.addNewTag} />
                )}
              </section>
            )}
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  tags: state.Tags.tags,
});

const mapDispatchToProps = {
  getTags,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { forwardRef: true }
)(TagsInput);
