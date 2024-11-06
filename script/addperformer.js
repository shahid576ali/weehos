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
                    alert("okdfd");
                    window.location.href = 'profile.html';
                } else {
                    alert(response.trim());
                    location.reload();
                }
            }
        });
    });
});