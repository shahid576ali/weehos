<?php
header('Content-Type: application/json');

include 'db.php';

try {
    $sql = "
        SELECT 
            user.user_id,
            user.name,
            user.email,
            user.phone,
            user.user_type,
            COALESCE(admin.organization, artist.genre) AS organization_genre,
            CASE 
                WHEN user.photo IS NOT NULL THEN CONCAT('images/allusers/', user.photo)
                ELSE NULL
            END AS photo
        FROM users user
        LEFT JOIN admins admin ON user.user_id = admin.user_id
        LEFT JOIN artists artist ON user.user_id = artist.user_id
    ";

    $result = $conn->query($sql);

    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    echo json_encode(['success' => true, 'data' => $data]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} finally {
    $conn->close();
}
?>
