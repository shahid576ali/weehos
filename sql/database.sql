CREATE DATABASE weeho;

USE weeho;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE artists (
    artist_id INT AUTO_INCREMENT PRIMARY KEY,
    artistName VARCHAR(50) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bio TEXT
);

CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    organization VARCHAR(100),
    adminKey VARCHAR(50) NOT NULL UNIQUE
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
