const { Jimp } = require('jimp');

async function removeBackground() {
  const image = await Jimp.read('public/images/footer/mascots.png');
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    if (r < 15 && g < 15 && b < 15) {
      this.bitmap.data[idx + 3] = 0;
    }
  });

  await image.write('public/images/footer/mascots_transparent.png');
  console.log('Background removed!');
}

removeBackground().catch(console.error);
