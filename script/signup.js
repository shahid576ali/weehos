document.querySelector("form").addEventListener("submit", handleSignup);

function toggleFields() {
    const userType = document.getElementById("user_type").value;
    document.getElementById("adminFields").classList.toggle("hidden", userType !== "admin");
    document.getElementById("artistFields").classList.toggle("hidden", userType !== "artist");
}

function handleSignup(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("php/signup.php", {
        method: "POST",
        body: new URLSearchParams({ firstName, email, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = "signin.html"; // Redirect to sign-in
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
