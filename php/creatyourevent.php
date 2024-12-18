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

    // Function to generate the next image name
    function generateImageName($conn, $column, $prefix) {
        $sql = "SELECT $column FROM events ORDER BY event_id DESC LIMIT 1";
        $result = mysqli_query($conn, $sql);
        $lastImageName = $result && mysqli_num_rows($result) > 0 ? mysqli_fetch_assoc($result)[$column] : null;

        if ($lastImageName) {
            // Extract numeric part and increment
            preg_match('/\d+/', $lastImageName, $matches);
            $number = $matches ? (int)$matches[0] + 1 : 1;
        } else {
            $number = 1; // Start with 1 if no images exist
        }

        return $prefix . str_pad($number, 6, '0', STR_PAD_LEFT);
    }

    $posterImagePath = null;
    $coverImagePath = null;

    if ($posterImageData) {
        $posterImageName = generateImageName($conn, 'poster_image', 'pimg-');
        $posterImagePath = "../images/poster/" . $posterImageName . ".png";
        file_put_contents($posterImagePath, base64_decode($posterImageData));
    }

    if ($coverImageData) {
        $coverImageName = generateImageName($conn, 'cover_image', 'cimg-');
        $coverImagePath = "../images/cover/" . $coverImageName . ".png";
        file_put_contents($coverImagePath, base64_decode($coverImageData));
    }

    $sql = "
        INSERT INTO events (`event_name`, `description`, `event_type`, `performer_id`, `event_date`, `event_time`, `poster_image`, `cover_image`)
        VALUES ('$event_name', '$description', '$event_type', '$performer', '$date', '$time', '$posterImageName', '$coverImageName')
    ";
    if (mysqli_query($conn, $sql)) {
        echo json_encode(['success' => true, 'message' => 'Event created successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Database insertion failed.']);
    }
}
?>
