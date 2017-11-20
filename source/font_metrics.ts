/** Computes the width of a string.
   @param text - The text to compute the width for.
   @param font - The font to use.
   @return The width in pixels of the specified text.
*/
function computeWidth(text: string, font: string): number {
  var canvas = document.createElement('canvas') as HTMLCanvasElement;
  var context = canvas.getContext('2d');
  if(font.length != 0) {
    context.font = font;
  }
  var metrics = context.measureText(text);
  return metrics.width;
}

/** Computes the height of a string.
   @param text - The text to compute the height for.
   @param font - The font to use.
   @return The height in pixels of the specified text.
*/
function computeHeight(text: string, font: string,
    canvasWidth: number = 50, canvasHeight: number = 50): number {
  var canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.setAttribute('width', `${canvasWidth}`);
  canvas.setAttribute('height', `${canvasHeight}`);
  var context = canvas.getContext('2d');
  if(font.length != 0) {
    context.font = font;
  }
  let maxHeight = 0;
  let maxWidth = 0;
  context.textBaseline = 'top';
  for(let i = 0; i < text.length; ++i) {
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = '#000000';
    context.fillText(text[i], 0, 0);
    let image = context.getImageData(0, 0, canvasWidth, canvasHeight);
    let yMin = canvasHeight + 1;
    let yMax = -1;
    let pixels = image.data;
    for(let y = 0; y < image.height; ++y) {
      for(let x = 0; x < image.width; ++x) {
        let coordinate = 4 * (y * image.width + x);
        if(pixels[coordinate] != 255) {
          yMin = Math.min(yMin, y);
          yMax = y;
        }
      }
    }
    if(yMax != -1) {
      maxHeight = Math.max(maxHeight, 1 + yMax - yMin);
    }
  }
  let revisedWidth = canvasWidth;
  let revisedHeight = canvasHeight;
  if(maxWidth == canvasWidth) {
    revisedWidth = 2 * canvasWidth;
  }
  if(maxHeight == canvasHeight) {
    revisedHeight = 2 * canvasHeight;
  }
  if(revisedWidth != canvasWidth || revisedHeight != canvasHeight) {
    return computeHeight(text, font, revisedWidth, revisedHeight);
  }
  return maxHeight;
}

export {computeWidth, computeHeight};
