const addInvert = (context, video, width, height) => {
    context.drawImage(video, 0, 0, width, height);
    let idata = context.getImageData(0, 0, width, height);
    let imageDataFiltered = invertColor(idata);
    context.putImageData(imageDataFiltered, 0, 0);
};

function invertColor(imageData) {
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = 150 - pixels[i];
        pixels[i + 1] = 150 - pixels[i + 1];
        pixels[i + 2] = 150 - pixels[i + 2];
    }
    return imageData;
}
