const Color = require('color');

/*

Tailwind - The Utility-First CSS Framework

A project by Adam Wathan (@adamwathan), Jonathan Reinink (@reinink),
David Hemphill (@davidhemphill) and Steve Schoger (@steveschoger).

Welcome to the Tailwind config file. This is where you can customize
Tailwind specifically for your project. Don't be intimidated by the
length of this file. It's really just a big JavaScript object and
we've done our very best to explain each section.

View the full documentation at https://tailwindcss.com.


|-------------------------------------------------------------------------------
| The default config
|-------------------------------------------------------------------------------
|
| This variable contains the default Tailwind config. You don't have
| to use it, but it can sometimes be helpful to have available. For
| example, you may choose to merge your custom configuration
| values with some of the Tailwind defaults.
|
*/

// let defaultConfig = require('tailwindcss/defaultConfig')();

/*
|-------------------------------------------------------------------------------
| Colors                                    https://tailwindcss.com/docs/colors
|-------------------------------------------------------------------------------
|
| Here you can specify the colors used in your project. To get you started,
| we've provided a generous palette of great looking colors that are perfect
| for prototyping, but don't hesitate to change them for your project. You
| own these colors, nothing will break if you change everything about them.
|
| We've used literal color names ("red", "blue", etc.) for the default
| palette, but if you'd rather use functional names like "primary" and
| "secondary", or even a numeric scale like "100" and "200", go for it.
|
*/

let colors = {
  //  VPInsight colors
  'container-bg': '#f1f3f6',
  'ice-blue': '#eff3f6',
  'leafy-green': '#35c635',
  'leafy-green-10': 'rgba(53, 198, 53, 0.1)',
  'leafy-green-30': 'rgba(53, 198, 53, 0.3)',
  'coral-pink': '#ff5a5f',
  'coral-pink-hover': `${new Color('#ff5a5f')
    .lighten(0.1)
    .hex()
    .toString()}`,
  'coral-pink-30': 'rgba(255, 90, 95, 0.3)',
  'coral-pink-10': 'rgba(255, 90, 95, 0.1)',
  marigold: '#fec400',
  'marigold-hover': `${new Color('#fec400')
    .lighten(0.25)
    .hex()
    .toString()}`,
  'light-grey-blue': '#afb3c0',
  'light-grey-blue-95': 'rgba(175, 179, 192, .95)',
  'light-grey-blue-40': 'rgba(175, 179, 192, .4)',
  'light-grey-blue-30': 'rgba(175, 179, 192, .3)',
  'light-grey-blue-20': 'rgba(175, 179, 192, .2)',
  'light-grey-blue-15': 'rgba(175, 179, 192, .15)',
  'light-grey-blue-10': 'rgba(175, 179, 192, .1)',
  'light-grey-blue-50': 'rgba(175, 179, 192, .5)',
  'lighter-grey-blue': '#afb8c0',
  coral: '#ed5454',
  dusk: '#404966',
  'dusk-05': 'rgba(64, 73, 102, 0.05)',
  'dusk-30': 'rgba(64, 73, 102, 0.3)',
  'dusk-40': 'rgba(64, 73, 102, 0.4)',
  'dusk-60': 'rgba(64, 73, 102, 0.6)',
  'dusk-50': 'rgba(64, 73, 102, 0.5)',
  'dusk-80': 'rgba(64, 73, 102, 0.8)',
  slate: '#405566',
  'water-blue': '#1d6fdc',
  'water-blue-05': 'rgba( 29, 111, 220, 0.05 )',
  'water-blue-10': 'rgba( 29, 111, 220, 0.1 )',
  'water-blue-20': 'rgba( 29, 111, 220, 0.2 )',
  'water-blue-hover': '#5494E8',
  'water-blue-light': '#E8F2FF',
  'water-blue-dark': '#1a64c6',
  'charcoal-grey': '#2d3039',
  'grey-icon': '#84A1BA',
  'grey-border': '#D8DADF',
  'grey-border-2': '#E7E8EC',
  'grey-icon-2': '#CFD5DA',
  'grey-border-50': 'rgba( 216, 218, 223, 0.5 )',
  'grey-border-40': 'rgba( 216, 218, 223, 0.4 )',
  'grey-backdrop': '#D9DDE0',
  'grey-backdrop-transparent': 'rgba( 217, 221, 224, 0.3 )',
  'grey-backdrop-10': 'rgba( 217, 221, 224, 0.1 )',
  arrow: '#A8ADBC',
  'blueish-grey': '#C1D0DC',
  'blueish-grey-transparent': 'rgba(193, 208, 220, 0.25)',
  'blueish-grey-transparent-40': 'rgba(193, 208, 220, 0.4)',
  'blueish-grey-transparent-30': 'rgba(193, 208, 220, 0.3)',
  'blueish-grey-transparent-20': 'rgba(193, 208, 220, 0.2)',
  'blueish-grey-transparent-10': 'rgba(193, 208, 220, 0.1)',
  greyish: '#F4F7F9',
  'sort-icon-bg': 'rgba(255,255,255,0.2)',
  'holiday-red': '#F7213B',
  'vp-map-card': '#e8f2ff',

  //  Plan colors
  'plan-free': '#c8d6e5',
  'plan-pro': '#FF9F43',
  'plan-enterprise': '#4EDDCD',

  //  Reviews
  'reviews-grey': '#343539',
  'comments-grey': '#e5e8f0',
  'border-grey': 'rgba(216, 218, 223, 0.4)',
  'border-profile': '#e7e8ea',
  charcoal: '#555862',
  'charcoal-50': 'rgba( 85, 88, 97, 0.5 )',

  //  Generic greys
  black: '#22292f',
  'grey-darkest': '#3d4852',
  'grey-darker': '#606f7b',
  'grey-dark': '#8795a1',
  grey: '#b8c2cc',
  'grey-light': '#dae1e7',
  'grey-lighter': '#f1f5f8',
  'grey-lightest': '#f8fafc',
  white: '#ffffff',
  'white-50': 'rgba(255, 255, 255, 0.5)',
  'white-15': 'rgba(255, 255, 255, 0.15)',

  'black-10': 'rgba(0, 0, 0, 0.1)',
  'black-30': 'rgba(0, 0, 0, 0.3)',
  'black-50': 'rgba(0, 0, 0, 0.5)',

  transparent: 'rgba(255, 255, 255, 0)',
};

