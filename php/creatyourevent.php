<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $event_name = $_POST['event_name'] ?? null;
    $description = $_POST['description'] ?? null;
    $event_type = $_POST['event_type'] ?? null;
    $performer = $_POST['performer'] ?? null;
    $date = $_POST['date'] ?? null;
    $time = $_POST['time'] ?? null;
    $posterImageData = $_POST['posterImageData'] ?? null;
    $coverImageData = $_POST['coverImageData'] ?? null;

    if (!$event_name || !$description || !$event_type || !$performer || !$date || !$time) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }

    $posterImagePath = null;
    $coverImagePath = null;

    if ($posterImageData) {
        $posterImagePath = "uploads/posterimages/" . uniqid() . ".png";
        file_put_contents($posterImagePath, base64_decode($posterImageData));
    }

    if ($coverImageData) {
        $coverImagePath = "uploads/coverimages/" . uniqid() . ".png";
        file_put_contents($coverImagePath, base64_decode($coverImageData));
    }

    try {
        $stmt = $pdo->prepare("
            INSERT INTO events (event_name, description, event_type, performer_id, event_date, event_time, poster_image, cover_image)
            VALUES (:event_name, :description, :event_type, :performer_id, :event_date, :event_time, :poster_image, :cover_image)
        ");
        $stmt->execute([
            ':event_name' => $event_name,
            ':description' => $description,
            ':event_type' => $event_type,
            ':performer_id' => $performer,
            ':event_date' => $date,
            ':event_time' => $time,
            ':poster_image' => $posterImagePath,
            ':cover_image' => $coverImagePath,
        ]);

        echo json_encode(['success' => true, 'message' => 'Event created successfully!']);
    } 
    catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to create event: ' . $e->getMessage()]);
    }
}
?>