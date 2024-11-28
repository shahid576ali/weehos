<?php
include 'db.php';

$firstName = $_POST['firstName'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (firstName, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $firstName, $email, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Email already exists!"]);
}

$stmt->close();
$conn->close();
?>
