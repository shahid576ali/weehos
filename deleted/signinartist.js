document.querySelector("form").addEventListener("submit", handleSignin);

function handleSignin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("php/artistsignin.php", {
        method: "POST",
        body: new URLSearchParams({ email, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = "index.html"; // Redirect to artist dashboard
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error("Error:", error));
}
