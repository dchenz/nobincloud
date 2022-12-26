//go:build integration
// +build integration

package database_test

import (
	"os"
	"testing"

	"github.com/dchenz/nobincloud/pkg/database"
	"github.com/dchenz/nobincloud/pkg/model"

	"github.com/stretchr/testify/assert"
)

func mockDB() *database.Database {
	dbString := os.Getenv("MYSQL_DB")
	if dbString == "" {
		panic("missing MYSQL_DB for testing")
	}
	dbString = dbString + "/user_data"
	db, err := database.NewDatabase(dbString)
	if err != nil {
		panic(err)
	}
	return db
}

func TestLogin(t *testing.T) {
	db := mockDB()

	err := db.CreateUserAccount(model.NewUserRequest{
		Email:                "example@example.com",
		Nickname:             "test",
		PasswordHash:         "abcdefabcdef",
		AccountEncryptionKey: "aaaaaaaaaaaa",
	})
	assert.NoError(t, err)

	// Incorrect password.
	isLoggedIn, err := db.CheckUserCredentials(model.LoginRequest{
		Email:        "example@example.com",
		PasswordHash: "abababababab",
	})
	assert.NoError(t, err)
	assert.False(t, isLoggedIn)

	// Email doesn't exist.
	isLoggedIn, err = db.CheckUserCredentials(model.LoginRequest{
		Email:        "hello@example.com",
		PasswordHash: "abcdefabcdef",
	})
	assert.NoError(t, err)
	assert.False(t, isLoggedIn)

	// Correct credentials.
	isLoggedIn, err = db.CheckUserCredentials(model.LoginRequest{
		Email:        "example@example.com",
		PasswordHash: "abcdefabcdef",
	})
	assert.NoError(t, err)
	assert.True(t, isLoggedIn)
}
