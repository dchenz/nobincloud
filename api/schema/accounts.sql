CREATE TABLE IF NOT EXISTS user_accounts (
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
