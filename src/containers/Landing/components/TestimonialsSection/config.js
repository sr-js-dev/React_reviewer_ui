/**
 * @typedef {Object} TestimonialItem
 * @property {String} body
 * @property {String} name
 * @property {String} position
 * @property {String} initialRotation
 * @property {String} activeRotation
 * @property {String} quotesPosition - 'top' or left'
 * @property {Object} style - style object that will be applied to container on desktop
 * @property {Objcet} styleMobile - style object that will be applied to container on mobile
 */

export const TESTIMONIALS_LIST = [
  {
    body:
      'We were getting complaints that our forecasts were not realistic, too low or too high. But when we implemented <strong>AR Tracker</strong> services we saw that the complaints reduced significantly and the potential clients were happier with our data. Our relationships with potential clients start off a lot better now.',
    name: 'Miguel Romero',
    position: 'Operations Manager, Pass the Keys',
    quotesPosition: 'top',
    style: {
      width: 438,
      height: 538,
      zIndex: 0,
    },
    initialRotation: 1,
    activeRotation: -2,
    svgBgURL: '/images/landing/testimonials/bg-1.svg',
  },
  {
    body:
      'Before we started using <strong>Amazon Review Tracker</strong>, our methodology was a little more trial and error. Customers had to just trust our judgment based on industry experience – but we couldn’t really back it up with data.',
    name: 'David Grey',
    position: 'Head of Yield Management, Hostmaker',
    style: {
      width: 666,
      height: 352,
      transform: `translate(-3px, -10px)`,
      zIndex: 10,
    },
    initialRotation: -1,
    activeRotation: 2,
    svgBgURL: '/images/landing/testimonials/bg-2.svg',
  },
  {
    body: 'I’m shocked. That’s awesome! 😍',
    name: 'Hilda Jones',
    position: 'Rental Manager, Morgan Group',
    style: {
      width: 658,
      height: 232,
      transform: `translate(-42px, -42px)`,
      zIndex: 20,
    },
    initialRotation: -3,
    activeRotation: -1,
    svgBgURL: '/images/landing/testimonials/bg-3.svg',
  },
];
