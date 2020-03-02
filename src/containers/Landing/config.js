import React from 'react';

import {
  faInstagram,
  faTwitter,
  faFacebookF,
  faLinkedinIn,
} from '@fortawesome/fontawesome-free-brands';

export const LANDING_SECTIONS = [
  {
    id: 'Hero',
    name: 'Home',
  },
  {
    id: 'Features',
    name: 'Features',
  },
  {
    id: 'List',
    name: 'How can we help',
  },
  {
    id: 'Pricing',
    name: 'Pricing',
  },
  {
    id: 'Testimonials',
    name: 'Testimonials',
  },
  {
    id: 'Action',
    name: 'Contact Us',
    dark: true,
  },
];

export const SOCIAL_LINKS = [
  {
    icon: faFacebookF,
    link: 'https://fb.com/art',
  },
  {
    icon: faInstagram,
    link: 'https://instagram.com/art',
  },
  {
    icon: faTwitter,
    link: 'https://twitter.com/art',
  },
  {
    icon: faLinkedinIn,
    link: 'https://linkedin.com/art',
  },
];

export const COPYRIGHT_TEXT = mobile => {
  const year = new Date().getFullYear();
  return (
    <>
      &copy; {year} AmazonReviewTracker.{mobile && <br />} All right reserved.
    </>
  );
};

export const INTERSECTION_BLOCK_CLASS =
  'reviews__landing-intersection-block pointer-events-none w-5 h-10 ';

export const HEADING_CLASS = mobile => {
  return (
    'text-dusk text-lg2 lg:text-3.5xl font-bold text-center mt-6 lg:mt-2 mb-4 lg:mb-4 ' +
    (mobile ? 'leading-tight' : '')
  );
};

export const SUBTITLE_CLASS =
  'my-0 text-center text-xs lg:text-lg font-medium leading-tight ';
