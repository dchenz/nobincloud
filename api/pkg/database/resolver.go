package database

import (
	"database/sql"

	"github.com/google/uuid"
)

func (a *Database) findFolderID(id []byte) (int, error) {
	q := `SELECT id
		  FROM folders
		  WHERE public_id = ?`
	res := a.conn.QueryRow(q, id)
	var fileID int
	err := res.Scan(&fileID)
	return fileID, err
}

func (a *Database) findAccountID(email string) (int, error) {
	q := `SELECT id
		  FROM user_accounts
		  WHERE email = ?;`
	res := a.conn.QueryRow(q, email)
	var accountID int
	err := res.Scan(&accountID)
	return accountID, err
}

func (a *Database) sqlFolderID(folderID uuid.UUID) (sql.NullInt32, error) {
	var v sql.NullInt32
	if folderID != uuid.Nil {
		id, err := a.findFolderID(folderID[:])
		if err == sql.ErrNoRows {
			return v, &ErrFolderNotFound{ID: folderID}
		}
		if err != nil {
			return v, err
		}
		v.Valid = true
		v.Int32 = int32(id)
	}
	return v, nil
}
