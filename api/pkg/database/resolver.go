package database

func (a *Database) findAccountID(email string) (int, error) {
	q := `SELECT id
		  FROM user_accounts
		  WHERE email = ?;`
	res := a.conn.QueryRow(q, email)
	var accountID int
	err := res.Scan(&accountID)
	return accountID, err
}
