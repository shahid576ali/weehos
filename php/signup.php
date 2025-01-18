<?php
include 'db.php';

$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$user_type = $_POST['user_type'];

$conn->begin_transaction();

try {
    $stmt = $conn->prepare("INSERT INTO users (name, email, phone, password, user_type) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $email, $phone, $password, $user_type);
    $stmt->execute();
    $user_id = $stmt->insert_id;

    if ($user_type === 'admin') {
        $organization = $_POST['organization'];
        $adminkey = $_POST['adminkey'];
        $adminStmt = $conn->prepare("INSERT INTO admins (user_id, organization, adminkey) VALUES (?, ?, ?)");
        $adminStmt->bind_param("iss", $user_id, $organization, $adminkey);
        $adminStmt->execute();
    } elseif ($user_type === 'artist') {
        $genre = $_POST['genre'];
        $bio = $_POST['bio'];
        $artistStmt = $conn->prepare("INSERT INTO artists (user_id, genre, bio) VALUES (?, ?, ?)");
        $artistStmt->bind_param("iss", $user_id, $genre, $bio);
        $artistStmt->execute();
    }

    $conn->commit();
    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
