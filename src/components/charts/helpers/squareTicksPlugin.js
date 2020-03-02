import roundedRect from '../../../components/utility/roundedRect';
import { Chart } from 'react-chartjs-2';
import { isMobile } from '../../../redux/app/actions';

const squareTicksPlugin = ({ view, axisRef }) => {
  return {
    afterDraw: (chart, easing) => {
      const mobile = isMobile(view);

      var ctx = chart.ctx;
      var targetCtx = axisRef.current.getContext('2d');
      var yAxis = chart.scales['y-axis-0'];

      targetCtx.canvas.width = ctx.canvas.width;
      targetCtx.canvas.height = ctx.canvas.height;

      // debugger;

      const yPosRectMargin = mobile ? 0 : 0;
      const yPosTextMargin = mobile ? 17.5 : 17.5;

      // loop through ticks array
      Chart.helpers.each(yAxis.ticks, function(tick, index) {
        if (tick === null) return;

        var xPos = yAxis.right;
        var yPos = yAxis.getPixelForTick(index);
        var xPadding = 12;

        targetCtx.save();

        targetCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
        //  Draw rectangle
        //  Rectangle color
        targetCtx.fillStyle = '#FFF';
        targetCtx.shadowColor = 'rgba(85,88,98,0.2)';
        targetCtx.shadowBlur = 6;
        //  Draw rectangle
        roundedRect(
          targetCtx,
          xPos + xPadding,
          yPos + yPosRectMargin,
          64,
          26,
          4,
          {
            fillStyle: '#fff',
            shadowColor: 'rgba(85,88,98,0.2)',
            shadowBlur: 6,
          },
          {
            topRight: true,
            bottomRight: true,
          }
        );

        //  Draw text
        targetCtx.shadowBlur = 0;
        //  Text Color
        targetCtx.fillStyle = '#AFB3C0';
        targetCtx.font = '500 12px Montserrat';
        //  Draw text component of tick
        targetCtx.fillText(tick, xPos + xPadding + 4, yPos + yPosTextMargin);

        targetCtx.restore();
      });
    },
  };
};

export default squareTicksPlugin;
