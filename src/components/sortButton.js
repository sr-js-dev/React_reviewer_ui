import React from 'react';
import './../scss/competition/competition.scss';
import Icon from './common/Icon';

const SortButton = props => {
  const {
    currentFieldName,
    directionSort,
    fieldName,
    buttonLabel,
    handlerTriggerButton,
    handlerTriggerDirection,
  } = props;

  const selected = fieldName === currentFieldName;
  const defaultField = fieldName === '';

  let classList =
    'cursor-pointer uppercase h-7 mr-2.5 flex items-center rounded font-bold text-xxs flex-no-shrink focus:outline-none ' +
    (selected
      ? 'bg-water-blue text-white'
      : 'text-light-grey-blue bg-blueish-grey-transparent hover:bg-blueish-grey hover:text-white');

  const onClick = event => {
    handlerTriggerButton(fieldName);
  };

  return (
    <button className={classList} onClick={onClick}>
      <div className="px-4">{buttonLabel}</div>

      {!defaultField && selected && (
        <div
          className="flex items-center cursor-pointer px-2.5 bg-sort-icon-bg h-7"
          onClick={handlerTriggerDirection}
        >
          <Icon name="sorting" class={directionSort ? '' : 'rotate-icon'} />
        </div>
      )}
    </button>
  );
};

export default SortButton;
