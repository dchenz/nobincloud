package accountsdb

import (
	"database/sql"
	"encoding/hex"
	"fmt"
	"nobincloud/pkg/model"
	"nobincloud/pkg/model/dbmodel"
)

type AccountsDB struct {
	Conn *sql.DB
}

func (a *AccountsDB) CreateUserAccount(user model.NewUserRequest) error {
	exists, err := a.userAccountEmailExists(user.Email)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("duplicate email")
	}
	passwordHashBytes, err := hex.DecodeString(user.ClientHashedPassword)
	if err != nil {
		return err
	}
	return a.createUserAccount(dbmodel.UserAccount{
		FirstName:      user.FirstName,
		LastName:       user.LastName,
		Email:          user.Email,
		HashedPassword: passwordHashBytes,
	})
}
