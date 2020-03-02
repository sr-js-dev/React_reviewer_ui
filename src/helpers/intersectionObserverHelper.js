/**
 * @typedef {Object} HandleIntersectionObserverParams
 * @property {IntersectionObserverEntry} entry - current entry
 * @property {IntersectionObserverEntry} prevEntry - previous entry
 * @property {Function} up - up movement handler
 * @property {Function} down - down movement handler
 */

/**
 *
 * @param {HandleIntersectionObserverParams} param0
 * @returns {Array<Boolean,IntersectionObserverEntry>}
 */
export default function handleIntersectionObserver({
  observerID,
  entry,
  prevEntry,
  prevScrollY,
  up,
  down,
  debug,
}) {
  const scrollContainer = document.querySelector('.vpinsight__main');
  const scrollY = scrollContainer.scrollTop;

  const movingUp = prevScrollY && prevScrollY < scrollY;
  const movingDown = prevScrollY && prevScrollY > scrollY;

  const trigger =
    entry.isIntersecting || (prevEntry && prevEntry.isIntersecting);

  if (debug && trigger && (movingUp || movingDown)) {
    console.group(observerID);

    console.log(`Moving ${movingUp ? 'up' : movingDown ? 'down' : 'nowhere'}`);

    console.log(prevScrollY);
    console.log(scrollY);

    console.groupEnd();
  }

  if (trigger && movingUp && typeof up === 'function') {
    up();
  } else if (trigger && movingDown && typeof down === 'function') {
    down();
  }

  return [prevScrollY !== scrollY ? scrollY : false, entry];
}
