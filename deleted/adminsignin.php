<?php
include 'db.php';
session_start();

$email = $_POST['email'];
$password = $_POST['password'];
$adminKey = $_POST['adminKey'];

$stmt = $conn->prepare("SELECT admin_id, password, fullName FROM admins WHERE email = ? AND adminKey = ?");
$stmt->bind_param("ss", $email, $adminKey);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $admin = $result->fetch_assoc();
    if (password_verify($password, $admin['password'])) {
        $_SESSION['admin_id'] = $admin['admin_id'];
        $_SESSION['fullName'] = $admin['fullName'];
        echo json_encode(["success" => true, "message" => "Admin login successful!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password!"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid email or admin key!"]);
}

$stmt->close();
$conn->close();
?>
