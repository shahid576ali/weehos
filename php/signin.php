<?php
include 'db.php';
session_start();

$email = $_POST['email'];
$password = $_POST['password'];
$user_type = $_POST['user_type'];

$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ? AND user_type = ?");
$stmt->bind_param("ss", $email, $user_type);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_type'] = $user_type;

        if ($user_type === 'admin') {
            $adminkey = $_POST['adminkey'];
            $adminStmt = $conn->prepare("SELECT admin_id FROM admins WHERE user_id = ? AND adminkey = ?");
            $adminStmt->bind_param("is", $user['id'], $adminkey);
            $adminStmt->execute();
            if ($adminStmt->get_result()->num_rows === 0) {
                echo json_encode(["success" => false, "message" => "Invalid admin key!"]);
                exit;
            }
        }

        echo json_encode(["success" => true, "message" => "Login successful!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password!"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Email not registered!"]);
}

$stmt->close();
$conn->close();
?>
