<?php
include 'db.php';

$adminKey = $_POST['adminKey'];

$stmt = $conn->prepare("SELECT admin_id FROM admins WHERE adminKey = ?");
$stmt->bind_param("s", $adminKey);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Admin key is already in use!"]);
} 
else {
    $fullName = $_POST['fullName'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $organization = $_POST['organization'];

    $insertStmt = $conn->prepare("INSERT INTO admins (fullName, email, password, organization, adminKey) VALUES (?, ?, ?, ?, ?)");
    $insertStmt->bind_param("sssss", $fullName, $email, $password, $organization, $adminKey);

    if ($insertStmt->execute()) {
        echo json_encode(["success" => true, "message" => "Admin account created successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Email already exists!"]);
    }
    $insertStmt->close();
}

$stmt->close();
$conn->close();
?>
