import { Chart } from 'react-chartjs-2';

const leftAlignYTicks = ({ axisRef }) => {
  if (axisRef == null) {
    return {};
  }

  return {
    afterDraw: (chart, easing) => {
      const ctx = chart.ctx;
      const targetCtx =
        axisRef === 'chart' ? ctx : axisRef.current.getContext('2d');
      const yAxis = chart.scales['y-axis-0'];

      if (axisRef !== 'chart') {
        targetCtx.canvas.width = ctx.canvas.width;
        targetCtx.canvas.height = ctx.canvas.height;
      }

      const yPosTextMargin = -4;

      // loop through ticks array
      Chart.helpers.each(yAxis.ticks, function(tick, index) {
        if (tick === null) return;

        var xPos = yAxis.right;
        var yPos = yAxis.getPixelForTick(index);
        var xPadding = 8;

        targetCtx.save();

        targetCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
        //  Draw text
        targetCtx.shadowBlur = 0;
        //  Text Color
        targetCtx.fillStyle = '#AFB3C0';
        targetCtx.font = '600 5px Montserrat';
        targetCtx.fontStyle = 'bold';
        targetCtx.textAlign = 'left';
        //  Draw text component of tick
        targetCtx.fillText(
          tick,
          xPos + xPadding + 4,
          yPos / 2 + yPosTextMargin
        );

        targetCtx.restore();
      });
    },
  };
};

export default leftAlignYTicks;
