const collection = document.querySelector('.photo-collection');
const snap = document.querySelector('.snap');
const button = document.querySelector('.button-foto');

const takePhoto = (canvas) => {
    let img = document.querySelectorAll('.photo-img');
    if (img.length>5) {
        img[0].remove();
    }
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.classList.add('photo');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img class="photo-img" src="${data}" alt="Handsome Man" />`;
    collection.insertBefore(link, collection.firsChild);
};
