//go:build integration
// +build integration

package database_test

import (
	"database/sql"
	"os"
	"testing"

	"github.com/dchenz/nobincloud/pkg/database"
	"github.com/dchenz/nobincloud/pkg/model"

	"github.com/stretchr/testify/assert"
)

func createMockDB() *database.Database {
	dbString := os.Getenv("TEST_MYSQL_DB")
	if dbString == "" {
		panic("missing TEST_MYSQL_DB for testing")
	}
	conn, err := sql.Open("mysql", dbString+"?multiStatements=true")
	if err != nil {
		panic(err)
	}
	schema, err := os.ReadFile("./schema/database-schema.sql")
	if err != nil {
		panic(err)
	}
	if _, err := conn.Exec(string(schema)); err != nil {
		panic(err)
	}
	if err := conn.Close(); err != nil {
		panic(err)
	}
	db, err := database.NewDatabase(dbString + "user_data")
	if err != nil {
		panic(err)
	}
	return db
}

func destroyMockDB() {
	dbString := os.Getenv("TEST_MYSQL_DB")
	if dbString == "" {
		panic("missing TEST_MYSQL_DB for testing")
	}
	conn, err := sql.Open("mysql", dbString+"user_data")
	if err != nil {
		panic(err)
	}
	if _, err := conn.Exec("DROP DATABASE user_data;"); err != nil {
		panic(err)
	}
}

func TestLogin(t *testing.T) {
	db := createMockDB()
	defer destroyMockDB()

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
