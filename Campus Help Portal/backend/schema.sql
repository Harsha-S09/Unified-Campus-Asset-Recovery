CREATE DATABASE campushelp_db;
USE campushelp_db;

-- USERS TABLE
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LOST ITEMS TABLE
CREATE TABLE lost_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location_lost VARCHAR(255) NOT NULL,
    date_lost DATE NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    image_path VARCHAR(255),
    status ENUM('lost', 'found') DEFAULT 'lost',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- MESSAGES TABLE
CREATE TABLE messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    item_id INT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES lost_items(id) ON DELETE SET NULL
);

INSERT INTO users 
(name, email, student_id, phone, department, password, role, is_approved)
VALUES 
('Admin', 'admin@campushelp.com', 'ADMIN001', '9999999999', 'Administration', 'admin123', 'admin', TRUE);