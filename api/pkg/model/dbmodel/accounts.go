package dbmodel

import "time"

type UserAccount struct {
	ID           int64
	CreatedAt    time.Time
	Email        string
	Nickname     string
	PasswordHash []byte
	PasswordSalt []byte
	WrappedKey   []byte
}
