<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $description = $_POST['description'] ?? null;
    $age = $_POST['age'];
    $area_of_talent = $_POST['area_of_talent'];
    $other_talent = $_POST['other_talent'] ?? null;
    $final_talent = ($area_of_talent === "Others") ? $other_talent : $area_of_talent;
    $professional_or_amateur = $_POST['professional_or_amateur'];
    $experience = $_POST['experience'];
    $about = $_POST['about'];

    $image = $_FILES['image'];
    if ($image['size'] > 1048576) { // 1 MB = 1048576 bytes
        echo "Image size must be less than 1 MB.";
        exit;
    }
    $targetDir = "images/uploads/";
    $imagePath = $targetDir . basename($image['name']);
    move_uploaded_file($image['tmp_name'], $imagePath);

    $sql = "INSERT INTO performers (first_name, last_name, email, phone, description, age, area_of_talent, professional_or_amateur, experience, about, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssisssss", $firstName, $lastName, $email, $phone, $description, $age, $final_talent, $professional_or_amateur, $experience, $about, $imagePath);

    if ($stmt->execute()) {
        echo "Performer added successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
