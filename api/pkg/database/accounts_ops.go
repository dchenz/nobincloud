package database

import (
	"nobincloud/pkg/model/dbmodel"
	"nobincloud/pkg/utils"
)

func (a *Database) createUserAccount(user dbmodel.UserAccount) error {
	q := `INSERT INTO user_accounts(
			created_at,
			nickname,
			email,
			password_salt,
			password_hash,
			account_encryption_key
		  ) VALUES(?, ?, ?, ?, ?, ?);`
	_, err := a.conn.Exec(
		q,
		utils.TimeNow(),
		user.Nickname,
		user.Email,
		user.PasswordSalt,
		user.PasswordHash,
		user.AccountEncryptionKey,
	)
	if err != nil {
		return err
	}
	return nil
}

func (a *Database) userAccountEmailExists(email string) (bool, error) {
	q := `SELECT 1
	      FROM user_accounts
		  WHERE email = ?;`
	rows, err := a.conn.Query(q, email)
	if err != nil {
		return false, err
	}
	return rows.Next(), nil
}

func (a *Database) userAccountPasswordMatches(email string, p []byte) (bool, error) {
	q := `SELECT 1
		  FROM user_accounts
		  WHERE email = ? AND password_hash = ?;`
	rows, err := a.conn.Query(q, email, p)
	if err != nil {
		return false, err
	}
	return rows.Next(), nil
}

func (a *Database) getAccountPasswordSalt(email string) ([]byte, error) {
	q := `SELECT password_salt
		  FROM user_accounts
		  WHERE email = ?;`
	row := a.conn.QueryRow(q, email)
	var salt []byte
	if err := row.Scan(&salt); err != nil {
		return nil, err
	}
	return salt, nil
}

func (a *Database) getAccountWrappedKey(email string) ([]byte, error) {
	q := `SELECT account_encryption_key
		  FROM user_accounts
		  WHERE email = ?;`
	row := a.conn.QueryRow(q, email)
	var key []byte
	if err := row.Scan(&key); err != nil {
		return nil, err
	}
	return key, nil
}
