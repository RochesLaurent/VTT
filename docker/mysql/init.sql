CREATE DATABASE IF NOT EXISTS onlyroll_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE onlyroll_db;

CREATE USER IF NOT EXISTS 'onlyroll_test'@'%' IDENTIFIED BY 'test_password';
GRANT ALL PRIVILEGES ON onlyroll_test.* TO 'onlyroll_test'@'%';

CREATE TABLE IF NOT EXISTS health_check (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status VARCHAR(50) NOT NULL DEFAULT 'OK',
    service_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO health_check (status, service_name) VALUES 
('Database initialized', 'mysql'),
('OnlyRoll ready', 'application');

FLUSH PRIVILEGES;

SELECT 'OnlyRoll Database initialized successfully!' as message;