document.querySelector("form").addEventListener("submit", handleSignup);

function handleSignup(event) {
    event.preventDefault();

    const artistName = document.getElementById("artistName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const genre = document.getElementById("genre").value;
    const bio = document.getElementById("bio").value;

    fetch("php/artistsignup.php", {
        method: "POST",
        body: new URLSearchParams({ artistName, email, password, genre, bio }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = "signinartist.html"; // Redirect to artist sign in page
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error("Error:", error));
}
