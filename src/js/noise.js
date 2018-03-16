const addNoise = (bgContext, context, width, height) => {
    let idata = bgContext.createImageData(width, height);
    let buffer32 = new Uint32Array(idata.data.buffer);
    let len = buffer32.length;
    let i = 0;

    while (i < len) {
        buffer32[i++] = ((100 * Math.random())|0) << 24;
    }
    context.putImageData(idata, 0, 0);
};
