//go:build integration
// +build integration

package accountsdb_test

import (
	"nobincloud/pkg/accountsdb"
	"nobincloud/pkg/model"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func mockDB() *accountsdb.AccountsDB {
	dbString := os.Getenv("MYSQL_DB")
	if dbString == "" {
		panic("missing MYSQL_DB for testing")
	}
	dbString = dbString + "/accounts"
	db, err := accountsdb.NewAccountsDB(dbString)
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
