$(document).ready(function () {
    $("#addperformer").on('submit', function (e) {
        e.preventDefault();
        console.log("Form submitted"); // Log message to ensure the form submission event is triggered
        $.ajax({
            type: 'POST',
            url: 'php/addperformer.php',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (response) {
                console.log("Response received:", response); // Log the response received from the server
                if (response.trim() === 'ok') { // Trim the response to remove any whitespace
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
