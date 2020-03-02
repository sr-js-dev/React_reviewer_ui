import React from 'react';
import _ from 'lodash';
import Icon from '../../../../components/common/Icon';

export function TagButton({ tag, activeTags, onClick }) {
  const active = _.some(activeTags, ['id', tag.id]);

  return (
    <div
      className={
        'cursor-pointer px-5 flex flex-no-shrink items-center h-14 w-full text ' +
        (active
          ? 'bg-water-blue text-white hover:opacity-80'
          : 'hover:bg-white-15')
      }
      key={tag.id}
      onClick={onClick}
    >
      {tag.name}
    </div>
  );
}

export function TagPill({ tag, onClick }) {
  return (
    <div
      className="reviews__tag-pill flex h-7 m-1 flex-no-shrink items-center rounded-full text-reviews-grey text-xs px-1.5 bg-light-grey-blue-15 font-medium"
      key={tag.id}
    >
      <div className="px-2.5">{tag.name}</div>
      <button
        className="rounded-full bg-light-grey-blue hover:bg-light-grey-blue-50 text-1/2 flex items-center justify-center h-5 w-5"
        onClick={onClick}
      >
        <Icon name="cross" class="text-white" />
      </button>
    </div>
  );
}

export function AddTagButton({ queue, onClick }) {
  return (
    <button
      onClick={onClick}
      className="reviews__tag-pill  flex h-7 m-5 flex-no-shrink items-center rounded-full text-reviews-grey text-xs px-1.5 bg-white font-medium"
    >
      <div className="rounded-full bg-water-blue text-xxs flex items-center justify-center h-5 w-5 leading-none">
        <Icon name="add" class="text-white ml-px" />
      </div>
      <span className="px-2.5">
        Add New Tag <strong>{queue}</strong>
      </span>
    </button>
  );
}
