package usersdb

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

type UsersDB struct {
	conn *sql.DB
}

func NewUsersDB(dbString string) (*UsersDB, error) {
	conn, err := sql.Open("mysql", dbString)
	if err != nil {
		return nil, err
	}
	return &UsersDB{
		conn: conn,
	}, nil
}
