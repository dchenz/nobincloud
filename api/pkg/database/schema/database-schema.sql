CREATE DATABASE IF NOT EXISTS `user_data`;
USE `user_data`;
DROP TABLE IF EXISTS `user_accounts`;
CREATE TABLE `user_accounts` (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,

    -- Registration time (UTC).
    created_at DATETIME NOT NULL,

    -- Whatever the users want us to call them.
    nickname VARCHAR(50) NOT NULL,

    -- Main identifier of the account.
    email VARCHAR(256) UNIQUE NOT NULL,

    -- Used for salting password for storage.
    -- Stays the same for the life of the account.
    password_salt BINARY(16) NOT NULL,

    -- Hash of password used for verifying login.
    --
    -- Sent by client: SHA512(SCRYPT(password, email, 32) + password)
    -- Stored as: PBKDF2(sha512, client_hash, salt, 100000, 64)
    --
    -- Must be updated when user changes their email or password.
    password_hash BINARY(64) NOT NULL,

    -- An AES256 key encrypted using AES256-GCM on the client
    -- using their password-derived key (Scrypt).
    --
    -- Must be updated when user changes their email or password.
    account_encryption_key BINARY(60) NOT NULL

);
DROP TABLE IF EXISTS `folders`;
CREATE TABLE `folders` (
    -- Common between files and folders.
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    public_id BINARY(16) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES user_accounts(id),
    parent_folder_id INTEGER REFERENCES folders(id),
    -- Folder-specific fields.
    color INTEGER
);
DROP TABLE IF EXISTS `files`;
CREATE TABLE `files` (
    -- Common between files and folders.
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    public_id BINARY(16) NOT NULL UNIQUE,
    name BLOB NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES user_accounts(id),
    encryption_key BINARY(60) NOT NULL,
    parent_folder_id INTEGER REFERENCES folders(id),
    -- File-specific fields.
    saved_location TEXT NOT NULL,
    thumbnail BLOB,
    mimetype VARCHAR(256) NOT NULL
);
