import React from 'react';

import Icon from '../Icon';
import TagsInput from '../../../containers/Products/components/TagsInput';
import ReviewsByDayChart from './ReviewsByDayChart';
import ReviewsList from './ReviewsList';

export function Asin({ asin, grow }) {
  return (
    <div
      className={
        'flex items-center rounded h-7 bg-light-grey-blue-15 px-3.5 mx-1 mb-1 text-dusk text-xs font-semibold ' +
        (grow ? 'flex-grow justify-center' : '')
      }
    >
      {asin}
    </div>
  );
}

export function ReviewsTab({ product, mobile }) {
  return (
    <section className="flex flex-col bg-light-grey-blue-20 py-4 lg:py-7 flex-grow">
      {/* Most Mentioned */}
      {/* <section className="flex flex-col items-center justify-center mb-6">
        <p className="text-base text-dusk font-bold mb-3">
          What are reviewers mentioning the most?
        </p>

        <div className="flex">
          <div className={ classes.pill }>great</div>
          <div className={ classes.pill }>perfect</div>
          <div className={ classes.pill }>compact</div>
          <div className={ classes.pill }>good</div>
          <div className={ classes.pill }>easy</div>
        </div>
      </section> */}

      <section className="flex-no-shrink flex-grow px-4 lg:px-7">
        {product.id && <ReviewsList product_id={product.id} mobile={mobile} />}
      </section>
    </section>
  );
}

export function MainTab(props) {
  const {
    product,
    mobile,
    visible,
    manyChildren,
    asinsExpanded,
    childAsins,
    showTagsInput,
    tagsInputContainerRef,
    onTagsFocus,
    updateTags,
    tagsInputRef,
    expandCollapseAsins,
    showTagsInputHandler,
  } = props;

  return (
    <>
      <section className="flex flex-col flex-no-shrink">
        {/* The chart card */}
        <section className="bg-light-grey-blue-20 p-4 lg:p-7">
          {product.id && (
            <ReviewsByDayChart
              visible={visible}
              product_id={product.id}
              mobile={mobile}
              totalReviewsCount={product.num_reviews}
            />
          )}
        </section>

        {/* ASINs */}
        <section
          className={
            'reviews__product-modal-asins common-transition flex items-center p-4 lg:py-5 lg:px-6 border-t ' +
            (!mobile && asinsExpanded
              ? 'flex-wrap'
              : 'max-h-17 overflow-hidden') +
            (mobile ? ' overflow-x-scroll' : '')
          }
        >
          <Asin asin={product.asin} grow={manyChildren} />

          {childAsins
            ? asinsExpanded || mobile
              ? childAsins
              : childAsins.slice(0, 2)
            : ''}

          {!mobile && manyChildren && (
            <button
              onClick={expandCollapseAsins}
              className="flex items-center justify-center text-xxs text-arrow rounded w-20 h-7 px-3.5 mx-1 mb-1 border hover:bg-arrow hover:text-white hover:border-arrow"
            >
              <Icon name={asinsExpanded ? 'arrow-up' : 'arrow-down'} />
            </button>
          )}

          {mobile && <div className="w-4 h-7 flex-no-shrink" />}
        </section>
      </section>

      {product.id && (
        <section
          className={'flex flex-col flex-no-shrink border-t h-auto '}
          ref={tagsInputContainerRef}
        >
          {!showTagsInput && (
            <button
              onClick={showTagsInputHandler}
              className="h-14 lg:h-16 w-full bg-water-blue text-base lg:text-lg font-bold uppercase hover:bg-water-blue-hover text-white"
            >
              Add Tags
            </button>
          )}
          {showTagsInput && (
            <TagsInput
              active={visible}
              mobile={mobile}
              onFocus={onTagsFocus}
              onChange={updateTags}
              selectedProducts={[product.id]}
              autofocus={false}
              clearOnUpdate={true}
              ref={tagsInputRef}
            />
          )}
        </section>
      )}
    </>
  );
}
