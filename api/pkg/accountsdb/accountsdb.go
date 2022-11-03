package accountsdb

import (
	"crypto/sha512"
	"database/sql"
	"encoding/hex"
	"nobincloud/pkg/model"
	"nobincloud/pkg/model/dbmodel"
	"nobincloud/pkg/utils"

	"golang.org/x/crypto/pbkdf2"
)

type AccountsDB struct {
	Conn *sql.DB
}

func (a *AccountsDB) CreateUserAccount(user model.NewUserRequest) error {
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
	storedEncryptionKey, err := hex.DecodeString(user.WrappedKey)
	if err != nil {
		return err
	}
	return a.createUserAccount(dbmodel.UserAccount{
		Email:        user.Email,
		Nickname:     user.Nickname,
		PasswordHash: storedPassword,
		PasswordSalt: salt,
		WrappedKey:   storedEncryptionKey,
	})
}

func (a *AccountsDB) CheckUserCredentials(creds model.LoginRequest) (bool, error) {
	storedPassword, err := deriveStoredPassword(
		creds.PasswordHash,
		[]byte(creds.Email),
	)
	if err != nil {
		return false, err
	}
	return a.userAccountPasswordMatches(creds.Email, storedPassword)
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