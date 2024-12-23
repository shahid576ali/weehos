<?php
include("db.php");

// Function to get the last filename for a specific image type (poster or cover)
function getLastImageFilename($conn, $prefix) {
    $column = $prefix === 'posterImage' ? 'poster_image' : 'cover_image';
    $sql = "SELECT $column FROM `events` ORDER BY $column DESC LIMIT 1";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row[$column];
    } else {
        return $prefix . "-0000000.jpg"; // Default if no image exists
    }
}

// Function to increment the filename
function incrementFilename($filename, $prefix) {
    $num = intval(substr($filename, strlen($prefix) + 1, 7)) + 1;
    return $prefix . "-" . sprintf("%07d", $num) . ".jpg";
}

// Function to save image and return the new filename
function saveImage($imageFile, $prefix, $conn) {
    $targetDir = $prefix === 'posterImage' ? "event_image/poster/" : "event_image/cover/";
    $lastFilename = getLastImageFilename($conn, $prefix);
    $newFilename = incrementFilename($lastFilename, $prefix);
    $newImagePath = $targetDir . $newFilename;

    if (isset($imageFile) && $imageFile["error"] === UPLOAD_ERR_OK) {
        if (move_uploaded_file($imageFile["tmp_name"], $newImagePath)) {
            return $newFilename;
        } else {
            throw new Exception("Error uploading the " . $prefix . " image.");
        }
    } else {
        throw new Exception("Invalid or missing " . $prefix . " image.");
    }
}

// Function to save event details
function saveEventDetails($conn, $posterFilename, $coverFilename) {
    $name = $_POST["event_name"];
    $description = $_POST["description"];
    $type = $_POST["event_type"];
    $performer = $_POST["performer"];
    $date = $_POST["date"];
    $time = $_POST["time"];

    $sql = "INSERT INTO `events`(`event_name`, `description`, `event_type`, `performer_id`, `event_date`, `event_time`, `poster_image`, `cover_image`) VALUES ('$name','$description','$type','$performer','$date','$time','$posterFilename','$coverFilename')";

    if ($conn->query($sql) === TRUE) {
        echo "Event successfully saved.";
    } else {
        throw new Exception("Database error: " . $conn->error);
    }
}

// Check if form submitted with file
if (isset($_POST["event_name"])) {
    $conn->begin_transaction();
    try {
        $posterFilename = saveImage($_FILES["posterImageData"], "posterImage", $conn);
        $coverFilename = saveImage($_FILES["coverImage"], "coverImage", $conn);
        saveEventDetails($conn, $posterFilename, $coverFilename);
        $conn->commit();
    } catch (Exception $e) {
        $conn->rollback();
        echo "Transaction failed: " . $e->getMessage();
    }
} else {
    echo "Required fields or files are missing.";
}

$conn->close();
?>
