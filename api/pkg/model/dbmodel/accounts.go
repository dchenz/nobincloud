package dbmodel

type UserAccount struct {
	ID             int64
	FirstName      string
	LastName       string
	Email          string
	HashedPassword []byte
}
