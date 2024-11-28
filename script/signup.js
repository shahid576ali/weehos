document.querySelector("form").addEventListener("submit", handleSignup);

function handleSignup(event) {
    event.preventDefault();
    const firstName = document.getElementById("firstName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:5501/php/signup.php", {
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
