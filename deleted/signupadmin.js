document.querySelector("form").addEventListener("submit", handleSignup);

function handleSignup(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const adminKey = document.getElementById("adminKey").value;

    fetch("php/adminsignup.php", {
        method: "POST",
        body: new URLSearchParams({ fullName, email, password, adminKey }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = "signinadmin.html"; // Redirect to admin sign in page
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error("Error:", error));
}
