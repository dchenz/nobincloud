package database

import (
	"github.com/google/uuid"
)

func (a *Database) findFileID(fileUUID uuid.UUID) (int, error) {
	q := `SELECT id
		  FROM files
		  WHERE public_id = ?`
	res := a.conn.QueryRow(q, fileUUID[:])
	var fileID int
	err := res.Scan(&fileID)
	return fileID, err
}

func (a *Database) findFolderID(folderUUID uuid.UUID) (int, error) {
	q := `SELECT id
		  FROM folders
		  WHERE public_id = ?`
	res := a.conn.QueryRow(q, folderUUID[:])
	var folderID int
	err := res.Scan(&folderID)
	return folderID, err
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

func (a *Database) findFolderUUID(id int) (uuid.UUID, error) {
	q := `SELECT public_id
		  FROM folders
		  WHERE id = ?`
	res := a.conn.QueryRow(q, id)
	var folderID []byte
	if err := res.Scan(&folderID); err != nil {
		return uuid.Nil, err
	}
	return uuid.ParseBytes(folderID)
}
