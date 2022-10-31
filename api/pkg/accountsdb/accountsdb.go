package accountsdb

import (
	"crypto/sha512"
	"database/sql"
	"encoding/hex"
	"nobincloud/pkg/model"
	"nobincloud/pkg/model/dbmodel"

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
	storedPassword, err := deriveStoredPassword(
		user.ClientHashedPassword,
		[]byte(user.Email),
	)
	if err != nil {
		return err
	}
	return a.createUserAccount(dbmodel.UserAccount{
		FirstName:      user.FirstName,
		LastName:       user.LastName,
		Email:          user.Email,
		HashedPassword: storedPassword,
	})
}

func (a *AccountsDB) CheckUserCredentials(creds model.LoginRequest) (bool, error) {
	storedPassword, err := deriveStoredPassword(
		creds.ClientHashedPassword,
		[]byte(creds.Email),
	)
	if err != nil {
		return false, err
	}
	return a.userAccountPasswordMatches(creds.Email, storedPassword)
}

func (a *AccountsDB) GetUserAccount(email string) (*model.UserAccount, error) {
	return a.userAccountInfo(email)
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
