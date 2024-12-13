$(document).ready(function () {
    $("#addperformer").on('submit', function (e) {
        e.preventDefault();

        const imageInput = $('#image')[0];
        if (imageInput.files.length > 0) {
            const fileSize = imageInput.files[0].size;
            if (fileSize > 1048576) { // 1 MB = 1048576 bytes
                alert("Image size must be less than 1 MB.");
                return;
            }
        }

        console.log("Form submitted");
        $.ajax({
            type: 'POST',
            url: 'php/addperformer.php',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (response) {
                console.log("Response received:", response);
                if (response.trim() === 'ok') {
                    alert("Performer added successfully!");
                    window.location.href = 'profile.html';
                } else {
                    alert(response.trim());
                    location.reload();
                }
            }
        });
    });

    $("#area_of_talent").on('change', function () {
        if ($(this).val() === "Others") {
            $("#other_talent_div").show();
        } else {
            $("#other_talent_div").hide();
        }
    });
});
