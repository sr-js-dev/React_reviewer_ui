/* eslint-disable */
/**
 * I'll try to make adjustments here to match design
 * sent by Roman
 *
 * ALSO: `-10` value indicates here that value is hidden due to
 * plan restriction. In this case, we should replace that value
 * with placeholder AND make style different (grey-out bars)
 *
 * Essentially
 */
export default function drawRoundedBars() {
  const gradients = this._chart.options.plugins.drawRoundedBars.gradients;
  const gradientMode = this._chart.options.plugins.drawRoundedBars.gradientMode;
  const restrictedImage = this._chart.options.plugins.drawRoundedBars
    .restrictedImage;
  const chartName = this._chart.options.plugins.drawRoundedBars.chartName;

  // console.group( "dataset: " + chartName + "[" + this._datasetIndex + "]" );

  var ctx = this._chart.ctx;
  var vm = this._view;
  var left, right, top, bottom, signX, signY, borderSkipped, radius;
  var borderWidth = vm.borderWidth;

  //  Find value of this bar
  let thisValue = this._chart.config.data.datasets[this._datasetIndex].data[
    this._index
  ];
  //  If it's `-1` – then it's a plan restricted
  let restricted = thisValue === -10;
  // debugger;

  // If radius is less than 0 or is large enough to cause drawing errors a max
  //      radius is imposed. If cornerRadius is not defined set it to 0.
  var cornerRadius = this._chart.config.options.cornerRadius;

  if (cornerRadius < 0 || typeof cornerRadius == 'undefined') {
    cornerRadius = 0;
  }

  if (!vm.horizontal) {
    // bar
    left = vm.x - vm.width / 2;
    right = vm.x + vm.width / 2;
    top = vm.y;
    bottom = vm.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = vm.borderSkipped || 'bottom';
  } else {
    // horizontal bar
    left = vm.base;
    right = vm.x;
    top = vm.y - vm.height / 2;
    bottom = vm.y + vm.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = vm.borderSkipped || 'left';
  }

  // debugger;

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderWidth) {
    // borderWidth shold be less than bar width and bar height.
    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    var halfStroke = borderWidth / 2;
    // Adjust borderWidth when bar top position is near vm.base(zero).
    var borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
    var borderRight =
      right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
    var borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
    var borderBottom =
      bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);
    // not become a vertical line?
    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    // not become a horizontal line?
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Corner points, from bottom-left to bottom-right clockwise
  // | 1 2 |
  // | 0 3 |
  var corners = [[left, bottom], [left, top], [right, top], [right, bottom]];

  // Find first (starting) corner with fallback to 'bottom'
  var borders = ['bottom', 'left', 'top', 'right'];
  var startCorner = borders.indexOf(borderSkipped, 0);
  if (startCorner === -1) {
    startCorner = 0;
  }

  function cornerAt(index) {
    return corners[(startCorner + index) % 4];
  }

  // Draw rectangle from 'startCorner'
  var corner = cornerAt(0);
  ctx.moveTo(corner[0], corner[1]);

  for (var i = 1; i < 4; i++) {
    corner = cornerAt(i);

    var nextCornerId = i + 1;

    if (nextCornerId == 4) {
      nextCornerId = 0;
    }

    var nextCorner = cornerAt(nextCornerId);

    if (restricted && this._datasetIndex === 0) {
      var height = 45;
    } else if (restricted && this._datasetIndex === 1) {
      var height = 60;
    } else {
      var height = Math.round(corners[0][1] - corners[1][1]);
    }

    var width = Math.round(corners[2][0] - corners[1][0]);

    if (restricted) {
      var x = corners[1][0];
      var y = corners[1][1] - height;
    } else {
      var x = corners[1][0];
      var y = corners[1][1];
    }

    var radius = cornerRadius;
    // Fix radius being too large
    if (radius > Math.abs(height) / 2) {
      radius = Math.floor(Math.abs(height) / 2);
    }
    if (radius > Math.abs(width) / 2) {
      radius = Math.floor(Math.abs(width) / 2);
    }

    if (height < 0) {
      // Negative values in a standard bar chart
      var x_tl = x;
      var x_tr = x + width;
      var y_tl = y + height;
      var y_tr = y + height;

      var x_bl = x;
      var x_br = x + width;
      var y_bl = y;
      var y_br = y;

      // Draw
      ctx.moveTo(x_bl + radius, y_bl);
      ctx.lineTo(x_br - radius, y_br);
      ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius);
      ctx.lineTo(x_tr, y_tr + radius);
      ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr);
      ctx.lineTo(x_tl + radius, y_tl);
      ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius);
      ctx.lineTo(x_bl, y_bl - radius);
      ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);
    } else if (width < 0) {
      // Negative values in a horizontal bar chart
      var x_tl = x + width;
      var x_tr = x;
      var y_tl = y;
      var y_tr = y;

      var x_bl = x + width;
      var x_br = x;
      var y_bl = y + height;
      var y_br = y + height;

      // Draw
      ctx.moveTo(x_bl + radius, y_bl);
      ctx.lineTo(x_br - radius, y_br);
      ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius);
      ctx.lineTo(x_tr, y_tr + radius);
      ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr);
      ctx.lineTo(x_tl + radius, y_tl);
      ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius);
      ctx.lineTo(x_bl, y_bl - radius);
      ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);
    } else if (vm.horizontal) {
      //  Positive Values in horizontal bar chart
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      //  Removed radius from bottom corners
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
      );
      // ctx.lineTo(x + radius, y + height);
      ctx.lineTo(x, y + height);
      // ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      // ctx.lineTo(x, y + radius);
      ctx.lineTo(x, y);
      // ctx.quadraticCurveTo(x, y, x + radius, y);
    } else {
      //  Positive Values in standard bar chart
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      //  Removed radius from bottom corners
      // ctx.lineTo(x + width, y + height - radius);
      ctx.lineTo(x + width, y + height);
      // ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      // ctx.lineTo(x + radius, y + height);
      ctx.lineTo(x, y + height);
      // ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    }
  }

  // if ( ( chartName + "[" + this._datasetIndex + "]" ) === "dashboard.expectedRevenue[0]" ) {
  //     debugger;
  // }

  // console.log( "index: " + this._index );
  // console.log( "value: " + thisValue );
  // console.log( "isNan( x ): " + isNaN( x ) );
  // console.log( "isNan( y ): " + isNaN( y ) );
  // console.log( "isNan( height ): " + isNaN( height ) );
  // console.log( "isNan( width ): " + isNaN( width ) );
  // console.log( width, height, x, y );

  if (isNaN(x) || isNaN(y) || isNaN(height) || isNaN(width)) {
    // console.groupEnd();
    return;
  }

  if (restricted) {
    ctx.strokeStyle = '#EFF3F6';
    borderWidth = 1;

    if (this._datasetIndex === 1) {
      ctx.fillStyle = ctx.createPattern(restrictedImage, 'repeat');
    } else {
      ctx.fillStyle = '#fff';
    }
  } else {
    let fillGradient;

    //  Gradient for horizontal bar should end at bar's width
    if (vm.horizontal) {
      fillGradient = ctx.createLinearGradient(x, y, x + width, y);
      //  For vertical bar – at bar's height
    } else {
      fillGradient = ctx.createLinearGradient(x, y + height, x, y);
    }

    if (gradientMode === 'dataset') {
      fillGradient.addColorStop(0, gradients[this._datasetIndex][0]);
      fillGradient.addColorStop(1, gradients[this._datasetIndex][1]);
    } else if (gradientMode === 'label') {
      fillGradient.addColorStop(0, gradients[this._index][0]);
      fillGradient.addColorStop(1, gradients[this._index][1]);
    } else if (gradientMode === 'uniform') {
      fillGradient.addColorStop(0, gradients[0][0]);
      fillGradient.addColorStop(1, gradients[0][1]);
    }

    ctx.fillStyle = fillGradient;
  }

  ctx.fill();

  if (borderWidth) {
    ctx.stroke();
  }

  // console.groupEnd();
}
