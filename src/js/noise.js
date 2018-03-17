const addNoise = (bgContext, context, width, height) => {
    let idata = bgContext.createImageData(width, height);
    let buffer32 = new Uint32Array(idata.data.buffer);
    let len = buffer32.length;

    let pr = 456 * Math.random();
    let prs = 716 * Math.random();

    for (let i = 0; i < len; i++) {
        buffer32[i] = (((pr % 255)|0) << 24) | 0x440000;
        pr += prs * 1.2;
    }
    context.putImageData(idata, 0, 0);
};

// const addNoise = (bgContext, context, width, height) => {
//     let idata = bgContext.createImageData(width, height);
//     let buffer32 = new Uint32Array(idata.data.buffer);
//     let len = buffer32.length;
//     let i = 0;

//     while (i < len) {
//         buffer32[i++] = ((100 * Math.random())|0) << 24;
//     }
//     context.putImageData(idata, 0, 0);
// };
