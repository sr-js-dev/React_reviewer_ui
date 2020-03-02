import _ from 'lodash';

const textAbovePointPlugin = {
  afterDraw: (chart, easing) => {
    //  Options
    const {
      points: pointsText,
      fillStyle,
      textAlign,
      font,
    } = chart.options.plugins.textAbovePointPlugin;

    const ctx = chart.ctx;
    const points = chart.config.data.datasets[0].data;

    const xAxis = chart.scales['x-axis-0'];
    const yAxis = chart.scales['y-axis-0'];

    _.each(points, function(value, index) {
      if (!value || !String(pointsText[index])) {
        return;
      }

      const yPos = yAxis.getPixelForValue(value, index, 0);
      const xPos = xAxis.getPixelForValue(value, index, 0);
      const text = `+${pointsText[index]}`;

      //  Draw text
      ctx.fillStyle = fillStyle;
      ctx.textAlign = textAlign;
      ctx.font = font;

      ctx.fillText(text, xPos, yPos - 10);
    });
  },
};

export default textAbovePointPlugin;
