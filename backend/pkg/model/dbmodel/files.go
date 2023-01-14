package dbmodel

import (
	"database/sql"
)

type File struct {
	ID            int
	PublicID      []byte
	Owner         int
	ParentFolder  sql.NullInt32
	EncryptionKey []byte
	Metadata      []byte
	SavedLocation string
}

type Folder struct {
	ID            int
	PublicID      []byte
	Owner         int
	ParentFolder  sql.NullInt32
	EncryptionKey []byte
	Metadata      []byte
}
