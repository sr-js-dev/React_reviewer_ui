import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { LANDING_SECTIONS } from '../../config';
import Icon from '../../../../components/common/Icon';

export default class SectionLinks extends Component {
  static propTypes = {
    sectionChange: PropTypes.func.isRequired,
    activeSection: PropTypes.string,
  };

  render() {
    const { activeSection, sectionChange } = this.props;

    const links =
      LANDING_SECTIONS &&
      LANDING_SECTIONS.map(section => {
        const active = section.id === activeSection;
        const currentSection = _.find(LANDING_SECTIONS, ['id', activeSection]);
        const className =
          'flex items-center justify-end w-full pointer-events-auto text-lg common-transition font-bold leading-none mb-5 ';

        return (
          <a
            key={`#${section.id}`}
            href={`#${section.id}`}
            className={
              className +
              (currentSection.dark
                ? 'text-white'
                : active
                ? 'text-water-blue'
                : 'text-dusk opacity-20')
            }
            onClick={e => {
              sectionChange(section.id);
            }}
          >
            <span
              style={{
                transformOrigin: '100% 50%',
                transform: active ? '' : 'scale(0.83)',
              }}
            >
              {section.name}
            </span>
            <Icon
              name="reviews"
              class="flex-no-shrink ml-2.5"
              style={{
                transform: active ? '' : 'scale(0.83)',
                textShadow: active
                  ? `0 3px 7px ${
                      currentSection.dark
                        ? `rgba( 255, 255, 255, 0.35 )`
                        : `rgba( 29, 111, 220, 0.35 )`
                    }`
                  : '',
              }}
            />
          </a>
        );
      });
    return (
      <section className="fixed pin-t pin-r pointer-events-none h-full flex flex-col justify-center items-end z-20 pr-10">
        {links}
      </section>
    );
  }
}
