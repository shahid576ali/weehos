CREATE DATABASE weeho;

USE weeho;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('user', 'artist', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    genre VARCHAR(50) NOT NULL,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    organization VARCHAR(100),
    adminKey VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    event_type INT NOT NULL,
    performer_id INT NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    poster_image VARCHAR(255),
    cover_image VARCHAR(255),
    FOREIGN KEY (performer_id) REFERENCES artists(artist_id)
);

CREATE TABLE performers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    description TEXT NOT NULL,
    age INT NOT NULL,
    area_of_talent VARCHAR(255) NOT NULL,
    professional_or_amateur VARCHAR(50) NOT NULL,
    experience TEXT,
    about TEXT,
    image VARCHAR(255) NOT NULL
);
