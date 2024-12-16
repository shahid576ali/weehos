var bs_modal,
    image,
    cropper,
    reader,
    file,
    targetImageId;

// Maximum file size in bytes (1 MB)
const MAX_FILE_SIZE = 1 * 1024 * 1024; 

$("body").on("change", ".image", function (e) {
    var files = e.target.files;
    var errorElement;

    if (e.target.id === "posterImage") {
        errorElement = document.getElementById("posterImageError");
    } else if (e.target.id === "coverImage") {
        errorElement = document.getElementById("coverImageError");
    }

    // Reset error state
    if (errorElement) {
        errorElement.style.display = "none";
    }

    if (files && files.length > 0) {
        file = files[0];

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            if (errorElement) {
                errorElement.style.display = "inline";
            }
            e.target.value = ""; // Clear the input value to prevent invalid uploads
            return;
        }

        var done = function (url) {
            image.src = url;
            bs_modal.modal("show");
        };

        targetImageId = e.target.id;

        if (targetImageId === "posterImage") {
            bs_modal = $("#posterModal");
            image = document.getElementById("posterImagePreview");
        } else if (targetImageId === "coverImage") {
            bs_modal = $("#coverModal");
            image = document.getElementById("coverImagePreview");
        }

        if (URL) {
            done(URL.createObjectURL(file));
        } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function (e) {
                done(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
});

$(".modal")
    .on("shown.bs.modal", function () {
        if (targetImageId === "posterImage") {
            cropper = new Cropper(image, {
                aspectRatio: 4 / 5,
                viewMode: 3,
                preview: ".preview",
            });
        } else if (targetImageId === "coverImage") {
            cropper = new Cropper(image, {
                aspectRatio: 16 / 6,
                viewMode: 3,
                preview: ".preview",
            });
        }
    })
    .on("hidden.bs.modal", function () {
        cropper.destroy();
        cropper = null;
    });

$("#cropPoster").click(function () {
    var canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 375,
    });

    canvas.toBlob(function (blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            var base64data = reader.result;
            $("#posterImageData").val(base64data);
            $("#posterModal").modal("hide");
        };
    });
});

$("#cropCover").click(function () {
    var canvas = cropper.getCroppedCanvas({
        width: 600,
        height: 225,
    });

    canvas.toBlob(function (blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            var base64data = reader.result;
            $("#coverImageData").val(base64data);
            $("#coverModal").modal("hide");
        };
    });
});
