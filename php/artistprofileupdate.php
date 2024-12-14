<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $location = $_POST['location'];
    $bio = $_POST['bio'];
    $image = $_FILES['image'];

    if ($image && $image['tmp_name']) {
        $imagePath = 'uploads/artists/' . uniqid() . '-' . $image['name'];
        move_uploaded_file($image['tmp_name'], $imagePath);
    } else {
        $imagePath = null;
    }

    try {
        $stmt = $pdo->prepare("UPDATE artists SET name = ?, location = ?, bio = ?, image = COALESCE(?, image) WHERE email = ?");
        $stmt->execute([$name, $location, $bio, $imagePath, $email]);
        echo "ok";
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
