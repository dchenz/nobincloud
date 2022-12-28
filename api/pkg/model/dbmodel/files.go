package dbmodel

import (
	"database/sql"
)

type File struct {
	ID            int
	PublicID      []byte
	Name          string
	Owner         int
	ParentFolder  sql.NullInt32
	SavedLocation string
}

type Folder struct {
	ID           int
	PublicID     []byte
	Name         string
	Owner        int
	ParentFolder sql.NullInt32
	Color        sql.NullInt32
}
