const myAspectRatio = 16 / 3;
let images = JSON.parse(localStorage.getItem('images/cover')) || [];

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('image-form');
    const tableBody = document.getElementById('image-table-body');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('full-size-image');
    const closeBtn = document.getElementsByClassName('close')[0];
    const cropperContainer = document.getElementById('cropper-container');
    const cropperImage = document.getElementById('cropper-image');
    const cropButton = document.getElementById('crop-button');
    const fileInput = document.getElementById('image-upload');
    const imageAltInput = document.getElementById('image-alt');

    let cropper;

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                cropperImage.src = e.target.result;
                cropperContainer.style.display = 'block';
                cropButton.style.display = 'block';
                if (cropper) {
                    cropper.destroy();
                }
                cropper = new Cropper(cropperImage, {
                    aspectRatio: myAspectRatio,
                    viewMode: 1,
                });
            };
            reader.readAsDataURL(file);
        }
    });

    cropButton.addEventListener('click', function () {
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas({
                width: 938,
                height: 528
            });
            const croppedImage = croppedCanvas.toDataURL('image/jpeg');
            cropperContainer.style.display = 'none';
            fileInput.value = '';
            addImageToList(croppedImage);
        } else {
            console.error('Cropper is not initialized');
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm()) {
            const croppedImage = cropper.getCroppedCanvas({
                width: 938,
                height: 528
            }).toDataURL('image/jpeg');
            addImageToList(croppedImage);
            submitForm();
        }
    });

    function validateForm() {
        if (!imageAltInput.value.trim()) {
            alert('Please enter an image description.');
            imageAltInput.focus();
            return false;
        }
        return true;
    }

    function addImageToList(imageSrc) {
        const alt = imageAltInput.value.trim();
        if (imageSrc && alt) {
            const imagePath = `images/cover/HomeCover_${Math.floor(Date.now() / 1000)}.jpg`;
            images.push({ src: imagePath, alt, show: true });
            renderTable();
            form.reset();
        }
    }

    function saveImages() {
        localStorage.setItem('images/cover', JSON.stringify(images));
    }

    function submitForm() {
        const formData = new FormData(form);
        fetch('coverimage.php', {
            method: 'POST',
            body: formData
        }).then(response => response.json()).then(data => {
            if (data.status === 'success') {
                console.log('Image uploaded successfully');
                console.log(data);
                const latestImage = images[images.length - 1];
                latestImage.src = data.src;
                saveImages();
                renderTable();
            } else {
                console.error('Upload failed: ' + data.message);
            }
        }).catch(error => console.error('Error:', error));
    }

    function renderTable() {
        tableBody.innerHTML = '';
        images.forEach((image, index) => {
            const row = tableBody.insertRow();
            const cellImage = row.insertCell(0);
            const cellAlt = row.insertCell(1);
            const cellActions = row.insertCell(2);

            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            img.className = 'thumbnail';
            img.onclick = () => openModal(image.src);
            cellImage.appendChild(img);

            cellAlt.textContent = image.alt;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '✗';
            deleteBtn.style.background = 'red';
            deleteBtn.onclick = () => deleteImage(index);
            cellActions.appendChild(deleteBtn);

            const updateBtn = document.createElement('button');
            updateBtn.textContent = '✎';
            updateBtn.style.backgroundColor = 'green';
            updateBtn.onclick = () => updateImage(index);
            cellActions.appendChild(updateBtn);

            const moveUpBtn = document.createElement('button');
            moveUpBtn.textContent = '⬆';
            moveUpBtn.style.background = 'linear-gradient(to top, #222539, gray)';
            moveUpBtn.onclick = () => moveImageUp(index);
            cellActions.appendChild(moveUpBtn);

            const moveDownBtn = document.createElement('button');
            moveDownBtn.textContent = '⬇';
            moveDownBtn.style.background = 'linear-gradient(to bottom, #222539, gray)';
            moveDownBtn.onclick = () => moveImageDown(index);
            cellActions.appendChild(moveDownBtn);

            const showHideBtn = document.createElement('button');
            showHideBtn.textContent = image.show ? 'Hide' : 'Show';
            showHideBtn.style.backgroundColor = image.show ? 'red' : 'green';
            showHideBtn.onclick = () => toggleShowHide(index);
            cellActions.appendChild(showHideBtn);
        });
    }

    function toggleShowHide(index) {
        images[index].show = !images[index].show;
        saveImages();
        renderTable();
    }

    function deleteImage(index) {
        images.splice(index, 1);
        saveImages();
        renderTable();
    }

    function updateImage(index) {
        fileInput.onchange = function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    cropperImage.src = e.target.result;
                    cropperContainer.style.display = 'block';
                    cropButton.style.display = 'block';
                    if (cropper) {
                        cropper.destroy();
                    }
                    cropper = new Cropper(cropperImage, {
                        aspectRatio: myAspectRatio,
                        viewMode: 1,
                    });
                    cropButton.onclick = function () {
                        const croppedCanvas = cropper.getCroppedCanvas({
                            width: 938,
                            height: 528
                        });
                        const croppedImage = croppedCanvas.toDataURL('image/jpeg');
                        const imagePath = `images/cover/HomeCover_${Math.floor(Date.now() / 1000)}.jpg`;
                        images[index].src = imagePath;
                        saveImages();
                        renderTable();
                        cropperContainer.style.display = 'none';
                        fileInput.value = '';
                    };
                };
                reader.readAsDataURL(file);
            }
        };
        fileInput.click();
    }

    function moveImageUp(index) {
        if (index > 0) {
            [images[index - 1], images[index]] = [images[index], images[index - 1]];
            saveImages();
            renderTable();
        }
    }

    function moveImageDown(index) {
        if (index < images.length - 1) {
            [images[index], images[index + 1]] = [images[index + 1], images[index]];
            saveImages();
            renderTable();
        }
    }

    function openModal(src) {
        modal.style.display = 'block';
        modalImg.src = src;
    }

    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    renderTable();
});
