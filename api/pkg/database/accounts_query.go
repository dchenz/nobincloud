package database

import (
	"crypto/sha512"
	"database/sql"
	"encoding/hex"
	"nobincloud/pkg/model"
	"nobincloud/pkg/model/dbmodel"
	"nobincloud/pkg/utils"

	"golang.org/x/crypto/pbkdf2"
)

func (a *Database) CreateUserAccount(user model.NewUserRequest) error {
	// Emails cannot be re-used across accounts.
	exists, err := a.userAccountEmailExists(user.Email)
	if err != nil {
		return err
	}
	if exists {
		return ErrDuplicateEmail
	}
	salt, err := utils.RandomBytes(16)
	if err != nil {
		return err
	}
	storedPassword, err := deriveStoredPassword(
		user.PasswordHash,
		salt,
	)
	if err != nil {
		return err
	}
	storedEncryptionKey, err := hex.DecodeString(user.AccountEncryptionKey)
	if err != nil {
		return err
	}
	return a.createUserAccount(dbmodel.UserAccount{
		Email:                user.Email,
		Nickname:             user.Nickname,
		PasswordHash:         storedPassword,
		PasswordSalt:         salt,
		AccountEncryptionKey: storedEncryptionKey,
	})
}

func (a *Database) CheckUserCredentials(creds model.LoginRequest) (bool, error) {
	passwordSalt, err := a.getAccountPasswordSalt(creds.Email)
	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	storedPassword, err := deriveStoredPassword(creds.PasswordHash, passwordSalt)
	if err != nil {
		return false, err
	}
	return a.userAccountPasswordMatches(creds.Email, storedPassword)
}

func (a *Database) GetAccountEncryptionKey(email string) (string, error) {
	key, err := a.getAccountWrappedKey(email)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(key), nil
}

func deriveStoredPassword(password string, salt []byte) ([]byte, error) {
	// Convert hex password into bytes.
	passwordBytes, err := hex.DecodeString(password)
	if err != nil {
		return nil, err
	}
	// Password hash is hashed another 100k times before storage.
	return pbkdf2.Key(
		passwordBytes,
		salt,
		100000,
		64,
		sha512.New,
	), nil
}
