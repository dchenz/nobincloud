package accountsdb

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

type AccountsDB struct {
	conn *sql.DB
}

func NewAccountsDB(dbString string) (*AccountsDB, error) {
	conn, err := sql.Open("mysql", dbString)
	if err != nil {
		return nil, err
	}
	return &AccountsDB{
		conn: conn,
	}, nil
}