module.exports = {
  /*
  |-----------------------------------------------------------------------------
  | Colors                                  https://tailwindcss.com/docs/colors
  |-----------------------------------------------------------------------------
  |
  | The color palette defined above is also assigned to the "colors" key of
  | your Tailwind config. This makes it easy to access them in your CSS
  | using Tailwind's config helper. For example:
  |
  | .error { color: config('colors.red') }
  |
  */

  colors: colors,

  /*
  |-----------------------------------------------------------------------------
  | Screens                      https://tailwindcss.com/docs/responsive-design
  |-----------------------------------------------------------------------------
  |
  | Screens in Tailwind are translated to CSS media queries. They define the
  | responsive breakpoints for your project. By default Tailwind takes a
  | "mobile first" approach, where each screen size represents a minimum
  | viewport width. Feel free to have as few or as many screens as you
  | want, naming them in whatever way you'd prefer for your project.
  |
  | Tailwind also allows for more complex screen definitions, which can be
  | useful in certain situations. Be sure to see the full responsive
  | documentation for a complete list of options.
  |
  | Class name: .{screen}:{utility}
  |
  */

  screens: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1440px',
    '3xl': '1920px',
  },

  /*
  |-----------------------------------------------------------------------------
  | Fonts                                    https://tailwindcss.com/docs/fonts
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your project's font stack, or font families.
  | Keep in mind that Tailwind doesn't actually load any fonts for you.
  | If you're using custom fonts you'll need to import them prior to
  | defining them here.
  |
  | By default we provide a native font stack that works remarkably well on
  | any device or OS you're using, since it just uses the default fonts
  | provided by the platform.
  |
  | Class name: .font-{name}
  | CSS property: font-family
  |
  */

  fonts: {
    sans: [
      'system-ui',
      'BlinkMacSystemFont',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Oxygen',
      'Ubuntu',
      'Cantarell',
      'Fira Sans',
      'Droid Sans',
      'Helvetica Neue',
      'sans-serif',
    ],
    serif: [
      'Constantia',
      'Lucida Bright',
      'Lucidabright',
      'Lucida Serif',
      'Lucida',
      'DejaVu Serif',
      'Bitstream Vera Serif',
      'Liberation Serif',
      'Georgia',
      'serif',
    ],
    mono: [
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ],
  },

  /*
  |-----------------------------------------------------------------------------
  | Text sizes                         https://tailwindcss.com/docs/text-sizing
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your text sizes. Name these in whatever way
  | makes the most sense to you. We use size names by default, but
  | you're welcome to use a numeric scale or even something else
  | entirely.
  |
  | By default Tailwind uses the "rem" unit type for most measurements.
  | This allows you to set a root font size which all other sizes are
  | then based on. That said, you are free to use whatever units you
  | prefer, be it rems, ems, pixels or other.
  |
  | Class name: .text-{size}
  | CSS property: font-size
  |
  */

  textSizes: {
    '3xs': '.375rem', // 6px

    '1/2': '.5rem', // 8px  used
    xxs: '.625rem', // 10px used
    xs: '.75rem', // 12px used
    sm: '.875rem', // 14px used
    base: '1rem', // 16px used
    lg: '1.125rem', // 18px used
    xl: '1.25rem', // 20px used
    lg2: '1.375rem', // 22px used
    '2xl': '1.5rem', // 24px used
    '2.25xl': '1.625rem', // 26px used
    '2.5xl': '1.75rem', // 28px used
    '3xl': '1.875rem', // 30px used
    '3.5xl': '2rem', // 32px used
    '4xl': '2.25rem', // 36px
    '4.2xl': '2.375rem', // 38px
    '4.5xl': '2.5rem', // 40px used :)
    '4.75xl': '2.75rem', // 44px used :)
    '5xl': '3rem', // 48px
    '6xl': '3.375rem', // 54px used
    '7px': '7px',
  },

  /*
  |-----------------------------------------------------------------------------
  | Font weights                       https://tailwindcss.com/docs/font-weight
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your font weights. We've provided a list of
  | common font weight names with their respective numeric scale values
  | to get you started. It's unlikely that your project will require
  | all of these, so we recommend removing those you don't need.
  |
  | Class name: .font-{weight}
  | CSS property: font-weight
  |
  */

  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  /*
  |-----------------------------------------------------------------------------
  | Leading (line height)              https://tailwindcss.com/docs/line-height
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your line height values, or as we call
  | them in Tailwind, leadings.
  |
  | Class name: .leading-{size}
  | CSS property: line-height
  |
  */

  leading: {
    none: 1,
    tight: 1.25,
    normal: 1.5,
    wider: 1.75,
    loose: 2,
  },

  /*
  |-----------------------------------------------------------------------------
  | Tracking (letter spacing)       https://tailwindcss.com/docs/letter-spacing
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your letter spacing values, or as we call
  | them in Tailwind, tracking.
  |
  | Class name: .tracking-{size}
  | CSS property: letter-spacing
  |
  */

  tracking: {
    tight: '-0.05em',
    normal: '0',
    wide: '0.05em',
  },

  /*
  |-----------------------------------------------------------------------------
  | Text colors                         https://tailwindcss.com/docs/text-color
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your text colors. By default these use the
  | color palette we defined above, however you're welcome to set these
  | independently if that makes sense for your project.
  |
  | Class name: .text-{color}
  | CSS property: color
  |
  */

  textColors: colors,

  /*
  |-----------------------------------------------------------------------------
  | Background colors             https://tailwindcss.com/docs/background-color
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your background colors. By default these use
  | the color palette we defined above, however you're welcome to set
  | these independently if that makes sense for your project.
  |
  | Class name: .bg-{color}
  | CSS property: background-color
  |
  */

  backgroundColors: colors,

  /*
  |-----------------------------------------------------------------------------
  | Background sizes               https://tailwindcss.com/docs/background-size
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your background sizes. We provide some common
  | values that are useful in most projects, but feel free to add other sizes
  | that are specific to your project here as well.
  |
  | Class name: .bg-{size}
  | CSS property: background-size
  |
  */

  backgroundSize: {
    auto: 'auto',
    cover: 'cover',
    contain: 'contain',
  },

  /*
  |-----------------------------------------------------------------------------
  | Border widths                     https://tailwindcss.com/docs/border-width
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your border widths. Take note that border
  | widths require a special "default" value set as well. This is the
  | width that will be used when you do not specify a border width.
  |
  | Class name: .border{-side?}{-width?}
  | CSS property: border-width
  |
  */

  borderWidths: {
    default: '1px',
    '0': '0',
    '2': '2px',
    '3': '3px',
    '4': '4px',
    '8': '8px',
  },

  /*
  |-----------------------------------------------------------------------------
  | Border colors                     https://tailwindcss.com/docs/border-color
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your border colors. By default these use the
  | color palette we defined above, however you're welcome to set these
  | independently if that makes sense for your project.
  |
  | Take note that border colors require a special "default" value set
  | as well. This is the color that will be used when you do not
  | specify a border color.
  |
  | Class name: .border-{color}
  | CSS property: border-color
  |
  */

  borderColors: global.Object.assign(
    { default: colors['border-grey'] },
    colors
  ),

  /*
  |-----------------------------------------------------------------------------
  | Border radius                    https://tailwindcss.com/docs/border-radius
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your border radius values. If a `default` radius
  | is provided, it will be made available as the non-suffixed `.rounded`
  | utility.
  |
  | If your scale includes a `0` value to reset already rounded corners, it's
  | a good idea to put it first so other values are able to override it.
  |
  | Class name: .rounded{-side?}{-size?}
  | CSS property: border-radius
  |
  */

  borderRadius: {
    none: '0',
    sm: '.125rem',
    default: '.25rem',
    lg: '.375rem', // 6px used
    xl: '.5rem',
    '2xl': '.875rem', // 14px used
    '3xl': '1.25rem', // 20px used
    full: '9999px',
  },

  /*
  |-----------------------------------------------------------------------------
  | Width                                    https://tailwindcss.com/docs/width
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your width utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default
  | we provide a sensible rem based numeric scale, a percentage
  | based fraction scale, plus some other common use-cases. You
  | can, of course, modify these values as needed.
  |
  |
  | It's also worth mentioning that Tailwind automatically escapes
  | invalid CSS class name characters, which allows you to have
  | awesome classes like .w-2/3.
  |
  | Class name: .w-{size}
  | CSS property: width
  |
  */

  width: {
    auto: 'auto',
    px: '1px',
    '1': '0.25rem',
    '2': '0.5rem',
    '2.5': '0.625rem', // 10px used
    '3': '0.75rem',
    '3.5': '0.875rem', // 14px used
    '4': '1rem', // 16px used
    '5.5': '1.125rem', // 18px used
    '5': '1.25rem', // 20px used
    '6': '1.5rem', // 24px used
    '6.5': '1.75rem', // 28px used
    '7': '1.875rem', // 30px used
    '8': '2rem', // 32px used
    '9': '2.25rem', // 36px used
    '10': '2.5rem', // 40px used
    '11': '2.75rem', // 44px used
    '12': '3rem',
    '13': '3.25rem',
    '15.5': '3.75rem', // 60px used
    '16': '4rem',
    '20': '5rem', // 80px used
    '24': '6rem',
    '30': '7.5rem', //  120px used
    '32': '8rem', //  128px used
    '42': '10.5rem', // 168px used
    '48': '12rem',
    '64': '16rem',
    '1/2': '50%',
    '1/3': '33.33333%',
    '2/3': '66.66667%',
    '1/4': '25%',
    '3/4': '75%',
    '1/5': '20%',
    '2/5': '40%',
    '3/5': '60%',
    '4/5': '80%',
    '1/6': '16.66667%',
    '4/6': '66.66667%', // used
    '5/6': '83.33333%', // used
    '125%': '125%', // used
    '80px': '80px', // used
    '50px': '50px',
    full: '100%',
    screen: '100vw',
    'vp-edit-button': '28px',
  },

  /*
  |-----------------------------------------------------------------------------
  | Height                                  https://tailwindcss.com/docs/height
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your height utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default
  | we provide a sensible rem based numeric scale plus some other
  | common use-cases. You can, of course, modify these values as
  | needed.
  |
  | Class name: .h-{size}
  | CSS property: height
  |
  */

  height: {
    auto: 'auto',
    px: '1px',
    '2px': '2px',
    '3px': '3px',
    '1': '0.25rem',
    '2': '0.5rem',
    '2.5': '0.625rem', // 10px
    '3': '0.75rem', // 12px
    '3.5': '0.875rem', // 14px used
    '4': '1rem', // 16px used
    '5': '1.25rem', // 20px
    '5.5': '1.375rem', // 22px used
    '6': '1.5rem', // 24px
    '6.5': '1.75rem', // 28px
    '7': '1.875rem', // 30px
    '8': '2rem', // 32px used
    '9': '2.25rem', // 36px
    '9.5': '2.375rem', // 38px used
    '10': '2.5rem', // 40px used
    '11': '2.75rem', // 44px used
    '12': '3rem', // 48px used
    '13': '3.25rem', // used
    '14': '3.375rem', // 54px used
    '15': '3.5rem', // 56px used
    '15.5': '3.75rem', // 60px used
    '16': '4rem', // 64px used
    '17': '4.25rem', // 68px used
    '17.5': '4.5rem', // 72px used
    '18': '5.25rem',
    '19': '5.75rem', // 92px
    '24': '6rem',
    '28': '6.25rem', // 100px
    '32': '8rem',
    '40': '10rem', // 160px
    '48': '12rem',
    '64': '16rem',
    '68': '17rem', // used
    '42px': '42px', // used
    '50px': '50px', // used
    '80px': '80px', // used
    '160px': '160px',
    full: '100%',
    screen: '100vh',

    // Roman
    'vp-screen-minus-header': 'calc(100vh - 84px - 100px)',
    'vp-screen-minus-header-md': 'calc(100vh - 65px)',
    'vp-screen-only-header': 'calc(100vh - 84px)',
    'vp-screen-pagination': 'calc(94vh - 84px - 20px - 100px)',
    'vp-listing-notification': 'calc(98vh - 84px - 494px - 87px)',
    'vp-listing-notification-sm': 'auto',
    'vp-edit-button': '28px',
    'vp-image-height': '380px',
    'vp-image-height-sm': '320px',
    // /Roman
  },

  /*
  |-----------------------------------------------------------------------------
  | Minimum width                        https://tailwindcss.com/docs/min-width
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your minimum width utility sizes. These can
  | be percentage based, pixels, rems, or any other units. We provide a
  | couple common use-cases by default. You can, of course, modify
  | these values as needed.
  |
  | Class name: .min-w-{size}
  | CSS property: min-width
  |
  */

  minWidth: {
    '0': '0',
    '6': '1.5rem', // 24px used
    '7': '1.875rem', // 30px used
    '8': '2rem', // 32px
    '13': '3.25rem', // 52px used
    '16': '4rem', // 64px used
    '32': '8rem', // 128px used
    '1/5': '20%',
    '1/4': '25%',
    '120px': '120px',
    '290px': '290px', // 290px used
    '650px': '650px',
    full: '100%',
  },

  /*
  |-----------------------------------------------------------------------------
  | Minimum height                      https://tailwindcss.com/docs/min-height
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your minimum height utility sizes. These can
  | be percentage based, pixels, rems, or any other units. We provide a
  | few common use-cases by default. You can, of course, modify these
  | values as needed.
  |
  | Class name: .min-h-{size}
  | CSS property: min-height
  |
  */

  minHeight: {
    '0': '0',
    '160': '160px', // used
    '7': '1.875rem', // 30px
    '11': '2.75rem', // 44px used
    '15.5': '3.75rem', // 60px used
    '17.5': '4.5rem', // 72px used
    '13': '3.25rem', // used
    '50px': '50px', // used
    '160px': '160px', // used
    '300px': '300px', // used
    full: '100%',
    screen: '100vh',
  },

  /*
  |-----------------------------------------------------------------------------
  | Maximum width                        https://tailwindcss.com/docs/max-width
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your maximum width utility sizes. These can
  | be percentage based, pixels, rems, or any other units. By default
  | we provide a sensible rem based scale and a "full width" size,
  | which is basically a reset utility. You can, of course,
  | modify these values as needed.
  |
  | Class name: .max-w-{size}
  | CSS property: max-width
  |
  */

  maxWidth: {
    '0': '0px',
    '7': '1.875rem', // 30px used
    xs: '20rem',
    sm: '30rem',
    md: '40rem',
    lg: '50rem',
    xl: '60rem',
    '2xl': '70rem',
    '3xl': '80rem',
    '4xl': '90rem',
    '5xl': '100rem',
    '1/2': '50%',
    '1/2-margin': 'calc( 50% - 0.3125rem )',
    'h-full': '50%',
    'full-margin': 'calc( 100% - 1.25rem )',
    full: '100%',
    'vp-cart-competition': '720px',
    'vp-cart-competition-2': '690px',
    'vp-amen-btn-width': '194px',
    'vp-modal-map-width': '540px',
  },

  /*
  |-----------------------------------------------------------------------------
  | Maximum height                      https://tailwindcss.com/docs/max-height
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your maximum height utility sizes. These can
  | be percentage based, pixels, rems, or any other units. We provide a
  | couple common use-cases by default. You can, of course, modify
  | these values as needed.
  |
  | Class name: .max-h-{size}
  | CSS property: max-height
  |
  */

  maxHeight: {
    '0': '0px',
    full: '100%',
    screen: '100vh',
    '35-screen': '35vh',
    'half-screen': '50vh',
    '4': '1em',
    '17': '4.25rem', // 68px used
    '24': '6rem',
    '50px': '50px',

    //Roman
    'vp-info-popup': '230px',
  },

  /*
  |-----------------------------------------------------------------------------
  | Padding                                https://tailwindcss.com/docs/padding
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your padding utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default we
  | provide a sensible rem based numeric scale plus a couple other
  | common use-cases like "1px". You can, of course, modify these
  | values as needed.
  |
  | Class name: .p{side?}-{size}
  | CSS property: padding
  |
  */

  padding: {
    px: '1px',
    '0': '0',
    '1': '0.25rem',
    '1.5': '0.375rem', // 6px used
    '2': '0.5rem',
    '2.5': '0.625rem', // 10px used
    '3': '0.75rem', // 12px used
    '3.5': '0.875rem', // 14px used
    '3.75': '0.9375rem', //15px used
    '4': '1rem',
    '5': '1.25rem', // 20px used
    '6': '1.5rem', // 24px used
    '7': '1.875rem', // 30px used
    '8': '2rem', // 32px used
    '9': '2.125rem', // 34px used
    '10': '2.5rem', // 40px used
    '12': '3rem', // 48px
    '14': '3.5rem', // 56px used
    '15.5': '3.75rem', // 60px used
    '16': '4rem',
    '17': '4.325rem', // 70px used
    '18': '5.25rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '50px': '50px', // 50px used
  },

  /*
  |-----------------------------------------------------------------------------
  | Margin                                  https://tailwindcss.com/docs/margin
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your margin utility sizes. These can be
  | percentage based, pixels, rems, or any other units. By default we
  | provide a sensible rem based numeric scale plus a couple other
  | common use-cases like "1px". You can, of course, modify these
  | values as needed.
  |
  | Class name: .m{side?}-{size}
  | CSS property: margin
  |
  */

  margin: {
    auto: 'auto',
    px: '1px',
    '2px': '2px',
    '0': '0',
    '0.5': '0.2rem',
    '1': '0.25rem', // 4px used
    '1.5': '.375rem', //
    '2': '0.5rem',
    '2.5': '0.625rem', // 10px used
    '3': '0.75rem', // 12px used
    '3.5': '0.875rem', // 14px used
    '4': '1rem',
    '4.5': '1.125rem', // used
    '5': '1.25rem', // 20px used
    '5.5': '1.375rem', // 22px used
    '6': '1.5rem', // 24px used
    '7': '1.875rem', // 30px used
    '8': '2rem', // 32px used
    '10': '2.5rem', // 40px used
    '12': '3rem',
    '16': '4rem',
    '18': '5.25rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '33': '8.25rem',
    '50px': '50px', // 50px used
  },

  /*
  |-----------------------------------------------------------------------------
  | Negative margin                https://tailwindcss.com/docs/negative-margin
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your negative margin utility sizes. These can
  | be percentage based, pixels, rems, or any other units. By default we
  | provide matching values to the padding scale since these utilities
  | generally get used together. You can, of course, modify these
  | values as needed.
  |
  | Class name: .-m{side?}-{size}
  | CSS property: margin
  |
  */

  negativeMargin: {
    px: '1px',
    '0': '0',
    '1': '0.25rem',
    '2': '0.5rem',
    '2.5': '0.625rem', // 10px used
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '33': '8.25rem',
    '17.5%': '17.5%',
  },

  /*
  |-----------------------------------------------------------------------------
  | Shadows                                https://tailwindcss.com/docs/shadows
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your shadow utilities. As you can see from
  | the defaults we provide, it's possible to apply multiple shadows
  | per utility using comma separation.
  |
  | If a `default` shadow is provided, it will be made available as the non-
  | suffixed `.shadow` utility.
  |
  | Class name: .shadow-{size?}
  | CSS property: box-shadow
  |
  */

  shadows: {
    default: '0 2px 4px 0 rgba(0,0,0,0.10)', // used
    md: '0 4px 8px 0 rgba(0,0,0,0.12), 0 2px 4px 0 rgba(0,0,0,0.08)', // used
    lg: '0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08)', // used
    inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
    outline: '0 0 0 3px rgba(52,144,220,0.5)',
    none: 'none',

    //Roman
    'vp-header': '0px 2px 4px 0px rgba( 85, 88, 98, 0.1 )',
    'vp-dropdown': '0px 12px 24px 0px rgba( 85, 88, 98, 0.2 )',
    'vp-login': '0 3px 8px 0 rgba(29, 111, 220, 0.35)',
    'vp-default': '0px 2px 4px 0px rgba( 85, 88, 98, 0.1 )',
    'vp-hover': '0px 3px 6px 0px rgba( 85, 88, 98, 0.15 )',
    'vp-shallow': '0px 1px 0px 0px rgba( 85, 88, 98, 0.1 )',
    'vp-myList': '-2px 0 4px 0 rgba(85, 88, 98, 0.1)',
    'vp-settings-form': '0px 4px 8px rgba(85, 88, 98, 0.2 )',
    'vp-settings-form-hover': '0px 7px 12px rgba(85, 88, 98, 0.3 )',
    'vp-competition-hover': '0 2px 20px 0 rgba(85, 88, 98, 0.6)',
    'vp-competition-button': '0 3px 8px 0 rgba(29, 111, 220, 0.35)',
    'vp-blue': '0px 3px 8px 0px rgba( 29, 111, 220, 0.35 )',
    'vp-blue-active': '0px 4px 10px 0px rgba( 29, 111, 220, 0.45 )',
    'vp-red': '0px 2px 3px 0px rgba( 255, 90, 95, 0.3 )',
    'vp-cal-hover': '0px 1px 10px 0px rgba(85, 88, 98, 0.3)',
    'vp-map-card': '0 1px 10px 0 rgba(85, 88, 98, 0.3)',

    //  Reviews
    'reviews-water-blue': '0 2px 4px 0 rgba(29, 111, 220, 0.35)',
  },

  /*
  |-----------------------------------------------------------------------------
  | Z-index                                https://tailwindcss.com/docs/z-index
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your z-index utility values. By default we
  | provide a sensible numeric scale. You can, of course, modify these
  | values as needed.
  |
  | Class name: .z-{index}
  | CSS property: z-index
  |
  */

  zIndex: {
    auto: 'auto',
    '0': 0,
    '10': 10,
    '20': 20,
    '30': 30,
    '40': 40,
    '50': 50,
    '1001': 1001,
    '1050': 1050,
  },

  /*
  |-----------------------------------------------------------------------------
  | Opacity                                https://tailwindcss.com/docs/opacity
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your opacity utility values. By default we
  | provide a sensible numeric scale. You can, of course, modify these
  | values as needed.
  |
  | Class name: .opacity-{name}
  | CSS property: opacity
  |
  */

  opacity: {
    '0': '0',
    '3': '.3',
    '15': '.15',
    '20': '.20',
    '30': '.30',
    '25': '.25',
    '60': '.6', // used
    '50': '.5', // used
    '75': '.75', // used
    '80': '.8', // used
    '100': '1',
  },

  /*
  |-----------------------------------------------------------------------------
  | SVG fill                                   https://tailwindcss.com/docs/svg
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your SVG fill colors. By default we just provide
  | `fill-current` which sets the fill to the current text color. This lets you
  | specify a fill color using existing text color utilities and helps keep the
  | generated CSS file size down.
  |
  | Class name: .fill-{name}
  | CSS property: fill
  |
  */

  svgFill: {
    current: 'currentColor',
  },

  /*
  |-----------------------------------------------------------------------------
  | SVG stroke                                 https://tailwindcss.com/docs/svg
  |-----------------------------------------------------------------------------
  |
  | Here is where you define your SVG stroke colors. By default we just provide
  | `stroke-current` which sets the stroke to the current text color. This lets
  | you specify a stroke color using existing text color utilities and helps
  | keep the generated CSS file size down.
  |
  | Class name: .stroke-{name}
  | CSS property: stroke
  |
  */

  svgStroke: {
    current: 'currentColor',
  },

  /*
  |-----------------------------------------------------------------------------
  | Modules                  https://tailwindcss.com/docs/configuration#modules
  |-----------------------------------------------------------------------------
  |
  | Here is where you control which modules are generated and what variants are
  | generated for each of those modules.
  |
  | Currently supported variants:
  |   - responsive
  |   - hover
  |   - focus
  |   - focus-within
  |   - active
  |   - group-hover
  |
  | To disable a module completely, use `false` instead of an array.
  |
  */

  modules: {
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColors: ['responsive', 'hover', 'focus'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderCollapse: [],
    borderColors: ['responsive', 'hover', 'focus'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidths: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive'],
    flexbox: ['responsive'],
    float: ['responsive'],
    fonts: ['responsive'],
    fontWeights: ['responsive', 'hover', 'focus'],
    height: ['responsive'],
    leading: ['responsive'],
    lists: ['responsive'],
    margin: ['responsive'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    negativeMargin: ['responsive'],
    objectFit: ['responsive', 'hover', 'focus', 'active', 'group-hover'],
    objectPosition: false,
    opacity: ['responsive', 'hover'],
    outline: ['focus'],
    overflow: ['responsive'],
    padding: ['responsive'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    shadows: ['responsive', 'hover', 'focus'],
    svgFill: [],
    svgStroke: [],
    tableLayout: ['responsive'],
    textAlign: ['responsive'],
    textColors: ['responsive', 'hover', 'group-hover', 'focus'],
    textSizes: ['responsive'],
    textStyle: ['responsive', 'hover', 'focus'],
    tracking: ['responsive'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive'],
    zIndex: ['responsive', 'hover'],
  },

  /*
  |-----------------------------------------------------------------------------
  | Plugins                                https://tailwindcss.com/docs/plugins
  |-----------------------------------------------------------------------------
  |
  | Here is where you can register any plugins you'd like to use in your
  | project. Tailwind's built-in `container` plugin is enabled by default to
  | give you a Bootstrap-style responsive container component out of the box.
  |
  | Be sure to view the complete plugin documentation to learn more about how
  | the plugin system works.
  |
  */

  plugins: [
    require('tailwindcss/plugins/container')({
      // center: true,
      // padding: '1rem',
    }),
  ],

  /*
  |-----------------------------------------------------------------------------
  | Advanced Options         https://tailwindcss.com/docs/configuration#options
  |-----------------------------------------------------------------------------
  |
  | Here is where you can tweak advanced configuration options. We recommend
  | leaving these options alone unless you absolutely need to change them.
  |
  */

  options: {
    prefix: '',
    important: false,
    separator: ':',
  },
};
