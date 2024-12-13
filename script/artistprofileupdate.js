$(document).ready(function () {
    const modal = $("#edit-profile-modal");
    const closeBtn = $(".close-btn");

    // Open Modal on Clicking the Edit Icon
    $("#edit-profile-icon").on("click", function () {
        modal.show();
        // Pre-fill current data
        $("#edit-name").val("Mandeep Singh"); // Replace with dynamic data
        $("#edit-email").val("mandeep@example.com");
        $("#edit-location").val("New Delhi, India");
        $("#edit-bio").val("💕🎶Improve yourself daily🎶💕");
    });

    // Close Modal
    closeBtn.on("click", function () {
        modal.hide();
    });

    $(window).on("click", function (event) {
        if ($(event.target).is(modal)) {
            modal.hide();
        }
    });

    // Handle Form Submission
    $("#edit-profile-form").on("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);

        $.ajax({
            type: "POST",
            url: "php/updateArtistProfile.php", // PHP script to handle updates
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log("Update Response:", response);
                if (response.trim() === "ok") {
                    alert("Profile updated successfully!");
                    location.reload(); // Refresh page to show updated data
                } else {
                    alert(response.trim());
                }
            },
            error: function () {
                alert("An error occurred while updating the profile.");
            }
        });
    });
});
