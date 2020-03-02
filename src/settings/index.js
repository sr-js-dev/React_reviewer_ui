export default {
  apiUrl: 'http://yoursite.com/api/',
};
const siteConfig = {
  siteName: 'VP Insight beta',
  siteIcon: 'ion-flash',
  footerText: 'VP Insight ©2018',
};

const themeConfig = {
  topbar: 'themedefault',
  sidebar: 'themedefault',
  layout: 'themedefault',
  theme: 'themedefault',
};
const language = 'english';
const AlgoliaSearchConfig = {
  appId: '',
  apiKey: '',
};
const googleConfig = {
  apiKey: 'AIzaSyCj_QOeXN4U3RxGm_nozRAXRqac0xgs2Cg',
  styles: [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e9e9e9',
        },
        {
          lightness: 17,
        },
      ],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f5f5',
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#ffffff',
        },
        {
          lightness: 17,
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#ffffff',
        },
        {
          lightness: 29,
        },
        {
          weight: 0.2,
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff',
        },
        {
          lightness: 18,
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff',
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f5f5',
        },
        {
          lightness: 21,
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dedede',
        },
        {
          lightness: 21,
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          visibility: 'on',
        },
        {
          color: '#ffffff',
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          saturation: 36,
        },
        {
          color: '#333333',
        },
        {
          lightness: 40,
        },
      ],
    },
    {
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f2f2f2',
        },
        {
          lightness: 19,
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#fefefe',
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#fefefe',
        },
        {
          lightness: 17,
        },
        {
          weight: 1.2,
        },
      ],
    },
  ],
};
const mapboxConfig = {
  tileLayer: '',
  maxZoom: '',
  defaultZoom: '',
  center: [],
};

const SVG_STAR = `M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
C22.602,0.567,25.338,0.567,26.285,2.486z`;

const DISMISS_TIMEOUT = 5000;

const MODAL_CLOSE_CLASSNAME =
  'leading-normal block z-20 reviews__modal-close absolute pin-r pin-t w-9 h-9 bg-black-50 rounded-full flex justify-center items-center text-white hover:text-white hover:bg-black short-bg-transition text-xs -mt-5 -mr-4';

export {
  siteConfig,
  themeConfig,
  language,
  AlgoliaSearchConfig,
  googleConfig,
  mapboxConfig,
  SVG_STAR,
  DISMISS_TIMEOUT,
  MODAL_CLOSE_CLASSNAME,
};
