CREATE TABLE IF NOT EXISTS user_accounts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(256) UNIQUE NOT NULL,
    hashed_password BINARY(64) NOT NULL
);