<?php
include 'db.php';
session_start();

$email = $_POST['email'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT artist_id, password, artistName FROM artists WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $artist = $result->fetch_assoc();
    if (password_verify($password, $artist['password'])) {
        $_SESSION['artist_id'] = $artist['artist_id'];
        $_SESSION['artistName'] = $artist['artistName'];
        echo json_encode(["success" => true, "message" => "Artist login successful!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password!"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Email not registered!"]);
}

$stmt->close();
$conn->close();
?>
