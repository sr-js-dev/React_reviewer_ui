const tailwindcss = require('tailwindcss');
const Dotenv = require('dotenv-webpack');
try {
  require('dotenv').config();
} catch (e) {
  console.log('env.js not available');
}

module.exports = {
  style: {
    webpack: {
      plugins: [
        new Dotenv({
          systemvars: true,
        }),
      ],
    },
    css: {
      loaderOptions: (cssLoaderOptions, { env, paths }) => {
        return cssLoaderOptions;
      },
    },
    sass: {
      loaderOptions: {
        data: `$imagesRootURL: "${process.env.IMAGES_URL}"; $fontsRootURL: "${process.env.FONTS_URL}";`,
      },
    },
    postcss: {
      mode: 'extends',
      plugins: [tailwindcss('./src/tailwind.js')],
      env: {
        autoprefixer: {},
        stage: 3,
        features: {},
      },
      loaderOptions: (postcssLoaderOptions, { env, paths }) => {
        return postcssLoaderOptions;
      },
    },
  },
};
