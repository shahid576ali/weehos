$(document).ready(function () {
    const modal = $("#edit-profile-modal");
    const closeBtn = $(".close-btn");

    $("#edit-profile-icon").on("click", function () {
        modal.show();
        $("#edit-name").val("Mandeep Singh");
        $("#edit-email").val("mandeep@example.com");
        $("#edit-location").val("New Delhi, India");
        const bioContent = "💕🎶Improve yourself daily🎶💕";
        const bioTextarea = $("#edit-bio");
        bioTextarea.val(bioContent);
        bioTextarea.trigger("input");
    });

    closeBtn.on("click", function () {
        modal.hide();
    });

    $(window).on("click", function (event) {
        if ($(event.target).is(modal)) {
            modal.hide();
        }
    });

    $("#edit-profile-form").on("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        $.ajax({
            type: "POST",
            url: "php/artistprofileupdate.php",
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                console.log("Update Response:", response);
                if (response.trim() === "ok") {
                    alert("Profile updated successfully!");
                    location.reload();
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
