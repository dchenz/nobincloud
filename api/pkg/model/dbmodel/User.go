package dbmodel

type User struct {
	ID             int64
	FirstName      string
	LastName       string
	Email          string
	HashedPassword string
}
