<?php
include 'db.php';

$artistName = $_POST['artistName'];
$genre = $_POST['genre'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$bio = $_POST['bio'];

$stmt = $conn->prepare("INSERT INTO artists (artistName, genre, email, password, bio) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $artistName, $genre, $email, $password, $bio);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Artist account created successfully!"]);
} else {
    echo json_encode(["success" => false, "message" => "Email already exists!"]);
}

$stmt->close();
$conn->close();
?>
