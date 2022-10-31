package accountsdb

import (
	"nobincloud/pkg/model"
	"nobincloud/pkg/model/dbmodel"
	"nobincloud/pkg/utils"
)

func (a *AccountsDB) createUserAccount(user dbmodel.UserAccount) error {
	q := `INSERT INTO user_accounts(
			created_at,
			first_name,
			last_name,
			email,
			hashed_password
		  ) VALUES(?, ?, ?, ?, ?);`
	_, err := a.Conn.Exec(
		q,
		utils.TimeNow(),
		user.FirstName,
		user.LastName,
		user.Email,
		user.HashedPassword,
	)
	if err != nil {
		return err
	}
	return nil
}

func (a *AccountsDB) userAccountEmailExists(email string) (bool, error) {
	q := `SELECT 1
	      FROM user_accounts
		  WHERE email = ?;`
	rows, err := a.Conn.Query(q, email)
	if err != nil {
		return false, err
	}
	return rows.Next(), nil
}

func (a *AccountsDB) userAccountPasswordMatches(email string, p []byte) (bool, error) {
	q := `SELECT 1
		  FROM user_accounts
		  WHERE email = ? AND hashed_password = ?;`
	rows, err := a.Conn.Query(q, email, p)
	if err != nil {
		return false, err
	}
	return rows.Next(), nil
}

func (a *AccountsDB) userAccountInfo(email string) (*model.UserAccount, error) {
	q := `SELECT
		  	first_name,
			last_name,
			email
		  FROM user_accounts
		  WHERE email = ?;`
	rows := a.Conn.QueryRow(q, email)
	var user model.UserAccount
	if err := rows.Scan(&user.FirstName, &user.LastName, &user.Email); err != nil {
		return nil, err
	}
	return &user, nil
}
