<?php
// include('db.php');

$upload_dir = 'images/cover/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['image-upload'])) {
    $file = $_FILES['image-upload'];
    $alt = $_POST['image-alt'];
    if ($file['error'] === UPLOAD_ERR_OK) {
        if ($file['size'] > 1 * 1024 * 1024) {
            echo json_encode(['status' => 'error', 'message' => 'File size exceeds 1MB limit.']);
            exit;
        }
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $upload_dir . 'HomeCover_' . time() . '.jpg';
        if (move_uploaded_file($file['tmp_name'], $filename)) {
            echo json_encode(['status' => 'success', 'src' => $filename, 'alt' => $alt]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to move uploaded file.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'File upload error.']);
    }
    exit;
}
?>
