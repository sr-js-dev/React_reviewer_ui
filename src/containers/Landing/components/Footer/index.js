import React, { Component } from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import { LANDING_SECTIONS, SOCIAL_LINKS, COPYRIGHT_TEXT } from '../../config';
import Logo from '../../../../components/common/Logo';

export default class Footer extends Component {
  render() {
    const { mobile } = this.props;

    const classes = {
      link: 'text-dusk-50 text-sm font-semibold mx-5 pointer-events-auto',
      socialLink:
        'flex justify-center items-center rounded-full border border-dusk-10 text-light-grey-blue hover:text-white hover:border-light-grey-blue hover:bg-light-grey-blue h-8 w-8 mx-2.5 lg:mr-0 lg:ml-4.5 ',
    };

    const links =
      LANDING_SECTIONS &&
      LANDING_SECTIONS.map(section => {
        return (
          <a
            key={`#${section.id}`}
            href={`#${section.id}`}
            className={classes.link}
          >
            {section.name}
          </a>
        );
      });

    const socialLinks =
      SOCIAL_LINKS &&
      SOCIAL_LINKS.map((link, index) => {
        return (
          <a
            key={`link-${index}-${link.href}`}
            href={link.href}
            className={classes.socialLink}
          >
            <FontAwesomeIcon icon={link.icon} />
          </a>
        );
      });
    return (
      <footer
        className="w-full mx-auto py-7 lg:px-15.5 lg:py-10"
        style={{ maxWidth: 1440 }}
      >
        <section className="flex justify-center lg:justify-between w-full h-auto relative">
          {/* Logo */}
          {!mobile && (
            <>
              <section>
                <Logo />
              </section>
              {/* Internal Links */}
              <section className="absolute flex justify-center items-center pin-t pin-l w-full h-full pointer-events-none">
                {links}
              </section>
            </>
          )}

          {/* External links */}
          <section className="flex items-center">{socialLinks}</section>
        </section>

        {/* Copyright */}
        <section className="relative w-full text-center text-xs text-light-grey-blue leading-wider font-medium mt-6 lg:mt-1">
          {COPYRIGHT_TEXT(mobile)}
        </section>
      </footer>
    );
  }
}
